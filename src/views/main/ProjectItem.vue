<template>
  <v-expansion-panel>
    <v-expansion-panel-header style="padding: 0">
      <v-app-bar flat color="rgba(0, 0, 0, 0)">
        <v-progress-circular class="mr-3" :size="20" :width="isRunning ? 2 : 0" color="primary" :indeterminate="isRunning" />

        <v-toolbar-title>
          {{ item.name }} <a v-if="item.port" class="text-subtitle-1 px-2" :href="projectUrl" @click.stop="onOpenUrl">{{ projectUrl }}</a>
        </v-toolbar-title>

        <v-spacer />

        <v-icon v-for="(app, idxtask) in item.apps" :key="idxtask" small :color="appColor(app.name)"> mdi-circle </v-icon>

        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in projectActions" :key="i" @click="item.method">
              <v-list-item-action>
                <v-icon :color="item.color">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-list dense>
        <app-item v-for="(app, idxtask) in item.apps" :item="app" :key="idxtask" @restart="onRestart($event)" @start="onStart($event)" @stop="onStop($event)" />
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
      projectActions: [] as any[],
      runningActions: [] as boolean[],
    };
  },
  computed: {
    projectUrl() {
      return `http://localhost:${this.item.port}`;
    },
    isRunning(): boolean {
      return this.runningActions.some((running: boolean) => running);
    },
  },
  methods: {
    ...mapActions('projectStore', ['projectSendJob', 'getAppStatus', 'getEvents']),
    ...mapActions('mainStore', ['openURL']),

    async onStop(appname?: string) {
      await this.projectSendJob({ jobName: 'appStop', projectId: this.id, params: appname });
      this.getAppStatus();
      this.getEvents();
    },
    async onStart(appname?: string) {
      await this.projectSendJob({ jobName: 'appStart', projectId: this.id, params: appname });
      this.getAppStatus();
      this.getEvents();
    },
    async onRestart(appname?: string) {
      const idx = this.runningActions.push(true) - 1;
      try {
        if (appname && typeof appname === 'string') {
          await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: appname });
        } else {
          for (const app of this.item.apps) {
            await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: app.name });
          }
        }
      } finally {
        this.$set(this.runningActions, idx, false);
        this.getAppStatus();
        this.getEvents();
      }
    },

    async onBuildFront() {
      const idx = this.runningActions.push(true) - 1;
      try {
        await this.projectSendJob({ jobName: 'buildFront', projectId: this.id });
      } finally {
        this.$set(this.runningActions, idx, false);
      }
    },

    async onGitPull() {
      const idx = this.runningActions.push(true) - 1;
      try {
        await this.projectSendJob({ jobName: 'gitPull', projectId: this.id });
      } finally {
        this.$set(this.runningActions, idx, false);
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
  mounted() {
    this.projectActions.push({ name: 'Обновить гит', icon: 'mdi-briefcase-download', color: 'accent', method: this.onGitPull });
    this.projectActions.push({ name: 'Собрать фронт', icon: 'mdi-code-tags-check', color: 'accent', method: this.onBuildFront });
    this.projectActions.push({ name: 'Перезапустить', icon: 'mdi-restart', color: 'primary', method: this.onRestart });
    this.projectActions.push({
      name: 'Редактировать',
      icon: 'mdi-pencil',
      color: 'primary',
      method: () => {
        this.$emit('edit');
      },
    });
    this.projectActions.push({
      name: 'Удалить',
      icon: 'mdi-delete',
      color: 'error',
      method: () => {
        this.$emit('delete');
      },
    });
  },
});
</script>
