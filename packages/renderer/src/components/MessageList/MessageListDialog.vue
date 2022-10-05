<template>
  <v-dialog v-model="dialog" v-bind="$attrs" width="80%">
    <v-card density="compact" min-height="15em">
      <template #prepend>
        <p class="text-h6" :style="msgColor">
          {{ item.type.substring(0, 1).toUpperCase() + item.type.substring(1).toLowerCase() }}
        </p>
      </template>
      <template #append>
        <v-btn icon="mdi-close" flat density="compact" @click="emit('update:modelValue', false)" />
      </template>
      <v-divider />
      <v-card-text style="white-space: pre-line">
        {{ item.text }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useVModel } from '@vueuse/core';

const props = defineProps<{ modelValue: boolean, item: Message }>();
const emit = defineEmits(['update:modelValue']);

const dialog = useVModel(props, 'modelValue', emit);

const msgColor = computed(() => { return props.item.type === 'error' ? 'color: red' : 'color: green'; });
</script>
