import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron';

import mainStore from './mainStore';
import projectStore from './projectStore';

Vue.use(Vuex);

const store = new Vuex.Store({ modules: { mainStore, projectStore } });

// предзаполним стор нужными настройками
['colorBlindMode', 'refresh_interval', 'tasks'].forEach((key: string) => {
  store.dispatch('mainStore/getSettings', { key });
});

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
  interval = +store.getters['mainStore/getSettings']('refresh_interval') || 20000;
  try {
    await store.dispatch('projectStore/getAppStatus');
    await store.dispatch('projectStore/getEvents');
  } catch (e: AnyException) {
    // в случае ошибки увеличиваем интервал, т.к. возможно диспетчер лежит
    interval = 60 * 1000;
  }

  setTimeout(start, interval);
}, interval);

// раз в сутки и при старте проверяем наличие обновлений
store.dispatch('mainStore/checkForUpdates');
setInterval(() => {
  store.dispatch('mainStore/checkForUpdates');
}, 24 * 60 * 60 * 1000);

export default store;
