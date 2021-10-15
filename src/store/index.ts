import Vue from 'vue';
import Vuex from 'vuex';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

const setData = (message: string, data?: any) => {
  ipcRenderer.send('main', { message, data });
};
const getData = async (message: string) => {
  ipcRenderer.send('main', { message });
  return new Promise((resolve) => {
    ipcRenderer.on(message, (event, payload) => {
      resolve(payload);
    });
  });
};

export default new Vuex.Store({
  state: {
    nginx: null,
    disp: null,
    stackversion: null,
  },
  getters: {
    getNginx: (state) => {
      return state.nginx;
    },
    getDisp: (state) => {
      return state.disp;
    },
    getStackVersion: (state) => {
      return state.stackversion;
    },
  },
  mutations: {
    set_config(state, config: any) {
      if (config) {
        state.disp = config.disp;
        state.nginx = config.nginx;
        state.stackversion = config.stackversion;
      }
    },
  },
  actions: {
    async fillStore({ commit }) {
      const config = await getData('getConfig');
      commit('set_config', config);
    },
    saveConfig({ commit }, config) {
      commit('set_config', config);
      setData('saveConfig', config);
    },
  },
  // modules: {},
});
