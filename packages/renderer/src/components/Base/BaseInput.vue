<template>
  <v-text-field v-bind="$attrs" :label="inputLabel" :rules="inputRules" variant="underlined" :hide-details="hideDetails">
    <template v-if="$slots['append']" #append>
      <slot name="append" />
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