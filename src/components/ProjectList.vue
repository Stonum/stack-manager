<template>
  <v-expansion-panels v-if="items.length || loading">
    <v-container fluid>
      <draggable v-model="items" @change="onMoveProject">
        <template v-for="(item, idx) in items">
          <project-item :item="item" :key="idx" :id="idx" @stop="onStop(idx, $event)" @start="onStart(idx, $event)" @delete="onDelete(idx)" @edit="onEdit(idx)" />
        </template>
      </draggable>
    </v-container>
    <yes-no-dialog v-if="visibleDialog" message="Удалить проект?" @click="onDelete(delIndex, $event)" />
  </v-expansion-panels>
  <p style="text-align: center" v-else>Проектов пока нет. Добавьте новые, либо заполните из существующих в настройках.</p>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

import ProjectItem from './ProjectItem.vue';

import { getProjects, projectSendJob, projectDelete, moveProject } from '@/middleware/index';
import YesNoDialog from './YesNoDialog.vue';

export default Vue.extend({
  name: 'ProjectList',
  components: { ProjectItem, YesNoDialog, draggable },
  data() {
    return {
      items: [] as Project[],
      visibleDialog: false,
      delIndex: null as number | null,
      loading: false,
    };
  },
  methods: {
    async onStop(id: number, appname?: string) {
      await projectSendJob('appStop', id, appname);
      this.items = await getProjects();
    },
    async onStart(id: number, appname?: string) {
      await projectSendJob('appStart', id, appname);
      this.items = await getProjects();
    },
    async onDelete(id: number | null, answer?: boolean) {
      if (answer === undefined) {
        this.visibleDialog = true;
        this.delIndex = id;
        return;
      }
      this.visibleDialog = false;
      this.delIndex = null;
      if (answer && id !== null) {
        await projectDelete(id);
        this.items = await getProjects();
      }
    },
    async onEdit(id: number) {
      this.$router.push(`/project/${id}`);
    },
    onMoveProject(payload: any) {
      if (payload && payload.moved) {
        moveProject(payload.moved.oldIndex, payload.moved.newIndex);
      }
    },
  },
  async mounted() {
    this.loading = true;
    this.items = await getProjects();
    this.loading = false;
  },
});
</script>
