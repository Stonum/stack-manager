<template>
  <v-text-field
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
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';

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
