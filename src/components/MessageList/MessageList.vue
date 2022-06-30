<template>
  <v-list :style="`height: ${height}px`">
    <vue-scroll>
      <template v-for="(item, idx) in items">
        <message-item :key="idx" :item="item" />
      </template>
    </vue-scroll>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import MessageItem from './MessageItem.vue';

export default Vue.extend({
  name: 'MessageList',
  components: { MessageItem },
  props: {
    items: { type: Array as PropType<Message[]>, required: true },
    height: { type: Number, required: true },
  },
});
</script>
