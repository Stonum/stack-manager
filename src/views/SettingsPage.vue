<template>
  <v-container>
    <app-bar>
      <v-btn plain @click="onClick">Сохранить настройки</v-btn>
    </app-bar>

    <v-row no-gutters>
      <v-col cols="8">
        <v-text-field v-model="dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
      </v-col>
      <v-spacer />
      <v-col cols="3">
        <v-text-field v-model="dispatcher_password" label="Пароль" type="password" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="stackversion" label="Каталог Stack_Version" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="nginx" label="Каталог nginx" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="bin" label="Каталог bin" clearable />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="fullLogging" label="Полное логирование ( включает логирование всех запросов после перезапуска )" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4"> Список задач </v-col>
      <v-col cols="1"> Порт </v-col>
    </v-row>
    <v-row v-for="task in tasks" :key="task.id" no-gutters>
      <v-col cols="4" :key="task.id">
        <v-checkbox :key="task.id" v-model="task.selected" :label="task.title" dense hide-details />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="task.port" type="number" dense hide-details clearable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import { setSettings, getSettings } from '@/middleware/index';

export default Vue.extend({
  data() {
    return {
      dispatcher_url: '',
      dispatcher_password: '',
      stackversion: '',
      nginx: '',
      bin: '',
      fullLogging: '',
      tasks: [] as Task[],
    };
  },
  methods: {
    onClick() {
      setSettings('dispatcher_url', this.dispatcher_url);
      setSettings('dispatcher_password', this.dispatcher_password);
      setSettings('stackversion', this.stackversion);
      setSettings('nginx', this.nginx);
      setSettings('bin', this.bin);
      setSettings('fullLogging', this.fullLogging);
      setSettings('tasks', this.tasks);

      this.$router.push('/');
    },
  },
  async created() {
    this.dispatcher_url = await getSettings('dispatcher_url');
    this.dispatcher_password = await getSettings('dispatcher_password');
    this.stackversion = await getSettings('stackversion');
    this.nginx = await getSettings('nginx');
    this.bin = await getSettings('bin');
    this.fullLogging = await getSettings('fullLogging');
    this.tasks = await getSettings('tasks');
  },
});
</script>
