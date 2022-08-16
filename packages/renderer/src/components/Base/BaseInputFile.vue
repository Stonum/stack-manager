<template>
  <base-input
    :model-value="modelValue" 
    v-bind="$attrs"
    prepend-icon="mdi-file-document-outline"
    readonly
    @click:prepend="selectFile"
    @click:clear="emit('update:modelValue','')"
  >
    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';
import { FileFilter } from 'electron/main';

const props = defineProps<{ modelValue?: string, filter: FileFilter }>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const selectFile = async () => {
   const value = await useIpcRendererInvoke<string>('main', { message: 'selectFile', path: props.modelValue?.toString() });
   emit('update:modelValue', value);
};
</script>
