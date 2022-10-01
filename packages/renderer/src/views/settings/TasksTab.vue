<template>
  <v-container fluid>
    <v-table density="compact">
      <thead>
        <th class="text-left">
          <span>Название</span>
        </th>
        <th class="text-left">
          <span>Префикс</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task.id">
          <td class="pl-0">
            <base-checkbox :key="task.id" v-model="task.selected" :label="task.title" hide-details density="compact" />
          </td>
          <td class="pl-0">
            <base-input v-model="task.prefix" hide-details density="compact" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  tasks?: Task[];
}>();

defineEmits(['update:tasks']);
</script>