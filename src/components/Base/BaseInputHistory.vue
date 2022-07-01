<template>
  <v-combobox v-bind="$attrs" :items="items" :label="inputLabel" :rules="inputRules" dense v-on="$listeners" @change="onChange" />
</template>

<script lang="ts">
import Vue from 'vue';
import BaseInput from './BaseInput.vue';

export default Vue.extend({
  name: 'BaseInputHistory',
  extends: BaseInput,
  props: {
    historyId: { type: String, required: true },
  },
  data() {
    return {
      items: [] as string[],
      storage: window.localStorage,
    };
  },
  created() {
    const data = this.storage.getItem(this.historyId);
    if (data) {
      try {
        this.items = JSON.parse(data);
      } catch (e: AnyException) {
        //
      }
    }
  },
  methods: {
    onChange(val: string) {
      if (val && this.items.indexOf(val) === -1) {
        // Новое значение добавляем в начало
        this.items.unshift(val);
        this.storage.setItem(this.historyId, JSON.stringify(this.items));
      }
      this.$emit('change', val);
    },
  },
});
</script>
