<template>
  <base-input 
    v-bind="$attrs" 
    :model-value="modelValue"
    :label="inputLabel"
    :rules="inputRules"
    @update:model-value="onChange($event)"
    @update:focused="onChangeFocus"
  >
    <v-menu activator="parent">
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          density="compact"
          :title="item"
          @click="onChange(item)"
        >
          <template #append>
            <v-icon @click.stop="onDeleteItem(index)">
              mdi-close
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </base-input>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
const newValue = ref<string | null>(null);
const menuIsOpen = ref(false);

const items = useStorage<string[]>(props.historyId, []);

let timer = null as NodeJS.Timeout | null;

const onChangeFocus = (val: boolean) => {
   menuIsOpen.value = val;
   if (!val) {
      newValue.value = null;
   }
};

const onChange = (val: string | undefined) => {
   const value = val?.trim();
   emit('update:modelValue', val);

   if (timer) {
      clearTimeout(timer);
   }
   timer = setTimeout(() => {
      if (!value) {
         return;
      }
      if (newValue.value !== null) {
         // если вводят значение не меняя фокуса, то перетираем предыдущее добавленное
         items.value.shift();
      }
      if (value && items.value.indexOf(value) === -1) {
         // Новое значение добавляем в начало
         items.value.unshift(value);
         newValue.value = value;
      }
   }, 250);
};

const onDeleteItem = (index: number) => {
   items.value.splice(index, 1);
};

onMounted(() => {
   onChange(props.modelValue);
});

</script>