import { Module, MutationTree, GetterTree, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';
import { FileFilter } from 'electron/main';

type MainState = {
  messages: Message[];
  updateIsAvailable: boolean;
};

const state: MainState = {
  messages: [],
  updateIsAvailable: false,
};

const actions: ActionTree<MainState, any> = {
  setSettings({ state }, { key, data }: { key: string; data: any }) {
    ipcRenderer.invoke('main', { message: 'setSettings', key, data });
  },

  getSettings({ state }, { key }: { key: string }) {
    return ipcRenderer.invoke('main', { message: 'getSettings', key });
  },

  selectDir({ state }, { path }: { path?: string }) {
    return ipcRenderer.invoke('main', { message: 'selectDir', path });
  },

  selectFile({ state }, { filter, path }: { filter?: FileFilter; path?: string }) {
    return ipcRenderer.invoke('main', { message: 'selectFile', path, filter });
  },

  restartDisp({ state }) {
    return ipcRenderer.invoke('main', { message: 'restartDispatcher' });
  },

  getChangeLog({ state }) {
    return ipcRenderer.invoke('main', { message: 'getChangeLog' });
  },

  getVersion({ state }) {
    return ipcRenderer.invoke('main', { message: 'getVersion' });
  },

  getVisibleWindow({ state }) {
    return ipcRenderer.invoke('main', { message: 'getVisibleWindow' });
  },

  openURL({ state }, { url }: { url?: string }) {
    return ipcRenderer.invoke('main', { message: 'openURL', url });
  },

  openPath({ state }, { path }: { path?: string }) {
    return ipcRenderer.invoke('main', { message: 'openPath', path });
  },

  async checkForUpdates({ state, commit }) {
    const res = await ipcRenderer.invoke('main', { message: 'checkForUpdates' });
    if (res) {
      commit('SET_AVAILABLE_UPDATE', res);
    }
    return res;
  },

  downloadAndInstallUpdate({ state }) {
    return ipcRenderer.invoke('main', { message: 'downloadAndInstallUpdate' });
  },
};

const getters: GetterTree<MainState, any> = {
  getMessages: (state: MainState) => () => {
    return state.messages;
  },
  getUpdateAvailable: (state: MainState) => () => {
    return state.updateIsAvailable;
  },
};

const mutations: MutationTree<MainState> = {
  MESSAGE_ADD(state: MainState, msg: Message) {
    state.messages.push({ ...msg, time: new Date() });
  },
  SET_AVAILABLE_UPDATE(state: MainState, value: boolean) {
    state.updateIsAvailable = value;
  },
};

const mainStore: Module<MainState, any> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default mainStore;
