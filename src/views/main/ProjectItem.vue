<template>
  <v-expansion-panel>
    <v-expansion-panel-header style="padding: 0">
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-toolbar-title>
          {{ item.name }} <a v-if="item.port" class="text-subtitle-1 px-2" :href="projectUrl" @click.stop="onOpenUrl">{{ projectUrl }}</a>
        </v-toolbar-title>

        <v-spacer />

        <v-icon v-for="(app, idxtask) in item.apps" :key="idxtask" small :color="appColor(app.name)"> mdi-circle </v-icon>

        <v-btn icon tile small class="ml-5" title="Собрать front" @click.stop="onBuildFront" :loading="buildingFront">
          <v-icon color="accent"> mdi-code-tags-check </v-icon>
        </v-btn>
        <v-btn icon tile small title="Перезапустить все приложения" @click.stop="onRestart">
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
        <app-item v-for="(app, idxtask) in item.apps" :item="app" :key="idxtask" @start="onStart($event)" @stop="onStop($event)" />
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapActions } from 'vuex';

import AppItem from './AppItem.vue';

export default Vue.extend({
  name: 'ProjectItem',
  components: { AppItem },
  model: { prop: 'item' },
  props: {
    item: { type: Object as PropType<Project>, required: true },
    id: { type: Number, required: true },
  },
  data() {
    return {
      buildingFront: false,
    };
  },
  computed: {
    projectUrl() {
      return `http://localhost:${this.item.port}`;
    },
  },
  methods: {
    ...mapActions('projectStore', ['projectSendJob', 'getAppStatus']),
    ...mapActions('mainStore', ['openURL']),

    async onStop(appname?: string) {
      await this.projectSendJob({ jobName: 'appStop', projectId: this.id, params: appname });
      this.getAppStatus();
    },
    async onStart(appname?: string) {
      await this.projectSendJob({ jobName: 'appStart', projectId: this.id, params: appname });
      this.getAppStatus();
    },
    async onRestart() {
      for (const app of this.item.apps) {
        await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: app.name });
      }
      this.getAppStatus();
    },

    async onBuildFront() {
      this.buildingFront = true;
      try {
        await this.projectSendJob({ jobName: 'buildFront', projectId: this.id });
      } finally {
        this.buildingFront = false;
      }
    },

    onOpenUrl(e: Event) {
      e.preventDefault();
      this.openURL({ url: this.projectUrl });
    },

    appColor(name: string | undefined) {
      return this.$store.getters['projectStore/getAppColor'](name);
    },
  },
});
</script>
