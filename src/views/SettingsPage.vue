<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field v-model="disp_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="stack_version" label="Каталог Stack_Version" />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="nginx" label="Каталог nginx" />
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col align-self="end" cols="3">
        <v-btn @click="onClick">Сохранить настройки</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { getBackendData, setBackendData } from '@/middleware/index';

export default Vue.extend({
  data() {
    return {
      disp_url: '',
      stack_version: '',
      nginx: '',
    };
  },
  methods: {
    onClick() {
      setBackendData('saveConfig', {
        disp: this.disp_url,
        nginx: this.nginx,
        stackversion: this.stack_version,
      });
    },
  },
  async created() {
    const config = await getBackendData('getConfig');
    if (config) {
      this.nginx = config.nginx;
      this.disp_url = config.disp;
      this.stack_version = config.stackversion;
    }
  },
});
</script>
