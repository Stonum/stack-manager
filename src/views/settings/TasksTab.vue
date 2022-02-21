<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4"> Название </v-col>
      <v-col cols="1"> Порт </v-col>
      <v-col cols="1"> Префикс </v-col>
    </v-row>
    <v-row v-for="task in tasks" :key="task.id" dense>
      <v-col cols="4">
        <v-checkbox :key="task.id" v-model="task.selected" :label="task.title" dense hide-details />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="task.port" type="number" dense hide-details />
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="task.prefix" dense hide-details />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
export default Vue.extend({
  name: 'TasksTab',
  model: { prop: 'tasks' },
  props: {
    tasks: { type: Array as PropType<Task[]>, required: true },
  },
});
</script>
