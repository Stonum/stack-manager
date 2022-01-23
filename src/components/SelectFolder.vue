<template>
  <v-text-field :value="value" v-bind="$attrs" prepend-icon="$file" readonly @click:prepend="onChangeFolder" v-on="$listeners">
    <template v-if="$scopedSlots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import { selectDir } from '@/middleware/index';

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
      const result = await selectDir(this.value);
      if (result) {
        this.$emit('change', result);
      }
    },
  },
});
</script>
