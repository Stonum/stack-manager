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
          <project-card :id="index" :item="element" @delete="onDelete(index)" @edit="onEdit(index)" />
        </v-col>
      </template>
    </v-draggable>
  </v-container>
  <!-- <yes-no-dialog v-if="visibleDeleteDlg" :header="`Удалить проект ${delName}?`" @click="onDelete(delIndex, $event)" /> -->

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

import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectCard from './ProjectCard/ProjectCard.vue';

const { state: items, isLoading } = useIpcRendererInvokeAsync<Project[]>('project', { message: 'getAll' }, [], { immediate: true, shallow: false} );


const onMoveProject = (payload: any) => { /** */ };
const onDelete = (id: number) => { /** */ };
const onEdit = (id: number) => { /** */ };
</script>
