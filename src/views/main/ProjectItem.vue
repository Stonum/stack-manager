<template>
  <v-expansion-panel>
    <v-expansion-panel-header style="padding: 0">
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-toolbar-title>
          {{ item.name }}
        </v-toolbar-title>

        <v-spacer />

        <v-icon v-for="(app, idxtask) in item.apps" :key="idxtask" small :color="appColor(app.name)"> mdi-circle </v-icon>

        <v-btn icon tile small class="ml-5" title="Перезапустить все приложения" @click.stop="$emit('restart')">
          <v-icon color="primary"> mdi-restart </v-icon>
        </v-btn>
        <v-btn icon tile small @click.stop="$emit('edit')">
          <v-icon color="primary"> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon tile small @click.stop="$emit('delete')">
          <v-icon color="error"> mdi-delete </v-icon>
        </v-btn>
      </v-app-bar>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-list dense>
        <app-item v-for="(app, idxtask) in item.apps" :item="app" :key="idxtask" v-on="$listeners" />
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AppItem from './AppItem.vue';

export default Vue.extend({
  name: 'ProjectItem',
  components: { AppItem },
  model: { prop: 'item' },
  props: {
    item: { type: Object as PropType<Project>, required: true },
  },
  methods: {
    appColor(name: string | undefined) {
      return this.$store.getters['projectStore/getAppColor'](name);
    },
  },
});
</script>
