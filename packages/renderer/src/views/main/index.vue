<template>
  <main-tool-bar />

  <v-progress-linear v-if="isLoading" indeterminate />
  <p v-else-if="!items.length" style="text-align: center">
    Проектов пока нет.
  </p>
  <v-container v-else fluid>
    <v-draggable :list="items" class="v-row" item-key="name" @change="onMoveProject">
      <template #item="{ element, index }">
        <v-col cols="3" class="d-flex pa-2">
          <project-card :id="index" :item="element" @refresh="execute" />
        </v-col>
      </template>
    </v-draggable>
  </v-container>

  <!-- <fill-projects-dialog
      v-if="visibleFillDlg"
      @close="
        visibleFillDlg = false;
        onRefresh();
      "
    /> -->
</template>

<script setup lang="ts">
import { useIpcRendererInvokeAsync } from '@/composables/useIpcRendererInvokeAsync';
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';

import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectCard from './ProjectCard/ProjectCard.vue';

const { state: items, isLoading, execute } = useIpcRendererInvokeAsync<Project[]>('project', { message: 'getAll' }, [], { immediate: true, shallow: false, resetOnExecute: false });

const onMoveProject = (payload: any) => {
  useIpcRendererInvoke('project', { message: 'moveProject', oldIndex: payload.moved.oldIndex, newIndex: payload.moved.newIndex });
};
</script>