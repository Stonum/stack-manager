<template>
  <app-bar>
    <v-btn plain title="Перезапустить диспетчер" :loading="onDispLoading" @click="onReloadDisp">Перезапустить диспетчер</v-btn>
    <v-btn plain icon title="Обновить список" @click="onRefresh"><v-icon>mdi-refresh</v-icon></v-btn>
    <v-btn plain title="Список изменений" icon to="/changelog"><v-icon>mdi-help-circle-outline</v-icon></v-btn>
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
