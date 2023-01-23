<template>
  <base-autocomplete
    :model-value="modelValue" 
    v-bind="$attrs"
    :items="items"
    :label="inputLabel"
    :rules="inputRules"
    hide-no-data
    @update:search="onChange($event)"
  >
    <template #item="{ props, index }">
      <v-list-item
        density="compact"
        v-bind="props"
        :title="props.value"
      >
        <template #append>
          <v-icon @click.stop="onDeleteItem(index)">
            mdi-close
          </v-icon>
        </template>
      </v-list-item>
    </template>
  </base-autocomplete>
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

const onDeleteItem = (index: number) => {
   items.value.splice(index, 1);
};

onMounted(() => {
   onChange(props.modelValue);
});

</script>