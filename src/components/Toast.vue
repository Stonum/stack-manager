<template>
  <v-snackbar v-model="visible" color="error" @click.native="visible = false" :timeout="4000">
    {{ text }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { ipcRenderer } from 'electron';

export default Vue.extend({
  name: 'Toast',
  data() {
    return {
      visible: false,
      text: null,
    };
  },
  created() {
    ipcRenderer.on('error', (event, payload: any) => {
      this.visible = true;
      this.text = payload;
    });
  },
});
</script>
