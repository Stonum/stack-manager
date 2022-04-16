<template>
  <v-container fluid class="py-0">
    <app-bar>
      <h4 v-if="appNameChanged && !isNewProject" class="warning--text">Изменено имя приложения, необходимо пересобрать проект</h4>

      <v-btn plain :disabled="!valid || loading" :loading="loading" @click="onBuildProject">{{ isNewProject ? 'Сохранить' : 'Пересобрать' }}</v-btn>
    </app-bar>

    <v-form v-model="valid" @submit.prevent="$event = {}">
      <v-tabs>
        <v-tab>Общие настройки</v-tab>
        <v-tab-item>
          <common-tab
            :project="project"
            :inifiles="inifiles"
            :is-new-project="isNewProject"
            @changeInIFile="onReadIni"
            @changeProjectFolder="onReadFolder"
            @changeName="onChangeName"
          />
        </v-tab-item>

        <v-tab>Веб приложения</v-tab>
        <v-tab-item>
          <apps-tab :apps="apps" :type="project.type" :is-new-project="isNewProject" @change="appNameChanged = true" @select="onAppCheck" />
        </v-tab-item>
      </v-tabs>
    </v-form>

    <yes-no-dialog
      v-if="visibleDialog"
      header="Версия в stack.ini отличается от текущей. Изменить?"
      :text="`${this.project.path.version} -> ${this.version}`"
      :width="700"
      @click="
        project.path.version = $event ? version : project.path.version;
        visibleDialog = false;
      "
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

import AppsTab from './AppsTab.vue';
import CommonTab from './CommonTab.vue';

interface SelectableApp extends ProjectApp, Task {}

export default Vue.extend({
  name: 'Project',
  components: { CommonTab, AppsTab },
  props: { projectid: String },
  data() {
    return {
      project: {
        name: '',
        path: {
          version: '',
          bin: '',
          git: '',
          ini: '',
          front: '',
        },
        sql: {
          server: '',
          base: '',
          login: '',
          password: '',
        },
        gateway: {
          path: '',
          port: '',
        },
        type: 0,
        apps: [] as ProjectApp[],
      } as Project,
      valid: false,
      inspectport: 0,
      loading: false,
      tasks: [] as Task[],
      inifiles: [],
      version: '',
      visibleDialog: false,
      rules: {
        required: (value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        },
      },
      apps: [] as SelectableApp[],
      appNameChanged: false,
    };
  },

  computed: {
    isNewProject(): boolean {
      return +this.projectid === -1;
    },
  },

  methods: {
    ...mapActions('projectStore', ['readIniFile', 'readProjectFolder', 'projectAdd', 'projectRebuild', 'getProject']),

    async onReadIni() {
      const data = await this.readIniFile(this.project.path.ini);
      if (data) {
        this.project.sql.server = data.server;
        this.project.sql.base = data.base;
        this.project.path.version = data.version;
        if (!this.project.gateway.path && data.gateway) {
          this.project.gateway.path = data.gateway;
        }
      }
    },
    async onReadFolder() {
      const data = await this.readProjectFolder(this.project.path.git);
      if (data) {
        this.inifiles = data.ini;
        this.project.path.front = data.front;
        this.project.path.ini = this.inifiles[0];
        this.project.type = data.type;
        this.project.gateway.path = data.gateway;
        this.onReadIni();
      }
    },
    async onAppCheck({ appId, checked }: { appId: number; checked: boolean }) {
      if (!checked) {
        this.apps[appId].name = '';
        this.apps[appId].path = '';
      } else {
        this.apps[appId].name = `api_${this.project.name}_${this.apps[appId].prefix}`;
        this.apps[appId].path = `/api/${this.project.name}/${this.apps[appId].prefix}`;
      }
      this.appNameChanged = true;
    },
    onChangeName() {
      for (const idx in this.apps) {
        if (this.apps[idx].selected) {
          this.onAppCheck({ appId: +idx, checked: true });
        }
      }
    },
    async onBuildProject() {
      this.loading = true;
      this.project.apps = [];

      for (const app of this.apps) {
        if (app.selected) {
          this.project.apps.push({ id: app.id, port: app.port, name: app.name, path: app.path, args: '' });
        }
      }
      try {
        if (this.isNewProject) {
          await this.projectAdd(this.project);
        } else {
          await this.projectRebuild({ projectId: +this.projectid, params: this.project });
        }
      } finally {
        this.loading = false;
      }
      this.appNameChanged = false;
      this.$router.go(-1);
    },
  },

  async created() {
    if (+this.projectid !== -1) {
      this.project = await this.getProject(+this.projectid);

      const data = await this.readIniFile(this.project.path.ini);
      if (data.version.toString().toLowerCase() !== this.project.path.version.toLowerCase()) {
        this.version = data.version;
        this.visibleDialog = true;
      }
    }

    this.tasks = await this.$store.dispatch('mainStore/getSettings', { key: 'tasks' });
    this.tasks.forEach((task: Task) => {
      const app = this.project.apps.find((app) => app.id === task.id);
      if (app) {
        this.apps.push({ ...task, ...app, selected: true });
      } else {
        this.apps.push({ ...task, name: '', path: '', port: null, args: '', selected: this.isNewProject ? task.selected : false });
      }
    });
  },
});
</script>
