<template>
  <v-expansion-panels>
    <template v-for="(item, idx) in items">
      <project-item :item="item" :key="idx" :id="idx" @stop="onStop(idx, $event)" @start="onStart(idx, $event)" @delete="onDelete(idx)" @edit="onEdit(idx)" />
    </template>
    <yes-no-dialog v-if="visibleDialog" message="Удалить проект?" @click="onDelete(delIndex, $event)" />
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectItem from './ProjectItem.vue';

import { getProjects, projectSendJob, projectDelete } from '@/middleware/index';
import YesNoDialog from './YesNoDialog.vue';

export default Vue.extend({
  name: 'ProjectList',
  components: { ProjectItem, YesNoDialog },
  data() {
    return {
      items: [] as Project[],
      visibleDialog: false,
      delIndex: null as number | null,
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
  },
  async mounted() {
    this.items = await getProjects();
  },
});
</script>
