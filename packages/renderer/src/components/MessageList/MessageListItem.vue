<template>
  <message-list-dialog v-if="isVisibleDialog" v-model="isVisibleDialog" :item="props.item" />
    
  <v-list-item
    density="compact"
    :title="msgText"
  >
    <template #prepend>
      <v-icon :color="msgColor" style="cursor: pointer" @click="isVisibleDialog = true">
        {{ msgIcon }}
      </v-icon>
    </template>

    <template #append>
      <v-list-item-subtitle>
        {{ msgTime }}
      </v-list-item-subtitle>
    </template>
  </v-list-item>
  <v-divider />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { format } from 'date-fns';

import MessageListDialog from './MessageListDialog.vue';

const props = defineProps<{ item: Message }>();

const isVisibleDialog = ref(false);

const msgText = computed(() => { return props.item.text.length > 200 ? props.item.text.substring(1, 200) + '...' : props.item.text; });
const msgTime = computed(() => { return format(props.item.time, 'HH:mm:ss'); });
const msgColor = computed(() => { return props.item.type === 'error' ? 'error' : 'green'; });
const msgIcon = computed(() => { return props.item.type === 'error' ? 'mdi-alert-circle' : 'mdi-information-outline'; });
</script>
