<template>
  <v-dialog v-model="value" max-width="80%">
    <v-card>
      <v-card-title :class="msgColor">
        {{ item.type.substring(0, 1).toUpperCase() + item.type.substring(1).toLowerCase() }}

        <v-spacer />
        <v-btn icon @click="$emit('change', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="white-space: pre-line"> {{ item.text }} </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'MessageDialog',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: Boolean, required: true },
    item: { type: Object as PropType<Message>, required: true },
  },
  computed: {
    msgColor(): string {
      return this.item.type === 'error' ? 'error--text' : 'green--text';
    },
  },
});
</script>
