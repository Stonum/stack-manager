<template>
  <app-bar title="Главная">
    <v-btn title="Перезапустить диспетчер" :loading="isLoading" @click="execute()">
      Перезапустить диспетчер
    </v-btn>
    <v-btn icon="mdi-refresh" title="Обновить состояния" @click="loadStatuses()" />
    <v-btn icon="mdi-help-circle-outline" title="Список изменений" to="/changelog" />
  </app-bar>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/shared';
import { useIpcRendererInvokeAsync, useApp, useEvents } from '@/composables';

const { isReady, isLoading, execute } = useIpcRendererInvokeAsync('main', { message: 'restartDispatcher' }, false, { immediate: false });

const { loadStatuses } = useApp();
const { loadEvents } = useEvents();

whenever(isReady, () => { loadEvents(); loadStatuses(); } );
</script>