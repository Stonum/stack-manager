<template>
  <v-text-field v-bind="$attrs" :label="inputLabel" :rules="inputRules" dense v-on="$listeners">
    <template v-if="$scopedSlots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseInput',
  props: {
    required: { type: Boolean, default: false },
    rules: {
      type: Array,
      default: () => [],
    },
    label: { type: String, default: '' },
  },
  computed: {
    inputRules(): any[] {
      const rules = this.rules;
      if (this.required) {
        rules.push((value: string): boolean | string => {
          return !!value || 'Поле не может быть пустым';
        });
      }
      return rules;
    },
    inputLabel(): string {
      return this.label && this.required ? this.label + '*' : this.label;
    },
  },
});
</script>
