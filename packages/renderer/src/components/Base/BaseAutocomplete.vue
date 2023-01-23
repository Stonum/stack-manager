<template>
  <v-autocomplete v-bind="$attrs" :label="inputLabel" :rules="inputRules" density="compact" variant="underlined">
    <template v-if="$slots['item']" #item="tProps">
      <slot name="item" v-bind="tProps" />
    </template>
  </v-autocomplete>
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
