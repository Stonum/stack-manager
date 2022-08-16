<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <base-input-folder v-model="settings.share" label="Каталог публикации файлов (/share)" clearable>
          <template #append>
            <v-btn class="mr-1" icon="mdi-export-variant" density="compact" flat title="Создать веб сервис" @click.stop="emit('create', 'share')" />
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="12">
        <base-input-folder v-model="settings.upload" label="Каталог загрузки файлов (/upload)" clearable>
          <template #append>
            <v-btn icon="mdi-export-variant" density="compact" flat title="Создать веб сервис" @click.stop="emit('create', 'upload')" />
          </template>
        </base-input-folder>
      </v-col>
      <v-col cols="10">
        <base-input-folder v-model="settings.birt" label="Каталог Birt" clearable />
      </v-col>
      <v-col cols="2">
        <base-input v-model="settings.birt_port" label="Порт Birt" type="number" clearable>
          <template #append>
            <v-btn icon="mdi-export-variant" density="compact" flat title="Создать сервис Birt" @click.stop="emit('create', 'birt')" />
          </template>
        </base-input>
      </v-col>
      <v-col cols="10">
        <base-input-folder v-model="settings.dotnetcore" label="Каталог DotNetCore" clearable />
      </v-col>
      <v-col cols="2">
        <base-input v-model="settings.dotnetcore_port" label="Порт DotNetCore" type="number" clearable>
          <template #append>
            <v-btn icon="mdi-export-variant" density="compact" flat title="Создать сервис DotNetCore" @click.stop="emit('create', 'dotnetcore')" />
          </template>
        </base-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
   modelValue: Settings
}>();

const emit = defineEmits<{
   (e: 'update:modelValue', modelValue: Settings): void,
   (e: 'create', service: string): void
}>();

const settings = useVModel(props, 'modelValue', emit);
</script>
