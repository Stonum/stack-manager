<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <project-list />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectList from '@/components/ProjectList.vue';

export default Vue.extend({
  name: 'Main',
  components: { ProjectList },
});
</script>
