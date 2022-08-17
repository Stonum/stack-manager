<template>
  <v-card class="flex-grow-1" density="compact">
    <v-card-item class="py-0" :title="props.item.name" density="compact">
      <template #append>
        <v-progress-circular class="mr-3" :size="20" :width="isRunning ? 2 : 0" color="primary" :indeterminate="isRunning" />
        <project-menu @delete="onDelete" @edit="onEdit" />
      </template>
    </v-card-item>
   
    <project-actions :item="props.item" @run="onRunAction" />

    <v-list class="pt-0">
      <project-app
        v-for="(app, idxtask) in item.apps" 
        :key="idxtask"
        :app="app"
        @restart="onRestart($event)"
        @start="onStart($event)"
        @stop="onStop($event)"
      />
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import ProjectMenu from './ProjectMenu.vue';
import ProjectActions from './ProjectActions.vue';
import ProjectApp from './ProjectApp.vue';

const props = defineProps<{ item: Project, id: Number }>();

const isRunning = false;

const onDelete = () => { };
const onEdit = () => { };
const onRunAction = (action: string) => { };

const onOpenWorkspace = () => { };
const onGitPull = () => { };
const onBuildFront = () => { };
const onRestart = (appName?: string) => { };
const onStart = (appName?: string) => { };
const onStop = (appName?: string) => { };
</script>