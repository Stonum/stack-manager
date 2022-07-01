<template>
  <base-input
    :value="value"
    v-bind="$attrs"
    prepend-icon="mdi-folder-outline"
    append-icon="mdi-open-in-new"
    readonly
    @click:prepend="onChangeFolder"
    @click:append="onOpenPath"
    v-on="$listeners"
  >
    <template v-if="$scopedSlots['append-outer']" #append-outer>
      <slot name="append-outer" />
    </template>
  </base-input>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseInputFolder',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: String, required: true },
  },
  methods: {
    async onChangeFolder() {
      const result = await this.$store.dispatch('mainStore/selectDir', { path: this.value?.toString() });
      if (result) {
        this.$emit('change', result);
      }
    },
    async onOpenPath() {
      this.$store.dispatch('mainStore/openPath', { path: this.value?.toString() });
    },
  },
});
</script>
