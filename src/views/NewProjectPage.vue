<template>
  <v-container>
    <v-form v-model="valid" @submit.prevent="$event = {}">
      <v-row no-gutters>
        <v-col cols="3">
          <v-text-field v-model="params.name" label="Краткое название проекта*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="1" class="ml-2">
          <v-text-field v-model="inspectport" label="Порт" type="number" @change="onChangePort" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="params.path" label="Каталог проекта в git*" append-icon="mdi-book-open" :rules="[rules.required]" @click:append="onReadFolder" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="params.front" label="Каталог Stack.Front*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12">
          <v-combobox v-model="params.inifile" :items="inifiles" label="Путь к stack.ini*" @change="onReadIni" :rules="[rules.required]" />
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="params.server" label="SQL сервер*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="3" class="ml-2">
          <v-text-field v-model="params.base" label="База данных*" :rules="[rules.required]" />
        </v-col>
        <v-spacer />
        <v-col cols="2">
          <v-text-field v-model="params.login" label="Логин*" :rules="[rules.required]" />
        </v-col>
        <v-col cols="2" class="ml-2">
          <v-text-field v-model="params.password" label="Пароль*" type="password" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12">
          <select-folder v-model="params.version" label="Каталог версии*" :rules="[rules.required]" />
        </v-col>
      </v-row>
    </v-form>
    <v-row v-for="task in params.tasks" :key="task.id" no-gutters>
      <v-col cols="4" :key="task.id">
        <v-checkbox :key="task.id" v-model="task.selected" :label="task.title" dense hide-details />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="task.port" type="number" dense hide-details clearable />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-end align-self-center">
        <v-btn :disabled="!valid" @click="onAddProject">Добавить проект</v-btn>
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
      params: {
        name: '',
        path: '',
        front: '',
        inifile: '',
        server: '',
        base: '',
        login: '',
        password: '',
        version: '',
        tasks: [] as any[],
      },
      valid: false,
      inspectport: 0,
      inifiles: [],
      loading: false,
      rules: {
        required: (value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        },
      },
    };
  },
  methods: {
    async onChangePort(payload: number) {
      const tasks = (await getSettings('tasks')) as any[];
      if (this.params.tasks) {
        this.params.tasks.forEach((task: any, idx: number) => {
          if (task.selected && tasks[idx].port !== null) {
            task.port = +payload + +tasks[idx].port;
          } else {
            task.port = null;
          }
        });
      }
    },
    async onReadFolder() {
      const data = await readProjectFolder(this.params.path);
      if (data) {
        this.inifiles = data.ini;
        this.params.front = data.front;
        this.params.inifile = this.inifiles[0];
        this.onReadIni();
      }
    },
    async onReadIni() {
      const data = await readIniFile(this.params.inifile);
      if (data) {
        this.params.server = data.server;
        this.params.base = data.base;
        this.params.version = data.version;
      }
    },
    async onAddProject() {
      await projectAdd(this.params);
      this.$router.push('/');
    },
  },
  async created() {
    this.params.tasks = await getSettings('tasks');
    this.params.tasks.forEach((task: any) => {
      task.port = null;
    });
  },
});
</script>
