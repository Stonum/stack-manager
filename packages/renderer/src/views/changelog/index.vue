<template>
  <app-bar title="Список изменений" />

  <v-container fluid>
    <div class="markdown" v-html="state" />
  </v-container>
</template>

<script setup lang="ts">
import { useIpcRendererInvokeAsync } from '@/composables';

const { state } = useIpcRendererInvokeAsync('main', { message: 'getChangeLog' }, null);
</script>