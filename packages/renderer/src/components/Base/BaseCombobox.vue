<template>
  <v-combobox v-bind="$attrs" :label="inputLabel" :rules="inputRules" density="compact" />
</template>

<script setup lang="ts">
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  label: string
  required?: boolean,
  rules?: any[],
}>();

const { inputLabel, inputRules } = useInput(props);
</script>
