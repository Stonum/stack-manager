<template>
  <v-container fluid>
    <main-tool-bar @refresh="onRefresh" />

    <v-progress-linear v-if="loading" indeterminate />
    <p style="text-align: center" v-else-if="!items.length">Проектов пока нет. Добавьте новые, либо заполните из существующих в настройках.</p>
    <v-expansion-panels v-else>
      <v-container fluid>
        <v-draggable v-model="items" @change="onMoveProject">
          <template v-for="(item, idx) in items">
            <project-item :item="item" :key="idx" :id="idx" @delete="onDelete(idx)" @edit="onEdit(idx)" />
          </template>
        </v-draggable>
      </v-container>
      <yes-no-dialog v-if="visibleDialog" :header="`Удалить проект ${delName}?`" @click="onDelete(delIndex, $event)" />
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import VDraggable from 'vuedraggable';

import MainToolBar from './MainToolBar.vue';
import ProjectItem from '@/views/main/ProjectItem.vue';

export default Vue.extend({
  name: 'Main',
  components: { MainToolBar, ProjectItem, VDraggable },
  data() {
    return {
      items: [] as Project[],
      visibleDialog: false,
      delIndex: null as number | null,
      delName: null as string | null,
      loading: false,
      timer: null as any,
    };
  },
  methods: {
    ...mapActions('projectStore', ['getProjects', 'projectDelete', 'moveProject', 'getAppStatus']),

    async onRefresh() {
      this.loading = true;
      this.items = await this.getProjects();
      this.loading = false;
      this.getAppStatus();
    },
    async onDelete(id: number | null, answer?: boolean) {
      if (answer === undefined) {
        this.visibleDialog = true;
        this.delIndex = id;
        if (id) {
          this.delName = this.items[id]?.name;
        }
        return;
      }
      this.visibleDialog = false;
      this.delIndex = null;
      if (answer && id !== null) {
        await this.projectDelete(id);
        this.items = await this.getProjects();
      }
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
    this.onRefresh();
    const interval = +(await this.$store.dispatch('mainStore/getSettings', { key: 'refresh_interval' }));
    this.timer = setInterval(async () => {
      const isVisible = await this.$store.dispatch('mainStore/getVisibleWindow');
      if (!isVisible) {
        return;
      }
      this.$store.dispatch('projectStore/getAppStatus');
    }, interval);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
});
</script>
