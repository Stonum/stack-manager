<template>
  <app-bar>
    <v-btn plain icon title="Перезапустить диспетчер" :loading="onDispLoading" @click="onReloadDisp"><v-icon>mdi-reload</v-icon></v-btn>
    <v-btn plain icon title="Обновить список" @click="onRefresh"><v-icon>mdi-refresh</v-icon></v-btn>
  </app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MainToolBar',
  data() {
    return {
      onDispLoading: false,
    };
  },
  methods: {
    onRefresh() {
      this.$emit('refresh');
    },
    async onReloadDisp() {
      this.onDispLoading = true;
      await this.$store.dispatch('mainStore/restartDisp');
      this.onDispLoading = false;
      this.$emit('reload');
    },
  },
});
</script>
