<template>
  <base-input :value="value" v-bind="$attrs" prepend-icon="mdi-file-document-outline" readonly @click:prepend="onChangeFolder" v-on="$listeners">
    <template v-if="$scopedSlots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </base-input>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FileFilter } from 'electron/main';

export default Vue.extend({
  name: 'BaseInputFile',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, required: true },
    filter: {
      type: Object as PropType<FileFilter>,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    async onChangeFolder() {
      const result = await this.$store.dispatch('mainStore/selectFile', { path: this.value?.toString(), filter: this.filter });
      if (result) {
        this.$emit('change', result);
      }
    },
  },
});
</script>
