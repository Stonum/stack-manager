<template>
  <v-container fluid>
    <main-tool-bar @refresh="onRefresh" />

    <v-progress-linear v-if="loading" indeterminate />
    <p style="text-align: center" v-else-if="!items.length">Проектов пока нет.</p>
    <v-container v-else fluid>
      <v-draggable v-model="items" @change="onMoveProject" class="row">
        <template v-for="(item, idx) in items">
          <v-col cols="3" :key="idx" class="d-flex">
            <project-item :item="item" :id="idx" @delete="onDelete(idx)" @edit="onEdit(idx)" />
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
  methods: {
    ...mapActions('projectStore', ['getProjects', 'projectDelete', 'moveProject', 'getAppStatus', 'getEvents']),

    async onRefresh() {
      this.loading = true;
      this.items = await this.getProjects();
      this.loading = false;
      this.getAppStatus();
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
      this.onRefresh();
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
  async mounted() {
    await this.onRefresh();
    if (this.items.length === 0) {
      this.visibleFillDlg = true;
    }
  },
});
</script>
