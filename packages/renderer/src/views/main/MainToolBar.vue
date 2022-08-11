<template>
  <app-bar title="Главная">
    <v-btn plain title="Перезапустить диспетчер" :loading="isLoading" @click="execute()">
      Перезапустить
      диспетчер
    </v-btn>
    <v-btn plain icon=">mdi-refresh" title="Обновить состояния" @click="emit('refresh')" />
    <v-btn plain icon="mdi-help-circle-outline" title="Список изменений" to="/changelog" />
  </app-bar>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue';
import { useIpcRendererInvoke } from '/@/composables/useIpcRendererInvoke';

const emit = defineEmits(['refresh']);

const { state, isReady, isLoading, execute } = useIpcRendererInvoke('main', { message: 'restartDispatcher' }, false, {
    immediate: false,
  });

   watchEffect(() => {
      if (isReady.value && state.value) {
         emit('refresh');
      }
   });


</script>
