<template>
  <v-list :style="`height: ${props.height}px`" class="scrollbar__visible">
    <template v-for="(item, idx) in props.items" :key="idx">
      <message-list-item :item="item" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
import MessageListItem from './MessageListItem.vue';

const props = defineProps<{ items: Message[]; height: number }>();
</script>