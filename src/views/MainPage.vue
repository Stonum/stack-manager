<template>
  <v-container fluid>
    <app-bar>
      <v-btn plain icon title="Обновить список" @click="onRefresh"><v-icon>mdi-refresh</v-icon></v-btn>
    </app-bar>
    <v-row>
      <v-col>
        <project-list v-if="visibleProjects" />
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
  data() {
    return {
      visibleProjects: true,
    };
  },
  methods: {
    // TODO пока костыль, надо будет подумать над принудетльным обновлением
    onRefresh() {
      this.visibleProjects = false;

      this.$nextTick(() => {
        this.visibleProjects = true;
      });
    },
  },
});
</script>
