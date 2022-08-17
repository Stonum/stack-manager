<template>
  <v-row class="px-2" justify="space-between" no-gutters>
    <v-col cols="5" width="20px">
      <v-btn
        icon="mdi-web" 
        color="primary"
        variant="text"
        :title="projectUrl"
        :disabled="!props.item.port"
      />
      <v-btn
        icon="mdi-microsoft-visual-studio-code" 
        color="blue"
        variant="text"
        title="Workspace"
        @click="emit('run', 'openWorkspace')"
      />
    </v-col>

    <v-col cols="7" class="text-right">
      <v-btn
        icon="mdi-briefcase-download" 
        color="accent"
        variant="text"
        title="Обновить гит"
        :loading="projectStatus.pulling"
        @click="emit('run', 'gitPull')"
      />
      <v-btn
        icon="mdi-code-tags-check" 
        color="accent"
        variant="text"
        title="Собрать фронт"
        :loading="projectStatus.deploying"
        @click="emit('run', 'buildFront')"
      />
      <v-btn
        icon="mdi-restart" 
        color="primary"
        variant="text"
        title="Перезапустить"
        @click="emit('run', 'restart')"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{ item: Project }>();
const emit = defineEmits<{ (e: 'run', action: string): void }>();

const projectUrl = props.item.port ? `http://localhost:${props.item.port}` : ``;

const projectStatus = { pulling: false, deploying: false};
</script>