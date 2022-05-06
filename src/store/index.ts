import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron';

import mainStore from './mainStore';
import projectStore from './projectStore';

Vue.use(Vuex);

const store = new Vuex.Store({ modules: { mainStore, projectStore } });

ipcRenderer.on('error', (event, payload: any) => {
  store.commit('mainStore/MESSAGE_ADD', { type: 'error', text: payload });
});
ipcRenderer.on('info', (event, payload: any) => {
  store.commit('mainStore/MESSAGE_ADD', { type: 'info', text: payload.title + ' ' + payload.message });
});

let interval = 1000;
setTimeout(async function start() {
  const isVisible = await store.dispatch('mainStore/getVisibleWindow');
  if (!isVisible) {
    setTimeout(start, 1000);
    return;
  }
  interval = +(await store.dispatch('mainStore/getSettings', { key: 'refresh_interval' })) || 20000;
  await store.dispatch('projectStore/getAppStatus');
  await store.dispatch('projectStore/getEvents');
  setTimeout(start, interval);
}, interval);

// раз в час проверяем наличие обновлений
store.dispatch('mainStore/checkForUpdates');
setInterval(() => {
  store.dispatch('mainStore/checkForUpdates');
}, 60 * 60);

export default store;
