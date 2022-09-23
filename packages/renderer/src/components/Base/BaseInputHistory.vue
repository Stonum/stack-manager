<template>
  <base-combobox v-bind="$attrs" :items="items" :label="inputLabel" :rules="inputRules" dense @change="onChange" />
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  label: string
  required?: boolean,
  rules?: any[],
  historyId: string
}>();

const emit = defineEmits<{ (e: 'change', value: string): void }>();

const { inputLabel, inputRules } = useInput(props);

const items = useStorage<string[]>(props.historyId, []);

const onChange = (val: string) => {
   const value = val.trim();
   if (value && items.value.indexOf(value) === -1) {
      // Новое значение добавляем в начало
      items.value.unshift(value);
   }

   emit('change', val);
};

</script>