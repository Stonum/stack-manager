<template>
  <v-card class="flex-grow-1" density="compact">
    <v-card-item class="py-0" :title="props.item.name" density="compact">
      <template #append>
        <v-progress-circular v-if="isRunning" class="mr-3" :size="20" :width="2" color="primary" :indeterminate="true" />
        <project-menu @delete="onDelete()" @edit="onEdit" @open-folder="openProjectFolder" />
      </template>
    </v-card-item>

    <project-actions :item="props.item" :state="state" @run="sendJob" />

    <v-list class="pt-0">
      <project-app v-for="(app, idxtask) in item.apps" :key="idxtask" :app="app" @restart="onRestart($event)" @start="onStart($event)" @stop="onStop($event)" />
    </v-list>
  </v-card>

  <yes-no-dialog v-if="askAboutDelete" header="Удаление проекта" :text="`Удалить проект ${item.name}?`" @click="onDelete($event)" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import router from '@/router';
import { useProject } from '@/composables';

import ProjectMenu from './ProjectMenu.vue';
import ProjectActions from './ProjectActions.vue';
import ProjectApp from './ProjectApp.vue';

const props = defineProps<{ item: Project; id: number }>();
const emit = defineEmits(['refresh']);

const askAboutDelete = ref(false);

const { sendJob, remove, openProjectFolder, state } = useProject(props.id);
const isRunning = computed(() => {
  return !!state?.building || !!state?.restarting;
});

const onDelete = async (answer?: boolean) => {
  askAboutDelete.value = false;
  if (answer === undefined) {
    askAboutDelete.value = true;
  } else if (answer) {
    await remove();
    emit('refresh');
  }
};

const onEdit = () => {
  router.push(`/project/${props.id}`);
};

const onRestart = (appName: string) => {
  sendJob('appReStart', appName);
};

const onStart = (appName: string) => {
  sendJob('appStart', appName);
};

const onStop = (appName: string) => {
  sendJob('appStop', appName);
};
</script>