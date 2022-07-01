<template>
  <v-checkbox v-model="value" v-bind="$attrs" dense v-on="$listeners" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseCheckbox',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: { value: { type: Boolean, required: true } },
});
</script>
