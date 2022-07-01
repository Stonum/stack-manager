<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <base-input-folder v-model="settings.share" label="Каталог публикации файлов (/share)" clearable>
          <template #append-outer>
            <v-btn icon tile small title="Создать веб сервис" @click.stop="$emit('create', 'share')">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.upload" label="Каталог загрузки файлов (/upload)" clearable>
          <template #append-outer>
            <v-btn icon tile small title="Создать веб сервис" @click.stop="$emit('create', 'upload')">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="10">
        <base-input-folder v-model="settings.birt" label="Каталог Birt" clearable />
      </v-col>
      <v-col cols="2">
        <base-input v-model="settings.birt_port" label="Порт Birt" type="number" clearable>
          <template #append-outer>
            <v-btn icon tile small title="Создать сервис Birt" @click.stop="$emit('create', 'birt')">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </base-input>
      </v-col>
      <v-col cols="10">
        <base-input-folder v-model="settings.dotnetcore" label="Каталог DotNetCore" clearable />
      </v-col>
      <v-col cols="2">
        <base-input v-model="settings.dotnetcore_port" label="Порт DotNetCore" type="number" clearable>
          <template #append-outer>
            <v-btn icon tile small title="Создать сервис DotNetCore" @click.stop="$emit('create', 'dotnetcore')">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
          </template>
        </base-input>
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
