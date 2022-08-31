<template>
  <v-dialog v-model="dialog" persistent :max-width="props.width">
    <v-card>
      <v-card-title> {{ props.header }} </v-card-title>
      <v-card-text v-if="props.text">
        {{ props.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="emit('click', true)"> Да </v-btn>
        <v-btn color="primary" text @click="emit('click', false)"> Нет </v-btn>
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
    width: 290,
  }
);

const emit = defineEmits<{
  (e: 'click', answer: boolean): void;
}>();

const dialog = ref(true);
</script>
