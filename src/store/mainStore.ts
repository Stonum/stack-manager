import { Module, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';

type MainState = Settings;

const state: MainState = {};

const actions: ActionTree<MainState, any> = {
  async setSettings({ state }, { key, data }: { key: string; data: any }) {
    ipcRenderer.send('main', { message: 'setSettings', key, data });
  },

  async getSettings({ state }, { key }: { key: string }) {
    ipcRenderer.send('main', { message: 'getSettings', key });
    return new Promise((resolve) => {
      ipcRenderer.once('getSettings', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async selectDir({ state }, { path }: { path?: string }) {
    ipcRenderer.send('main', { message: 'selectDir', path });
    return new Promise((resolve) => {
      ipcRenderer.once('selectDir', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  async restartDisp({ state }) {
    ipcRenderer.send('main', { message: 'restartDispatcher' });
    return new Promise((resolve) => {
      ipcRenderer.once('restartDispatcher', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  async getChangeLog({ state }) {
    ipcRenderer.send('main', { message: 'getChangeLog' });
    return new Promise((resolve) => {
      ipcRenderer.once('getChangeLog', (event, payload: string) => {
        resolve(payload);
      });
    });
  },

  async getVersion({ state }) {
    ipcRenderer.send('main', { message: 'getVersion' });
    return new Promise((resolve) => {
      ipcRenderer.once('getVersion', (event, payload: string) => {
        resolve(payload);
      });
    });
  },
};

const mainStore: Module<MainState, any> = {
  namespaced: true,
  state,
  actions,
};

export default mainStore;
