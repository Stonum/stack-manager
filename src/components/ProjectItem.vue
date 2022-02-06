<template>
  <v-expansion-panel>
    <v-expansion-panel-header style="padding: 0">
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-toolbar-title>
          {{ item.name }}
        </v-toolbar-title>

        <v-spacer />

        <v-icon v-for="(app, idxtask) in item.apps" :key="idxtask" small :color="appColor(app.status)"> mdi-circle </v-icon>

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
        <v-list-item v-for="(app, idxtask) in item.apps" :key="idxtask" dense>
          <v-list-item-icon>
            <v-icon small :color="appColor(app.status)"> mdi-circle </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ app.name }}</v-list-item-title>
            <v-list-item-subtitle v-if="app.port && app.port > 0">--inspect={{ app.port }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action-text>
            <v-list-item-subtitle class="text-right">
              <v-btn icon tile small title="Перезапустить" @click="$emit('start', app.name)">
                <v-icon color="primary"> mdi-restart </v-icon>
              </v-btn>
              <v-btn icon tile small v-if="app.status === 2" title="Запустить" @click="$emit('start', app.name)">
                <v-icon color="primary"> mdi-play </v-icon>
              </v-btn>
              <v-btn icon tile small v-if="app.status !== 2" title="Остановить" @click="$emit('stop', app.name)">
                <v-icon color="error"> mdi-stop </v-icon>
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-action-text>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'ProjectItem',
  model: { prop: 'item' },
  props: {
    item: { type: Object as PropType<Project>, required: true },
  },
  methods: {
    appColor(status: number | undefined) {
      switch (status) {
        case 0:
          return 'green';
        case 1:
          return 'warning';

        default:
          return 'error';
      }
    },
  },
});
</script>
