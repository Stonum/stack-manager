<template>
  <settings-tool-bar @save="onClickSave" />
  
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
import { onMounted, reactive, shallowRef, toRefs } from 'vue';

import { useIpcRendererInvokeAsync } from '@/composables/useIpcRendererInvokeAsync';
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';

import SettingsToolBar from './SettingsTooBar.vue';
import CommonTab from './CommonTab.vue';
import ServicesTab from './ServicesTab.vue';
import TasksTab from './TasksTab.vue';
import { ref } from 'vue';

const tab = ref(null);

// const settings = shallowRef({});
const { state: settings } = useIpcRendererInvokeAsync<Settings>('main', { message: 'getSettings', key: {} }, { }, { immediate: true, shallow: false });


// onMounted(async () => {
//    settings.value = await useIpcRendererInvoke('main', { message: 'getSettings', key: {} });
//    console.log(settings);
// });

const onCreateService = () => { };
const onClickSave = () => { };

</script>