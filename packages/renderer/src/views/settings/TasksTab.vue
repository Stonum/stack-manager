<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="4">
        Название
      </v-col>
      <!-- <v-col cols="1">
        Порт
      </v-col> -->
      <v-col cols="1">
        Префикс
      </v-col>
    </v-row>
    <v-row v-for="task in props.tasks" :key="task.id" dense>
      <v-col cols="4">
        <base-checkbox :key="task.id" v-model="task.selected" :label="task.title" hide-details density="compact" />
      </v-col>
      <!-- <v-col cols="1">
        <base-input v-model="task.port" type="number" hide-details density="compact" />
      </v-col> -->
      <v-col cols="1">
        <base-input v-model="task.prefix" hide-details density="compact" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
   tasks?: Task[]
}>();

defineEmits(['update:tasks']);
</script>
