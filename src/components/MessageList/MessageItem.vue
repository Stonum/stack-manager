<template>
  <div>
    <message-dialog v-if="visibleDialog" v-model="visibleDialog" :item="item" />
    <v-list-item dense>
      <v-list-item-icon @click="visibleDialog = true" style="cursor: pointer">
        <v-icon :color="msgColor">{{ msgIcon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ msgText }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-subtitle>
          {{ msgTime }}
        </v-list-item-subtitle>
      </v-list-item-action>
    </v-list-item>
    <v-divider />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { format } from 'date-fns';

import MessageDialog from './MessageDialog.vue';

export default Vue.extend({
  name: 'MessageItem',
  components: { MessageDialog },
  props: {
    item: { type: Object as PropType<Message>, required: true },
  },
  data() {
    return {
      visibleDialog: false,
    };
  },
  computed: {
    msgText(): string {
      return this.item.text.length > 200 ? this.item.text.substring(1, 200) + '...' : this.item.text;
    },
    msgTime(): string {
      return format(this.item.time, 'HH:mm:ss');
    },
    msgColor(): string {
      return this.item.type === 'error' ? 'error' : 'green';
    },
    msgIcon(): string {
      return this.item.type === 'error' ? 'mdi-alert-circle' : 'mdi-information-outline';
    },
  },
});
</script>
