<template>
  <v-text-field v-bind="$attrs" :label="inputLabel" :rules="inputRules" dense>
    <template v-if="$slots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  required: boolean,
  rules: any[],
  label: string
}>();

const { inputLabel, inputRules } = useInput(props);

</script>
