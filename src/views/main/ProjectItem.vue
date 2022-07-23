<template>
  <v-card class="flex-grow-1">
    <v-card-title class="pb-0">
      {{ item.name }}

      <v-spacer />

      <v-progress-circular class="mr-3" :size="20" :width="isRunning ? 2 : 0" color="primary" :indeterminate="isRunning" />

      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list class="pa-0">
          <v-list-item v-for="(action, i) in projectActions" :key="i" @click="action.method">
            <v-list-item-action>
              <v-icon :color="action.color">{{ action.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ action.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-title class="py-0">
      <v-btn icon tile :title="projectUrl" :disabled="!item.port" @click="onOpenUrl">
        <v-icon color="primary">mdi-web</v-icon>
      </v-btn>
      <v-btn icon tile title="Workspace" @click="onOpenWorkspace">
        <v-icon color="blue">mdi-microsoft-visual-studio-code</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn icon tile title="Обновить гит" @click="onGitPull">
        <v-icon color="accent">mdi-briefcase-download</v-icon>
      </v-btn>
      <v-btn icon tile title="Собрать фронт" @click="onBuildFront">
        <v-icon color="accent">mdi-code-tags-check</v-icon>
      </v-btn>
      <v-btn icon tile title="Перезапустить" @click="onRestart">
        <v-icon color="primary">mdi-restart</v-icon>
      </v-btn>
    </v-card-title>

    <v-list dense>
      <app-item v-for="(app, idxtask) in item.apps" :key="idxtask" :item="app" @restart="onRestart($event)" @start="onStart($event)" @stop="onStop($event)" />
    </v-list>
  </v-card>
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
      return `http://localhost:${this.item.port || '0000'}`;
    },
    isRunning(): boolean {
      return this.runningActions.some((running: boolean) => running);
    },
  },

  mounted() {
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
            if (app.active) {
              await this.projectSendJob({ jobName: 'appReStart', projectId: this.id, params: app.name });
            }
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

    onOpenWorkspace() {
      this.projectSendJob({ jobName: 'openWorkspace', projectId: this.id });
    },

    appColor(name: string | undefined) {
      return this.$store.getters['projectStore/getAppColor'](name);
    },
  },
});
</script>
