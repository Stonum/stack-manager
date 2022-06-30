<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4"> Название </v-col>
      <v-col cols="2"> Имя </v-col>
      <v-col v-if="!type" cols="2"> Путь </v-col>
      <template v-if="type">
        <v-col cols="1"> Потоки </v-col>
        <v-col cols="1"> Асинх потоки </v-col>
        <v-col cols="1"> Асинх работы </v-col>
      </template>
      <v-col cols="1"> Порт </v-col>
      <v-col cols="2"> Доп. аргументы </v-col>
    </v-row>
    <v-row v-for="(app, idx) in apps" :key="app.id">
      <v-col :key="app.id" cols="4">
        <v-checkbox :key="app.id" v-model="app.selected" :label="app.title" dense hide-details @change="$emit('select', { appId: idx, checked: $event })" />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="app.name" dense hide-details />
      </v-col>
      <v-col v-if="!type" cols="2">
        <v-text-field v-model="app.path" dense hide-details />
      </v-col>
      <template v-if="type">
        <v-col v-if="type" cols="1">
          <v-text-field v-model="app.syncThreadCount" type="number" dense hide-details />
        </v-col>
        <v-col v-if="type" cols="1">
          <v-text-field v-model="app.asyncThreadCount" type="number" dense hide-details />
        </v-col>
        <v-col v-if="type" cols="1">
          <v-text-field v-model="app.asyncTaskCount" type="number" dense hide-details />
        </v-col>
      </template>
      <v-col cols="1">
        <v-text-field v-model="app.port" type="number" dense hide-details />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="app.args" dense hide-details />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

interface SelectableApp extends ProjectApp, Task {}

export default Vue.extend({
  name: 'AppsTab',
  model: {
    prop: 'apps',
  },
  props: {
    apps: { type: Array as PropType<SelectableApp[]>, required: true },
    isNewProject: { type: Boolean, default: false },
    type: { type: Number, default: 0 },
  },
});
</script>
