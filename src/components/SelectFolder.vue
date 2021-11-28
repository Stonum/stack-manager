<template>
  <v-text-field :value="value" v-bind="$attrs" prepend-icon="$file" readonly @click:prepend="onChangeFolder" />
</template>

<script lang="ts">
import Vue from 'vue';
import { getBackendData } from '@/middleware/index';

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, required: true },
  },
  methods: {
    async onChangeFolder() {
      const result = (await getBackendData('selectDir', { path: this.value })) as string;
      if (result) {
        this.$emit('change', result);
      }
    },
  },
});
</script>
