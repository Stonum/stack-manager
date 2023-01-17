<template>
  <app-bar title="Настройки">
    <v-btn v-if="isChanged" @click="saveSettings">
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

    <v-tab value="additional">
      Дополнительно
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item value="common" class="pt-2">
      <common-tab v-model="settings" />
    </v-window-item>

    <v-window-item value="service" class="pt-2" eager>
      <services-tab v-model="settings" @create="createService" />
    </v-window-item>

    <v-window-item value="tasks" eager>
      <tasks-tab v-model:tasks="settings.tasks" />
    </v-window-item>

    <v-window-item value="additional" eager>
      <additional-tab v-model="settings" />
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettings } from '@/composables';

import CommonTab from './CommonTab.vue';
import ServicesTab from './ServicesTab.vue';
import TasksTab from './TasksTab.vue';
import AdditionalTab from './AdditionalTab.vue';

const tab = ref(null);

const { settings, isChanged, saveSettings, createService } = useSettings();
</script>