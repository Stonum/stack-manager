<template>
  <app-bar :title="isNewProject ? `Создание проекта` : 'Редактирование проекта'">
    <v-btn :disabled="formValid === false || loading || state.building" :loading="state.building" @click="onBuildProject">
      {{ isNewProject ? 'Создать' : 'Пересобрать' }}
    </v-btn>
  </app-bar>

  <v-progress-linear v-if="loading" indeterminate />

  <v-form v-else v-model="formValid">
    <v-tabs v-model="tab">
      <v-row class="mx-3" no-gutters>
        <v-col cols="12" sm="10" md="6">
          <base-input v-model="project.name" required hide-details>
            <template #prepend>
              <span class="d-flex align-end"> Краткое название проекта </span>
            </template>
          </base-input>
        </v-col>
      </v-row>
      <v-tab value="common">
        Общие настройки
      </v-tab>

      <v-tab value="tasks">
        Веб приложения
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="common" class="pt-2" eager>
        <common-tab
          v-model="project"
          :is-new-project="isNewProject"
          :is-app-host="isAppHost"
          :inifiles="iniFiles"
          @update:ini-file="readIniFile()"
          @update:project-folder="onChangeFolder()"
          @update:project-type="changeType()"
        />
      </v-window-item>

      <v-window-item value="tasks" eager>
        <apps-tab v-model:apps="apps" :is-app-host="isAppHost" @select="onAppSelect" />
      </v-window-item>
    </v-window>
  </v-form>

  <yes-no-dialog
    v-if="ckecVersionResult.differentVersion"
    header="Версия в stack.ini отличается от текущей. Изменить?"
    :text="`${project.path.version} -> ${ckecVersionResult.newVersion}`"
    :width="700"
    @click="allowNewVersion"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import router from '@/router';
import { useProject, useSettings } from '@/composables';

import CommonTab from './CommonTab.vue';
import AppsTab from './AppsTab.vue';
import BaseInput from '@/components/Base/BaseInput.vue';

const props = defineProps<{ projectid: string }>();
const sourceId = !Number.isNaN(Number(router.currentRoute.value.query.from)) ? Number(router.currentRoute.value.query.from) : null;

const formValid = ref(false);
const tab = ref(null);
const iniFiles = ref([]);
const ckecVersionResult = ref({ differentVersion: false, newVersion: '' });

const isNewProject = computed(() => {
   return +props.projectid === -1;
});
const isAppHost = computed(() => {
   return project.value.type === 1;
});

const { project, loading, state, readFolder, readIniFile, buildProject, checkVersion, changeType } = useProject(+props.projectid, true, sourceId);
const { settings } = useSettings();

const onChangeFolder = async () => {
   iniFiles.value = await readFolder();
};

const allowNewVersion = (answer: boolean) => {
   project.value.path.version = answer ? ckecVersionResult.value.newVersion : project.value.path.version;
   ckecVersionResult.value.differentVersion = false;
};

const apps = ref<SelectableApp[]>([]);
const stopWatchProject = watch(
   project,
   async () => {
      if (settings.value.tasks) {
         apps.value = settings.value.tasks.map((task: Task) => {
            const app = project.value.apps.find((app) => app.id === task.id);
            return {
               ...task,
               name: '',
               path: '',
               port: null,
               args: '',
               active: true,
               selected: isNewProject.value && !sourceId ? task.selected : app ? true : false,
               ...app,
            };
         });
      }
      if (project.value.path.ini) {
         ckecVersionResult.value = await checkVersion();
      }
      if (sourceId) {
         for (const idx in apps.value) {
            if (apps.value[idx].selected) {
               onAppSelect(+idx, true);
            }
         }
      }
      stopWatchProject();
   }
);

const onAppSelect = (id: number, checked: boolean) => {
   if (!checked) {
      apps.value[id].name = '';
      apps.value[id].path = '';
   } else {
      apps.value[id].name = `api_${project.value.name}_${apps.value[id].prefix}`;
      apps.value[id].path = isAppHost.value ? '' : `/api/${project.value.name}/${apps.value[id].prefix}`;
   }
};

watch(
   () => project.value.name,
   () => {
      for (const idx in apps.value) {
         if (apps.value[idx].selected) {
            onAppSelect(+idx, true);
         }
      }
   }
);

const onBuildProject = async () => {
   project.value.apps = apps.value.filter((app) => app.selected);

   const res = await buildProject();
   if (res) {
      router.push('/');
   }
};
</script>
