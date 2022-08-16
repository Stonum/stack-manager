<template>
  <app-bar title="Настройки">
    <v-btn plain @click="emit('save')">
      Сохранить настройки
    </v-btn>
  </app-bar>
</template>

<script setup lang="ts">
const emit = defineEmits(['save']);
</script>
