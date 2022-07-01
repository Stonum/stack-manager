<template>
  <v-combobox v-bind="$attrs" :label="inputLabel" :rules="inputRules" dense v-on="$listeners" />
</template>

<script lang="ts">
import Vue from 'vue';
import BaseInput from './BaseInput.vue';

export default Vue.extend({
  name: 'BaseCombobox',
  extends: BaseInput,
});
</script>
