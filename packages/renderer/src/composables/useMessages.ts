import { computed, shallowReactive } from 'vue';
import { createEventHook } from '@vueuse/core';
import { ipcRenderer } from '#preload';

const messages = shallowReactive<Message[]>([]);
const hook = createEventHook<Message>();

ipcRenderer.on('error', (event: any, payload: any) => {
  addMessage('error', payload);
});
ipcRenderer.on('info', (event: any, payload: any) => {
  addMessage('info', payload.title + ' ' + payload.message);
});

function addMessage(type: MessageType, text: string) {
  const message = { type, text, time: new Date() };
  messages.push(message);
  hook.trigger(message);
}

function clearMessages() {
  messages.splice(0);
}

export function useMessages() {

  return {
    messages: computed(() => {
      return messages.sort((a: Message, b: Message) => {
        return a.time < b.time ? 1 : -1;
      });
    }),
    clearMessages,
    addMessage,
    addHook: hook.on
  };
}