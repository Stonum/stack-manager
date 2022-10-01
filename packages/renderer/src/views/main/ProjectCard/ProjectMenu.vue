<template>
  <v-menu bottom left offset-y>
    <template #activator="attrs">
      <v-btn icon flat v-bind="attrs.props">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list class="pa-0">
      <v-list-item v-for="(action, i) in actions" :key="i" @click="action.method">
        <template #prepend>
          <v-icon :color="action.color">
            {{ action.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ action.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const emit = defineEmits(['edit', 'delete']);

const actions = [
   {
      name: 'Редактировать',
      icon: 'mdi-pencil',
      color: 'primary',
      method: () => {
         emit('edit');
      },
   },
   {
      name: 'Удалить',
      icon: 'mdi-delete',
      color: 'error',
      method: () => {
         emit('delete');
      },
   },
];
</script>