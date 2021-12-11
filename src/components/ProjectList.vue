<template>
  <v-expansion-panels>
    <template v-for="(item, idx) in items">
      <project-item :item="item" :key="idx" @stop="onStop(idx, $event)" @start="onStart(idx, $event)" @delete="onDelete(idx, $event)" />
    </template>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectItem from './ProjectItem.vue';

import { getProjects, projectSendJob } from '@/middleware/index';

export default Vue.extend({
  name: 'ProjectList',
  components: { ProjectItem },
  data() {
    return {
      items: [] as Project[],
    };
  },
  methods: {
    async onStop(id: number, appname: string) {
      await projectSendJob('appStop', id, appname);
      this.items = await getProjects();
    },
    async onStart(id: number, appname: string) {
      await projectSendJob('appStart', id, appname);
      this.items = await getProjects();
    },
    onDelete(id: number, payload: any) {
      //
    },
  },
  async mounted() {
    this.items = await getProjects();
  },
});
</script>
