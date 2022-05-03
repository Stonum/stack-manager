<template>
  <v-list :style="`height: ${height}px`">
    <vue-scroll>
      <template v-for="(item, idx) in items">
        <div :key="idx">
          <v-list-item dense>
            <v-list-item-icon>
              <v-icon :color="getColor(item)">{{ getIcon(item) }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-subtitle>
                {{ formatTime(item.time) }}
              </v-list-item-subtitle>
            </v-list-item-action>
          </v-list-item>
          <v-divider />
        </div>
      </template>
    </vue-scroll>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { format } from 'date-fns';

export default Vue.extend({
  name: 'MessageList',
  props: {
    items: { type: Array as PropType<Message[]>, required: true },
    height: { type: Number, required: true },
  },
  computed: {},
  methods: {
    formatTime(datetime: Date) {
      return format(datetime, 'HH:mm:ss');
    },
    getColor(msg: Message) {
      return msg.type === 'error' ? 'error' : 'green';
    },
    getIcon(msg: Message) {
      return msg.type === 'error' ? 'mdi-alert-circle' : 'mdi-information-outline';
    },
  },
});
</script>
