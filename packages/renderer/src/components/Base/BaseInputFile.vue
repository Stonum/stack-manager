<template>
  <base-input :value="modelValue" v-bind="$attrs" prepend-icon="mdi-file-document-outline" readonly @click:prepend="execute()">
    <template v-if="$slots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';
import { FileFilter } from 'electron/main';
import { whenever } from '@vueuse/shared';

const props = defineProps<{ modelValue: string, filter: FileFilter }>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const { state, isReady, execute } = useIpcRendererInvoke('main', { message: 'selectFile', path: props.modelValue?.toString(), filter: props.filter }, props.modelValue);

whenever(isReady, () => { emit('update:modelValue', state.value); });
</script>
