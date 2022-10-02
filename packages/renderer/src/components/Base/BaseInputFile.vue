<template>
  <base-input
    :model-value="modelValue" 
    v-bind="$attrs"
    readonly
    @click:clear="emit('update:modelValue','')"
  >
    <template #prepend>
      <v-btn icon="mdi-file-document-outline" flat :density="null" @click="selectFile" />
    </template>
    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';

const props = defineProps<{ modelValue?: string }>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const selectFile = async () => {
   const value = await useIpcRendererInvoke<string>('main', { message: 'selectFile', path: props.modelValue?.toString() });
   if (value !== props.modelValue) {
      emit('update:modelValue', value);
   }
};
</script>
