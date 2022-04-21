<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <select-folder v-model="settings.share" label="Каталог публикации файлов (/share)" clearable dense>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'share')" title="Создать веб сервис">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.upload" label="Каталог загрузки файлов (/upload)" clearable dense>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'upload')" title="Создать веб сервис">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="10">
        <select-folder v-model="settings.birt" label="Каталог Birt" clearable dense />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="settings.birt_port" label="Порт Birt" type="number" clearable dense>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'birt')" title="Создать сервис Birt">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="10">
        <select-folder v-model="settings.dotnetcore" label="Каталог DotNetCore" clearable dense />
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="settings.dotnetcore_port" label="Порт DotNetCore" type="number" clearable dense>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'dotnetcore')" title="Создать сервис DotNetCore">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'ServicesTab',
  props: {
    settings: { type: Object as PropType<Settings>, required: true },
  },
});
</script>
