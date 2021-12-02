<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <project-list :items="items" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectList from '@/components/ProjectList.vue';

import { getProjects } from '@/middleware/index';

export default Vue.extend({
  name: 'Main',
  components: { ProjectList },
  data() {
    return {
      items: [],
    };
  },
  async mounted() {
    this.items = await getProjects();
  },
});
</script>
