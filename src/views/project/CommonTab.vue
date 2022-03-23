<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="3">
        <v-text-field v-model="project.name" label="Краткое название проекта*" :rules="[rules.required]" @change="$emit('changeName')" />
      </v-col>
      <v-spacer />
      <v-col cols="3">
        <v-text-field v-model.number="project.port" label="Порт для публикации Stack.Front" type="number" />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="project.path.git" label="Каталог проекта в git*" :readonly="!isNewProject" @change="$emit('changeProjectFolder')" />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="project.path.front" label="Каталог Stack.Front" />
      </v-col>
      <v-col cols="12">
        <v-combobox v-model="project.path.ini" :items="inifiles" label="Путь к stack.ini*" @change="$emit('changeInIFile')" :rules="[rules.required]" />
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
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'CommonTab',
  props: {
    project: { type: Object as PropType<Project>, required: true },
    isNewProject: { type: Boolean, default: false },
    inifiles: { type: Array, required: true },
  },
  data() {
    return {
      inspectport: 0,
      rules: {
        required: (value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        },
      },
    };
  },
});
</script>
