import { Module, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';
import { FileFilter } from 'electron/main';

type MainState = Settings;

const state: MainState = {};

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
};

const mainStore: Module<MainState, any> = {
  namespaced: true,
  state,
  actions,
};

export default mainStore;
