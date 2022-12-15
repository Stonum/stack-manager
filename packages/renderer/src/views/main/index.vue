<template>
  <main-tool-bar />

  <v-progress-linear v-if="isLoading" indeterminate />
  <p v-else-if="!items.length" style="text-align: center">
    Проектов пока нет.
  </p>
  <v-container v-else fluid>
    <v-draggable :list="items" class="v-row" item-key="name" @change="onMoveProject">
      <template #item="{ element, index }">
        <v-col cols="6" md="4" lg="3" class="d-flex pa-2">
          <project-card :id="index" :item="element" @refresh="execute" />
        </v-col>
      </template>
    </v-draggable>
  </v-container>

  <fill-projects-dialog
    v-if="visibleDialog"
    @close="
      visibleDialog = false;
      unwatch();
      execute();
    "
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useIpcRendererInvokeAsync, useIpcRendererInvoke, useApp, useIntervalCall } from '@/composables';

import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectCard from './ProjectCard/ProjectCard.vue';
import FillProjectsDialog from './FillProjectsDialog.vue';

const { state: items, isLoading, execute } = useIpcRendererInvokeAsync<Project[]>('project', { message: 'getAll' }, [], { immediate: true, shallow: false, resetOnExecute: false });

const onMoveProject = (payload: any) => {
  useIpcRendererInvoke('project', { message: 'moveProject', oldIndex: payload.moved.oldIndex, newIndex: payload.moved.newIndex });
};

const { loadStatuses } = useApp();
useIntervalCall(loadStatuses);

const visibleDialog = ref(false);
const unwatch = watch(isLoading, () => {
   if (items.value.length === 0) {
      visibleDialog.value = true;
   }
});

</script>