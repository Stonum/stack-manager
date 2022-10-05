<template>
  <v-dialog v-model="dialog" persistent :max-width="props.width">
    <v-card density="compact" min-height="15em">
      <template #prepend>
        <p class="text-h6 text-primary">
          {{ props.header }}
        </p>
      </template>
      <template #append>
        <v-btn icon="mdi-close" flat density="compact" @click="emit('click', false)" />
      </template>
      <v-card-text v-if="props.text">
        {{ props.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="emit('click', true)">
          Да
        </v-btn>
        <v-btn color="primary" text @click="emit('click', false)">
          Нет
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    header: string;
    text?: string;
    width: number;
  }>(),
  {
    text: '',
    width: 500,
  }
);

const emit = defineEmits<{
  (e: 'click', answer: boolean): void;
}>();

const dialog = ref(true);
</script>
