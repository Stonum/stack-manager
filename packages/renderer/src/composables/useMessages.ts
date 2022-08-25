import { computed, shallowReactive } from 'vue';
import { ipcRenderer } from '#preload';

let messages = shallowReactive<Message[]>([]);

ipcRenderer.on('error', (event, payload: any) => {
  addMessage('error', payload);
});
ipcRenderer.on('info', (event, payload: any) => {
  addMessage('info', payload.title + ' ' + payload.message);
});

function addMessage(type: string, text: string) {
  messages.push({ type, text, time: new Date() });
}

function clearMessages() {
  console.log('clear');
  messages = [];
}

export function useMessages() {

  return {
    messages: computed(() => {
      return messages.sort((a: Message, b: Message) => {
        return a.time < b.time ? 1 : -1;
      });
    }),
    clearMessages,
    addMessage
  };
}