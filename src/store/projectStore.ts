import { Module, MutationTree, GetterTree, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';

import store from '.';

interface ProjectState {
  project: { name: string; condition: ProjectCondition }[];
  appStatuses: AppCondition[];
  events: Message[];
  colorBlindMode: boolean;
}

interface AppCondition {
  name: string;
  status: number | undefined;
}

const state: ProjectState = {
  project: [],
  appStatuses: [],
  events: [],
  colorBlindMode: false,
};

const actions: ActionTree<ProjectState, any> = {
  projectAdd(ctx, params: Project): Promise<any> {
    ctx.commit('PROJECT_SET_STATUS', { name: params.name, status: { building: true } });
    const res = ipcRenderer.invoke('project', { message: 'add', params });
    ctx.commit('PROJECT_SET_STATUS', { name: params.name, status: { building: false } });
    return res;
  },

  projectDelete(ctx, projectId: number): Promise<any> {
    return ipcRenderer.invoke('project', { message: 'delete', projectId });
  },

  projectRebuild(ctx, { projectId, params }: { projectId: number; params: Project }): Promise<any> {
    ctx.commit('PROJECT_SET_STATUS', { name: params.name, status: { building: true } });
    const res = ipcRenderer.invoke('project', { message: 'rebuild', projectId, params });
    ctx.commit('PROJECT_SET_STATUS', { name: params.name, status: { building: false } });
    return res;
  },

  async getProjects({ state, commit }): Promise<Project[]> {
    return (await ipcRenderer.invoke('project', { message: 'getAll' })) as Project[];
  },

  async getAppStatus({ state, commit }) {
    const apps = await ipcRenderer.invoke('project', { message: 'getAppStatus' });
    if (apps.length) {
      for (const app of apps) {
        commit('APP_SET_STATUS', { name: app.name, status: app.status });
      }
    }
  },

  async getEvents({ state, commit }) {
    state.events = await ipcRenderer.invoke('project', { message: 'getEvents' });
  },

  async getProject(ctx, projectId: number): Promise<Project> {
    return await ipcRenderer.invoke('project', { message: 'get', projectId });
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
  getAppStatus:
    (state: ProjectState) =>
    (name: string): number | undefined => {
      const app = state.appStatuses.find((value) => value.name === name);
      return app ? app.status : undefined;
    },
  getAppColor: (state: ProjectState, getters) => (name: string) => {
    const status = getters.getAppStatus(name);
    const colorBlindMode = store.getters['mainStore/getSettings']('colorBlindMode');

    switch (status) {
      case 0:
        return 'green';
      case 1:
        return 'warning';
      case 2:
        return colorBlindMode ? 'blue' : 'error';
      default:
        return '#D3D3D3';
    }
  },
  getEvents: (state: ProjectState) => () => {
    return state.events;
  },
  getProjectStatus: (state: ProjectState) => (name: string) => {
    const project = state.project.find((value) => value.name === name);
    return project && project.condition ? project.condition : {};
  },
};

const mutations: MutationTree<ProjectState> = {
  APP_SET_STATUS(state: ProjectState, { name, status }: { name: string; status: number }) {
    const app = state.appStatuses.find((value) => value.name === name);
    if (app) {
      app.status = status;
    } else {
      state.appStatuses.push({ name, status });
    }
  },
  SET_BLIND_MODE(state: ProjectState, mode: boolean) {
    state.colorBlindMode = mode;
  },
  PROJECT_SET_STATUS(state: ProjectState, { name, status }: { name: string; status: Omit<ProjectCondition, 'name'> }) {
    const project = state.project.find((value) => value.name === name);
    if (project) {
      project.condition = { ...project.condition, ...status };
    } else {
      state.project.push({ name, condition: status });
    }
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
