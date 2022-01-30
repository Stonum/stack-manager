<template>
  <v-container>
    <app-bar>
      <v-btn plain :disabled="!valid" @click="onAddProject">Добавить проект</v-btn>
    </app-bar>

    <v-form v-model="valid" @submit.prevent="$event = {}">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field v-model="project.name" label="Краткое название проекта*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="1" class="ml-2">
          <v-text-field v-model="inspectport" label="Порт" type="number" @change="onChangePort" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="project.path.git" label="Каталог проекта в git*" append-icon="mdi-book-open" :rules="[rules.required]" @click:append="onReadFolder" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="project.path.front" label="Каталог Stack.Front*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12">
          <v-combobox v-model="project.path.ini" :items="inifiles" label="Путь к stack.ini*" @change="onReadIni" :rules="[rules.required]" />
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
    <v-row v-for="task in tasks" :key="task.id" no-gutters>
      <v-col cols="4" :key="task.id">
        <v-checkbox :key="task.id" v-model="task.selected" :label="task.title" dense hide-details />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="task.port" type="number" dense hide-details clearable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import { readProjectFolder, readIniFile, projectAdd, getSettings } from '@/middleware/index';

export default Vue.extend({
  name: 'NewProject',
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
        apps: [] as App[],
      },
      valid: false,
      inspectport: 0,
      inifiles: [],
      loading: false,
      tasks: [] as Task[],
      rules: {
        required: (value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        },
      },
    };
  },
  methods: {
    async onChangePort(payload: number) {
      const tasks = (await getSettings('tasks')) as Task[];
      if (this.tasks) {
        this.tasks.forEach((task: Task, idx: number) => {
          if (task.selected && tasks[idx].port !== null) {
            task.port = +payload + +(tasks[idx].port || 0);
          } else {
            task.port = null;
          }
        });
      }
    },
    async onReadFolder() {
      const data = await readProjectFolder(this.project.path.git);
      if (data) {
        this.inifiles = data.ini;
        this.project.path.front = data.front;
        this.project.path.ini = this.inifiles[0];
        this.onReadIni();
      }
    },
    async onReadIni() {
      const data = await readIniFile(this.project.path.ini);
      if (data) {
        this.project.sql.server = data.server;
        this.project.sql.base = data.base;
        this.project.path.version = data.version;
      }
    },
    async onAddProject() {
      this.project.apps = [];

      for (const task of this.tasks) {
        if (task.selected) {
          const taskname = `api_${this.project.name}_${task.prefix}`;
          const pathname = `/api/${this.project.name}/${task.prefix}`;
          this.project.apps.push({ id: task.id, port: task.port, name: taskname, path: pathname });
        }
      }

      await projectAdd(this.project);
      this.$router.push('/');
    },
  },
  async created() {
    this.tasks = await getSettings('tasks');
    this.tasks.forEach((task: Task) => {
      task.port = null;
    });
  },
});
</script>
