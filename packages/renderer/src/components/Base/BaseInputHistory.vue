<template>
  <base-combobox
    :model-value="modelValue" 
    v-bind="$attrs"
    :items="items"
    :label="inputLabel"
    :rules="inputRules"
    hide-no-data
    @update:search="onChange($event)"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStorage } from '@vueuse/core';
import { useInput } from '@/composables/useInput';

const props = defineProps<{
  label: string
  required?: boolean,
  rules?: any[],
  historyId: string
  modelValue?: string,
}>();

const emit = defineEmits<{
   (e: 'update:modelValue', modelValue: string | undefined): void
}>();

const { inputLabel, inputRules } = useInput(props);

const items = useStorage<string[]>(props.historyId, []);

let timer = null as NodeJS.Timeout | null;

const onChange = (val: string | undefined) => {
   if (timer) {
      clearTimeout(timer);
   }
   timer = setTimeout(() => {
      const value = val?.trim();
      if (!value) {
         return;
      }
      if (value && items.value.indexOf(value) === -1) {
         // Новое значение добавляем в начало
         items.value.unshift(value);
      }
      emit('update:modelValue', val);
   }, 250);
};

onMounted(() => {
   onChange(props.modelValue);
});

</script>