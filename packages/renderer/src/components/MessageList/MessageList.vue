<template>
  <v-list :style="`height: ${props.height}px`">
    <vue-scroll>
      <template v-for="(item, idx) in props.items" :key="idx">
        <message-list-item :item="item" />
      </template>
    </vue-scroll>
  </v-list>
</template>

<script setup lang="ts">
import MessageListItem from './MessageListItem.vue';

const props = defineProps<{ items: Message[], height: number }>();
</script>
