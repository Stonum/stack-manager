import { Module, MutationTree, GetterTree, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';

import store from '.';

interface ProjectState {
  projects: Project[];
  apps: AppState[];
  events: Message[];
  colorBlindMode: boolean;
}

interface AppState {
  name: string;
  status: number | undefined;
}

const state: ProjectState = {
  projects: [],
  apps: [],
  events: [],
  colorBlindMode: false,
};

const actions: ActionTree<ProjectState, any> = {
  projectAdd(ctx, params: Project): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'add', params });
  },

  projectDelete(ctx, projectId: number): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'delete', projectId });
  },

  projectRebuild(ctx, { projectId, params }: { projectId: number; params: Project }): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'rebuild', projectId, params });
  },

  async getProjects({ state, commit }): Promise<Project[]> {
    const projects = await ipcRenderer.invoke('project', { message: 'getAll' });
    commit('CLEAR_APPS');
    if (projects && projects.length) {
      for (const project of projects) {
        if (project.apps && project.apps.length) {
          for (const app of project.apps) {
            commit('APP_ADD', { name: app.name, status: undefined });
          }
        }
      }
    }
    return projects;
  },

  async getAppStatus({ state, commit }) {
    if (state.apps.length !== 0) {
      const apps = await ipcRenderer.invoke('project', { message: 'getAppStatus' });
      if (apps.length) {
        for (const app of apps) {
          commit('APP_SET_STATUS', { name: app.name, status: app.status });
        }
      }
    }
  },

  async getEvents({ state, commit }) {
    state.events = await ipcRenderer.invoke('project', { message: 'getEvents' });
  },

  getProject(ctx, projectId: number): Promise<Project> {
    return ipcRenderer.invoke('project', { message: 'get', projectId });
  },

  projectSendJob(ctx, { jobName, projectId, params }: { jobName: string; projectId: number; params: any }): Promise<any> {
    return ipcRenderer.invoke('project', { message: jobName, projectId, params });
  },

  readProjectFolder(ctx, path: string): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'readFolder', path });
  },

  readIniFile(ctx, path: string): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'readIniFile', path });
  },

  fillProjects(): Promise<boolean> {
    return ipcRenderer.invoke('project', { message: 'fillProjects' });
  },

  moveProject(ctx, { oldIndex, newIndex }: { oldIndex: number; newIndex: number }): Promise<boolean> {
    return ipcRenderer.invoke('project', { message: 'moveProject', oldIndex, newIndex });
  },

  createStaticApp(ctx, service: string): Promise<boolean> {
    return ipcRenderer.invoke('project', { message: 'createStaticApp', name: service });
  },
};

const getters: GetterTree<ProjectState, any> = {
  getAppStatus: (state: ProjectState) => (name: string) => {
    const app = state.apps.find((value) => value.name === name);
    return app ? app.status : undefined;
  },
  getAppColor: (state: ProjectState, getters) => (name: string) => {
    const status = getters.getAppStatus(name);
    const colorBlindMode = store.getters['mainStore/getSettings']('colorBlindMode');

    switch (status) {
      case 0:
        return colorBlindMode ? 'blue' : 'green';
      case 1:
        return 'warning';

      default:
        return colorBlindMode ? 'yellow' : 'error';
    }
  },
  getEvents: (state: ProjectState) => () => {
    return state.events;
  },
};

const mutations: MutationTree<ProjectState> = {
  CLEAR_APPS(state: ProjectState) {
    state.apps = [];
  },
  APP_ADD(state: ProjectState, app: AppState) {
    state.apps.push(app);
  },
  APP_SET_STATUS(state: ProjectState, { name, status }: { name: string; status: number }) {
    const app = state.apps.find((value) => value.name === name);
    if (app) {
      app.status = status;
    }
  },
  SET_BLIND_MODE(state: ProjectState, mode: boolean) {
    state.colorBlindMode = mode;
  },
};

const projectStore: Module<ProjectState, any> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default projectStore;
