<template>
  <v-container>
    <v-row no-gutters class="justify-space-between">
      <v-col cols="3">
        <v-text-field v-model="name" label="Краткое название проекта" />
      </v-col>
      <v-col cols="5" class="d-flex justify-end align-self-center">
        <v-btn :disabled="!path" @click="onCheck">Прочитать настройки из файлов каталога</v-btn>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="path" label="Каталог проекта в git" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'NewProject',
  data() {
    return {
      name: '',
      path: '',
    };
  },
  methods: {
    onCheck(): {
      //
    };,
  },
});
</script>
