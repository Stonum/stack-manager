<template>
  <v-text-field :value="value" v-bind="$attrs" prepend-icon="mdi-file-document-outline" readonly @click:prepend="onChangeFolder" v-on="$listeners">
    <template v-if="$scopedSlots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FileFilter } from 'electron/main';

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, required: true },
    filter: { type: Object as PropType<FileFilter>, default: {} },
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
