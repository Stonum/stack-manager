<template>
  <base-input
    :value="modelValue"
    v-bind="$attrs"
    prepend-icon="mdi-folder-outline"
    append-icon="mdi-open-in-new"
    readonly
    @click:prepend="selectDir()"
    @click:append="openPath()"
  >
    <template v-if="$slots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </base-input>
</template>

<script setup lang="ts">
import { useIpcRendererInvoke } from '@/composables/useIpcRendererInvoke';
import { whenever } from '@vueuse/shared';

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits<{ (e: 'update:modelValue', modelValue: string): void }>();

const { state, isReady, execute: selectDir } = useIpcRendererInvoke('main', { message: 'selectDir', path: props.modelValue?.toString() }, props.modelValue);
whenever(isReady, () => { emit('update:modelValue', state.value); });

const { execute: openPath } = useIpcRendererInvoke('main', { message: 'openPath', path: props.modelValue?.toString() }, props.modelValue);
</script>