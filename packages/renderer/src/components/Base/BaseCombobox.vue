<template>
  <v-combobox v-bind="$attrs" :label="inputLabel" :rules="inputRules" dense />
</template>

<script setup lang="ts">
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  required: boolean,
  rules: any[],
  label: string,
}>();

const { inputLabel, inputRules } = useInput(props);
</script>
