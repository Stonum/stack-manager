<template>
  <base-input
    :model-value="modelValue" 
    v-bind="$attrs"
    :rules="inputRules"
    @click:clear="emit('update:modelValue','')"
    @update:model-value="emit('update:modelValue', $event)"
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
import { useIpcRendererInvoke, usePathInput  } from '@/composables';

const props = defineProps<{ modelValue?: string }>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const selectFile = async () => {
   const value = await useIpcRendererInvoke<string>('main', { message: 'selectFile', path: props.modelValue?.toString() });
   if (value !== props.modelValue) {
      emit('update:modelValue', value);
   }
};

const { inputRules } = usePathInput(props);
</script>
