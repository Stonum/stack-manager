import { shallowRef } from 'vue';
import { ipcRenderer } from '#preload';

const events = shallowRef<Message[]>([]);

async function loadEvents() {
  events.value = await ipcRenderer.invoke('main', { message: 'getEvents' });
}

export function useEvents() {

  loadEvents();

  return {
    events, loadEvents
  };
}