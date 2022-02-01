<template>
  <v-container>
    <app-bar>
      <h4 v-if="appNameChanged" class="warning--text">Изменено имя приложения, необходимо пересобрать проект</h4>
      <v-btn plain :disabled="!valid || loading" @click="onRebuildProject" :loading="loading">Пересобрать</v-btn>
      <v-btn plain :disabled="!valid || appNameChanged" @click="onSaveProject">Сохранить</v-btn>
    </app-bar>

    <v-form v-model="valid" @submit.prevent="$event = {}">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field v-model="project.name" label="Краткое название проекта*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="project.path.git" label="Каталог проекта в git*" readonly />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="project.path.front" label="Каталог Stack.Front" />
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="project.path.ini" label="Путь к stack.ini*" @change="onReadIni" :rules="[rules.required]" />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="project.sql.server" label="SQL сервер*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="3" class="ml-2">
          <v-text-field v-model="project.sql.base" label="База данных*" :rules="[rules.required]" />
        </v-col>
        <v-spacer />
        <v-col cols="2">
          <v-text-field v-model="project.sql.login" label="Логин*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="2" class="ml-2">
          <v-text-field v-model="project.sql.password" label="Пароль" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="project.path.version" label="Каталог версии*" :rules="[rules.required]" />
        </v-col>
      </v-row>
    </v-form>
    <v-row v-for="app in apps" :key="app.id">
      <v-col cols="4" :key="app.id">
        <v-checkbox :key="app.id" v-model="app.selected" :label="app.title" dense hide-details />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="app.name" dense hide-details @change="appNameChanged = true" />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="app.port" type="number" dense hide-details />
      </v-col>
    </v-row>
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

import { getProject, readIniFile, getSettings, projectRebuild, projectSave } from '@/middleware/index';

export default Vue.extend({
  name: 'Project',
  props: { projectid: String },
  data() {
    return {
      project: {} as Project,
      valid: false,
      inspectport: 0,
      loading: false,
      tasks: [] as Task[],
      version: '',
      visibleDialog: false,
      rules: {
        required: (value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        },
      },
      apps: [] as any[],
      appNameChanged: false,
    };
  },

  methods: {
    async onReadIni() {
      const data = await readIniFile(this.project.path.ini);
      if (data) {
        this.project.sql.server = data.server;
        this.project.sql.base = data.base;
        this.project.path.version = data.version;
      }
    },
    async onRebuildProject() {
      this.loading = true;
      this.project.apps = [];

      for (const app of this.apps) {
        if (app.selected) {
          const taskname = app.name;
          const pathname = '/' + app.name.replaceAll('_', '/');
          this.project.apps.push({ id: app.id, port: app.port, name: taskname, path: pathname });
        }
      }
      try {
        await projectRebuild(+this.projectid, this.project);
      } finally {
        this.loading = false;
      }
      this.appNameChanged = false;
      this.$router.go(-1);
    },
    async onSaveProject() {
      await projectSave(+this.projectid, this.project);
      this.$router.go(-1);
    },
  },

  async created() {
    this.project = await getProject(+this.projectid);

    this.tasks = await getSettings('tasks');
    this.tasks.forEach((task: Task) => {
      const app = this.project.apps.find((app) => app.id === task.id);
      if (app) {
        this.apps.push({ ...task, ...app });
      } else {
        this.apps.push({ ...task, name: null, port: null });
      }
    });

    const data = await readIniFile(this.project.path.ini);
    if (data.version !== this.project.path.version) {
      this.version = data.version;
      this.visibleDialog = true;
    }
  },
});
</script>
