<template>
   <app-bar title="Главная">
      <v-btn plain title="Перезапустить диспетчер" :loading="isDispLoading" @click="onReloadDisp">Перезапустить
         диспетчер</v-btn>
      <v-btn plain icon title="Обновить состояния" @click="emit('refresh')">
         <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn plain title="Список изменений" icon to="/changelog">
         <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
   </app-bar>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['reload', 'refresh']);

const isDispLoading = ref(false);

const onReloadDisp = () => {
   isDispLoading.value = true;
   //await this.$store.dispatch('mainStore/restartDisp');
   setTimeout(() => {
      isDispLoading.value = false;
   }, 1000);
   emit('reload');
}
</script>
