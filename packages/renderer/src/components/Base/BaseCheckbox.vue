<template>
  <v-checkbox :value="modelValue" v-bind="$attrs" dense />
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
</script>
