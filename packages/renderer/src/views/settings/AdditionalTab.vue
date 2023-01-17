<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <base-input-folder v-model="settings.staticPath" label="Каталог статики" required readonly />
      </v-col>
      <v-col cols="6">
        <base-input v-model="settings.trustedServer" label="Доверенный сервер лицензий" placeholder="<server>:<port>" required />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
   modelValue: Settings
}>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: Settings): void }>();

const settings = useVModel(props, 'modelValue', emit);
</script>
