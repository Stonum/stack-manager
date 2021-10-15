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
      <v-col cols="2">
        <v-btn @click="onClick">Сохранить настройки</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['getNginx', 'getDisp', 'getStackVersion']),
  },
  data() {
    return {
      disp_url: '',
      stack_version: '',
      nginx: '',
    };
  },
  methods: {
    onClick() {
      this.$store.dispatch('saveConfig', {
        disp: this.disp_url,
        nginx: this.nginx,
        stackversion: this.stack_version,
      });
    },
  },
  mounted() {
    this.nginx = this.getNginx;
    this.disp_url = this.getDisp;
    this.stack_version = this.getStackVersion;
  },
});
</script>
