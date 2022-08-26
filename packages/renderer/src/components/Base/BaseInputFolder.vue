<template>
  <base-input :model-value="modelValue" v-bind="$attrs" prepend-icon="mdi-folder-outline" readonly @click:prepend="selectDir" @click:clear="emit('update:modelValue', '')">
    <template v-if="$slots['append']" #append>
      <v-btn icon="mdi-open-in-new" flat density="compact" @click="openPath" />
      <slot name="append" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const selectDir = async () => {
  const value = await useIpcRendererInvoke<string>('main', { message: 'selectDir', path: props.modelValue?.toString() });
  emit('update:modelValue', value);
};

const openPath = () => {
  useIpcRendererInvoke('main', { message: 'openPath', path: props.modelValue?.toString() });
};
</script>