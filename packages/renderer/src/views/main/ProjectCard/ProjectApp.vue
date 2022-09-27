<template>
  <v-list-item
    density="compact"
    :title="title"
    :subtitle="subtitle"
  >
    <template #prepend>
      <!-- drop default opacity for prepend slot items -->
      <v-icon variant="text" size="small" :color="color" icon="mdi-circle" style="opacity: 1" />
    </template>

    <template #append>
      <v-btn
        v-if="status === 0 || status === 1" 
        variant="text"
        color="primary"
        icon="mdi-restart"
        title="Перезапустить"
        density="compact"
        @click="emit('restart', props.app.name)"
      />
      <v-btn
        v-if="status > 1 || status < 0" 
        variant="text"
        color="primary"
        icon="mdi-play"
        title="Запустить"
        density="compact"
        @click="emit('start', props.app.name)"
      />
      <v-btn
        v-if="status === 0 || status === 1" 
        variant="text"
        color="error"
        icon="mdi-stop"
        title="Остановить"
        density="compact"
        @click="emit('stop', props.app.name)"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { useApp } from '@/composables';
import { ref } from 'vue';

const props = defineProps<{ app: ProjectApp }>();
const emit = defineEmits<{
   (e: 'restart', appName: string): void,
   (e: 'start', appName: string): void,
   (e: 'stop', appName: string): void,
}>();

const title = ref(props.app.name);
const subtitle = ref(props.app.path + props.app.port ? ` --inspect=${props.app.port}` : ``);

const { status, color } = useApp(props.app.name);
</script>