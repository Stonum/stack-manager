<template>
  <v-container fluid>
    <main-tool-bar @refresh="onRefresh" />

    <v-progress-linear v-if="loading" indeterminate />
    <p v-else-if="!items.length" style="text-align: center">Проектов пока нет.</p>
    <v-container v-else fluid>
      <v-draggable v-model="items" class="row" @change="onMoveProject">
        <template v-for="(item, idx) in items">
          <v-col :key="idx" cols="3" class="d-flex">
            <project-item :id="idx" :item="item" @delete="onDelete(idx)" @edit="onEdit(idx)" />
          </v-col>
        </template>
      </v-draggable>
    </v-container>
    <yes-no-dialog v-if="visibleDeleteDlg" :header="`Удалить проект ${delName}?`" @click="onDelete(delIndex, $event)" />

    <fill-projects-dialog
      v-if="visibleFillDlg"
      @close="
        visibleFillDlg = false;
        onRefresh();
      "
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectItem from '@/views/main/ProjectItem.vue';
import FillProjectsDialog from './FillProjectsDialog.vue';

export default Vue.extend({
  name: 'Main',
  components: { MainToolBar, ProjectItem, VDraggable, FillProjectsDialog },
  data() {
    return {
      items: [] as Project[],
      visibleDeleteDlg: false,
      visibleFillDlg: false,
      delIndex: null as number | null,
      delName: null as string | null,
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    this.items = await this.getProjects();
    await this.onRefresh();
    this.loading = false;

    if (this.items.length === 0) {
      this.visibleFillDlg = true;
    }
  },
  methods: {
    ...mapActions('projectStore', ['getProjects', 'projectDelete', 'moveProject', 'getAppStatus', 'getEvents']),

    async onRefresh() {
      await this.getAppStatus();
      await this.getEvents();
    },
    async onDelete(id: number | null, answer?: boolean) {
      if (answer === undefined) {
        this.visibleDeleteDlg = true;
        this.delIndex = id;
        if (id) {
          this.delName = this.items[id]?.name;
        }
        return;
      }
      this.visibleDeleteDlg = false;
      this.delIndex = null;
      if (answer && id !== null) {
        await this.projectDelete(id);
      }
      this.items = await this.getProjects();
      this.getEvents();
    },
    async onEdit(id: number) {
      this.$router.push(`/project/${id}`);
    },
    onMoveProject(payload: any) {
      if (payload && payload.moved) {
        this.moveProject(payload.moved);
      }
    },
  },
});
</script>
