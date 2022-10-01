<template>
  <v-text-field
    v-bind="$attrs"
    :label="inputLabel"
    :rules="inputRules" 
    variant="underlined"
    :hide-details="hideDetails"
    persistent-clear
    clear-icon="mdi-close"
    density="compact" 
  >
    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots['prepend']" #prepend>
      <slot name="prepend" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  label?: string;
  required?: boolean;
  rules?: any[];
}>();

const { inputLabel, inputRules } = useInput(props);

const hideDetails = computed(() => !props.required && !props.rules);
</script>