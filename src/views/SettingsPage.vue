<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field v-model="dispatcher" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
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
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="3" class="d-flex justify-end align-self-center">
        <v-btn @click="onClick">Сохранить настройки</v-btn>
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
      dispatcher: '',
      stackversion: '',
      nginx: '',
      bin: '',
    };
  },
  methods: {
    onClick() {
      setSettings('dispatcher', this.dispatcher);
      setSettings('stackversion', this.stackversion);
      setSettings('nginx', this.nginx);
      setSettings('bin', this.bin);
    },
  },
  async created() {
    this.dispatcher = await getSettings('dispatcher');
    this.stackversion = await getSettings('stackversion');
    this.nginx = await getSettings('nginx');
    this.bin = await getSettings('bin');
  },
});
</script>
