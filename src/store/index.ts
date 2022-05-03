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

export default store;
