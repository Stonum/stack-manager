<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field v-model="disp_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="stack_version" label="Каталог Stack_Version" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="nginx" label="Каталог nginx" clearable />
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
import SelectFolder from '@/components/SelectFolder.vue';

import { getBackendData, setBackendData } from '@/middleware/index';

export default Vue.extend({
  components: { SelectFolder },
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
