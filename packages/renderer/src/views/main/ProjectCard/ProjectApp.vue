<template>
  <v-list-item
    density="compact"
    :title="title"
    :subtitle="subtitle"
  >
    <template #prepend>
      <v-icon variant="text" size="small" :color="color" icon="mdi-circle" />
    </template>

    <template #append>
      <v-btn
        v-if="status === 0 || status === 1" 
        variant="text"
        color="primary"
        icon="mdi-restart"
        title="Перезапустить"
        @click="emit('restart', props.app.name)"
      />
      <v-btn
        v-if="status > 1 || status < 0" 
        variant="text"
        color="primary"
        icon="mdi-play"
        title="Запустить"
        @click="emit('start', props.app.name)"
      />
      <v-btn
        v-if="status === 0 || status === 1" 
        variant="text"
        color="error"
        icon="mdi-stop"
        title="Остановить"
        @click="emit('stop', props.app.name)"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ app: ProjectApp }>();
const emit = defineEmits<{
   (e: 'restart', appName: string): void,
   (e: 'start', appName: string): void,
   (e: 'stop', appName: string): void,
}>();

const title = ref(props.app.name);
const subtitle = ref(props.app.path + props.app.port ? ` --inspect=${props.app.port}` : ``);

const status = ref(1);
const color = ref('primary');
</script>
