<template>
  <base-input
    :model-value="modelValue"
    v-bind="$attrs"
    append-inner-icon="mdi-open-in-new"
    :rules="inputRules"
    @click:append-inner="openPath"
    @click:clear="emit('update:modelValue', '')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #prepend>
      <v-btn icon="mdi-folder-outline" flat :density="null" @click="selectDir" />
    </template>
    <template v-if="$slots['append']" #append>
      <slot name="append" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke, usePathInput } from '@/composables';

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const selectDir = async () => {
  const value = await useIpcRendererInvoke<string>('main', { message: 'selectDir', path: props.modelValue?.toString() });
  if (value !== props.modelValue) {
    emit('update:modelValue', value);
  }
};

const openPath = () => {
  useIpcRendererInvoke('main', { message: 'openPath', path: props.modelValue?.toString() });
};

const { inputRules } = usePathInput(props);
</script>
