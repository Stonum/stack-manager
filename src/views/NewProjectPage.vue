<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="3">
        <v-text-field v-model="params.name" label="Краткое название проекта" />
      </v-col>
      <v-col cols="1" class="ml-2">
        <v-text-field v-model="params.inspectport" label="Порт" type="number" />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="params.path" label="Каталог проекта в git" append-icon="mdi-book-open" @click:append="onReadFolder" />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="params.front" label="Каталог Stack.Front" />
      </v-col>
      <v-col cols="12">
        <v-combobox v-model="params.inifile" :items="inifiles" label="Путь к stack.ini" @change="onReadIni" />
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="params.server" label="SQL сервер" />
      </v-col>
      <v-col cols="3" class="ml-2">
        <v-text-field v-model="params.base" label="База данных" />
      </v-col>
      <v-spacer />
      <v-col cols="2">
        <v-text-field v-model="params.login" label="Логин" />
      </v-col>
      <v-col cols="2" class="ml-2">
        <v-text-field v-model="params.password" label="Пароль" type="password" />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="params.version" label="Каталог версии" />
      </v-col>
      <v-col cols="12" class="d-flex justify-end align-self-center">
        <v-btn @click="onAddProject">Добавить проект</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import { readProjectFolder, readIniFile, projectAdd } from '@/middleware/index';

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
        inspectport: 0,
      },
      inifiles: [],
      loading: false,
    };
  },
  methods: {
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
});
</script>
