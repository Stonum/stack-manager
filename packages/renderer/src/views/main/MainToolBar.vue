<template>
  <app-bar title="Главная">
    <v-btn title="Перезапустить диспетчер" :loading="isLoading" @click="execute()"> Перезапустить диспетчер </v-btn>
    <v-btn icon="mdi-refresh" title="Обновить состояния" @click="emit('refresh')" />
    <v-btn icon="mdi-help-circle-outline" title="Список изменений" to="/changelog" />
  </app-bar>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/shared';
import { useIpcRendererInvokeAsync } from '@/composables/useIpcRendererInvokeAsync';

const emit = defineEmits(['refresh']);

const { isReady, isLoading, execute } = useIpcRendererInvokeAsync('main', { message: 'restartDispatcher' }, false, { immediate: false });

whenever(isReady, () => emit('refresh'));
</script>