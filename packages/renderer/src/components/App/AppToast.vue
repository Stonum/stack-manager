<template>
  <v-snackbar v-model="visible" :color="color" position="absolute" style="z-index: 9999" :timeout="5000" @click="visible = false">
    {{ message?.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessages } from '@/composables';

const { addHook } = useMessages();

const visible = ref(false);
const message = ref<Message>();
const color = ref('');

addHook((msg: Message) => {
  message.value = msg;
  color.value = msg.type == 'error' ? 'error' : 'info';
  visible.value = true;
});
</script>
