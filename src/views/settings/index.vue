<template>
  <v-container fluid class="py-0">
    <settings-tool-bar @save="onClickSave" />

    <v-tabs>
      <v-tab>Общие параметры</v-tab>
      <v-tab-item><common-tab :settings="settings" /></v-tab-item>

      <v-tab>Сервисы</v-tab>
      <v-tab-item><services-tab :settings="settings" @create="onCreateService" /></v-tab-item>

      <v-tab>Задачи</v-tab>
      <v-tab-item><tasks-tab :tasks="tasks" /></v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsToolBar from './SettingsTooBar.vue';
import CommonTab from './CommonTab.vue';
import ServicesTab from './ServicesTab.vue';
import TasksTab from './TasksTab.vue';

export default Vue.extend({
  name: 'Settings',
  components: { SettingsToolBar, CommonTab, ServicesTab, TasksTab },
  data() {
    return {
      settings: {
        dispatcher_folder: '',
        dispatcher_url: '',
        dispatcher_password: '',
        rabbitmq_url: '',
        stackversion: '',
        share: '',
        upload: '',
        bin: '',
        jre: '',
        birt: '',
        dotnetcore: '',
        fullLogging: '',
        refresh_interval: 0,
      } as Settings,
      tasks: [] as Task[],
    };
  },
  methods: {
    onClickSave() {
      for (const key of Object.keys(this.settings) as string[]) {
        this.$store.dispatch('mainStore/setSettings', { key, data: this.settings[key] });
      }
      this.$store.dispatch('mainStore/setSettings', { key: 'tasks', data: this.tasks });
    },
    async onCreateService(service: string) {
      await this.$store.dispatch('mainStore/setSettings', { key: service, data: this.settings[service] });
      await this.$store.dispatch('projectStore/createStaticApp', service);
    },
  },
  async mounted() {
    for (const key of Object.keys(this.settings) as string[]) {
      this.settings[key] = await this.$store.dispatch('mainStore/getSettings', { key });
    }
    this.tasks = await this.$store.dispatch('mainStore/getSettings', { key: 'tasks' });
  },
});
</script>
