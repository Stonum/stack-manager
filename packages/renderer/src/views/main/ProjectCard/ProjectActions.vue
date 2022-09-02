<template>
  <v-row class="px-2" justify="space-between" no-gutters>
    <v-col cols="5">
      <v-btn variant="text" icon :title="projectUrl" :disabled="!props.item.port" :href="projectUrl">
        <v-icon icon="mdi-web" color="primary" size="large" />
      </v-btn>
      <v-btn variant="text" title="Workspace" icon @click="emit('run', 'openWorkspace')">
        <v-icon icon="mdi-microsoft-visual-studio-code" color="blue" size="large" />
      </v-btn>
    </v-col>

    <v-col cols="7" class="text-right">
      <v-btn icon variant="text" title="Обновить гит" :loading="state.pulling" @click="emit('run', 'gitPull')">
        <v-icon icon="mdi-briefcase-download" color="accent" size="large" />
      </v-btn>
      <v-btn icon variant="text" title="Собрать фронт" :loading="state.deploying" @click="emit('run', 'buildFront')">
        <v-icon icon="mdi-code-tags-check" color="accent" size="large" />
      </v-btn>
      <v-btn icon variant="text" title="Перезапустить" @click="emit('run', 'appReStart')">
        <v-icon icon="mdi-restart" color="primary" size="large" />
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{ item: Project; state: ProjectCondition }>();
const emit = defineEmits<{ (e: 'run', action: string): void }>();

const projectUrl = props.item.port ? `http://localhost:${props.item.port}` : ``;
</script>