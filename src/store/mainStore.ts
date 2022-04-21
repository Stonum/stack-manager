import { Module, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';
import { FileFilter } from 'electron/main';

type MainState = Settings;

const state: MainState = {};

const actions: ActionTree<MainState, any> = {
  setSettings({ state }, { key, data }: { key: string; data: any }) {
    ipcRenderer.send('main', { message: 'setSettings', key, data });
  },

  getSettings({ state }, { key }: { key: string }) {
    ipcRenderer.send('main', { message: 'getSettings', key });
    return new Promise((resolve) => {
      ipcRenderer.once('getSettings', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  selectDir({ state }, { path }: { path?: string }) {
    ipcRenderer.send('main', { message: 'selectDir', path });
    return new Promise((resolve) => {
      ipcRenderer.once('selectDir', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  selectFile({ state }, { filter, path }: { filter?: FileFilter; path?: string }) {
    ipcRenderer.send('main', { message: 'selectFile', path, filter });
    return new Promise((resolve) => {
      ipcRenderer.once('selectFile', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  restartDisp({ state }) {
    ipcRenderer.send('main', { message: 'restartDispatcher' });
    return new Promise((resolve) => {
      ipcRenderer.once('restartDispatcher', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  getChangeLog({ state }) {
    ipcRenderer.send('main', { message: 'getChangeLog' });
    return new Promise((resolve) => {
      ipcRenderer.once('getChangeLog', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  getVersion({ state }) {
    ipcRenderer.send('main', { message: 'getVersion' });
    return new Promise((resolve) => {
      ipcRenderer.once('getVersion', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  getVisibleWindow({ state }) {
    ipcRenderer.send('main', { message: 'getVisibleWindow' });
    return new Promise((resolve) => {
      ipcRenderer.once('getVisibleWindow', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  openURL({ state }, { url }: { url?: string }) {
    ipcRenderer.send('main', { message: 'openURL', url });
  },
};

const mainStore: Module<MainState, any> = {
  namespaced: true,
  state,
  actions,
};

export default mainStore;
