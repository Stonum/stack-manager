<template>
  <main-tool-bar />
  <v-progress-linear v-if="isLoading" indeterminate />
  <p v-else-if="!items.length" style="text-align: center">
    Проектов пока нет.
  </p>
  <v-container v-else fluid>
    <v-draggable :list="items" class="v-row" item-key="name" @change="onMoveProject">
      <template #item="{ element, index }">
        <v-col cols="3" class="d-flex">
          <project-item :id="index" :item="element" @delete="onDelete(index)" @edit="onEdit(index)" />
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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectItem from './ProjectItem.vue';

const items = reactive([
   { name: 'name 1', port: 123 },
   { name: 'name 2', port: 123 },
   { name: 'name 3', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 4', port: 123 },
   { name: 'name 5', port: 123 }
]);

const isLoading = ref(false);

onMounted(() => {
   isLoading.value = true;
   setTimeout(() => {

      isLoading.value = false;
   }, 1000);
});

const onMoveProject = (payload: any) => { console.log('moved', payload); };
const onDelete = (id: number) => { console.log(id); };
const onEdit = (id: number) => { console.log(id); };
</script>
