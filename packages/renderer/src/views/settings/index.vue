<template>
  <app-bar title="Настройки">
    <v-btn v-if="isChanged" @click="onClickSave">
      Сохранить настройки
    </v-btn>
  </app-bar>

  <v-tabs v-model="tab">
    <v-tab value="common">
      Общие параметры
    </v-tab>

    <v-tab value="service">
      Сервисы
    </v-tab>

    <v-tab value="tasks">
      Задачи
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="common" class="pt-2">
      <common-tab v-model="settings" />
    </v-window-item>

    <v-window-item value="service" class="pt-2">
      <services-tab v-model="settings" @create="onCreateService" />
    </v-window-item>

    <v-window-item value="tasks">
      <tasks-tab v-model:tasks="settings.tasks" />
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, isRef, Ref } from 'vue';
import { useIpcRendererInvokeAsync } from '@/composables/useIpcRendererInvokeAsync';
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';

import CommonTab from './CommonTab.vue';
import ServicesTab from './ServicesTab.vue';
import TasksTab from './TasksTab.vue';

const tab = ref(null);

const { state: settings, isReady } = useIpcRendererInvokeAsync<Settings>('main', { message: 'getSettings', key: {} }, {}, { immediate: true, shallow: false });


const saveSettingKey = async (key: string, data: string | boolean | number | Task[]) => { return useIpcRendererInvoke('main', { message: 'setSettings', key, data }); };
const normalizeObject = <T,>(obj: Ref<T> | T ): T => { return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj)); };

const onCreateService = async (service: string) => { 
   await saveSettingKey(service, settings.value[service]);
   if (service === 'birt' || service === 'dotnetcore') {
      await saveSettingKey(service + '_port', settings.value[service + '_port']);
   }
   await useIpcRendererInvoke('project', { message: 'createStaticApp', name: service });
};

const isChanged = ref(false);
const settingsBeforeChange = shallowRef<Settings>({});
watch(isReady, () => { isChanged.value = false; settingsBeforeChange.value = normalizeObject(settings); });
watch(settings, () => { isChanged.value = true; }, { deep: true });

const onClickSave = async () => { 
   for (const key in settings.value) {
      if (key !== 'tasks' && settings.value[key] !== settingsBeforeChange.value[key]) {
         await saveSettingKey(key, settings.value[key] );
      }
      if (key === 'tasks' && settings.value.tasks) {
         if (JSON.stringify(settings.value.tasks) !== JSON.stringify(settingsBeforeChange.value.tasks)) {
            await saveSettingKey(key, normalizeObject(settings.value.tasks) );
         }
      }
   }
   settingsBeforeChange.value = normalizeObject(settings);
   isChanged.value = false;
};

</script>