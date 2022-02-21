<template>
  <v-container fluid class="py-0">
    <settings-tool-bar @save="onClickSave" />

    <v-tabs>
      <v-tab>Общие параметры</v-tab>
      <v-tab-item><common-tab :settings="settings" /></v-tab-item>

      <v-tab>Задачи</v-tab>
      <v-tab-item><tasks-tab :tasks="tasks" /></v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsToolBar from './SettingsTooBar.vue';
import CommonTab from './CommonTab.vue';
import TasksTab from './TasksTab.vue';

import { setSettings, getSettings } from '@/middleware/index';

export default Vue.extend({
  name: 'Settings',
  components: { SettingsToolBar, CommonTab, TasksTab },
  data() {
    return {
      settings: {
        dispatcher_folder: '',
        dispatcher_url: '',
        dispatcher_password: '',
        stackversion: '',
        nginx: '',
        bin: '',
        fullLogging: '',
      } as Settings,
      tasks: [] as Task[],
    };
  },
  methods: {
    onClickSave() {
      for (const key of Object.keys(this.settings) as string[]) {
        setSettings(key, this.settings[key]);
      }
      setSettings('tasks', this.tasks);

      this.$router.push('/');
    },
  },
  async mounted() {
    for (const key of Object.keys(this.settings) as string[]) {
      this.settings[key] = await getSettings(key);
    }
    this.tasks = await getSettings('tasks');
  },
});
</script>
