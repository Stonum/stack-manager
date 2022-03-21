import { Module, MutationTree, GetterTree, ActionTree } from 'vuex';
import { ipcRenderer } from 'electron';

interface ProjectState {
  projects: Project[];
  apps: AppState[];
}

interface AppState {
  name: string;
  status: number | undefined;
}

const state: ProjectState = {
  projects: [],
  apps: [],
};

const actions: ActionTree<ProjectState, any> = {
  async projectAdd(ctx, params: Project): Promise<any> {
    ipcRenderer.send('project', { message: 'add', params });
    return new Promise((resolve) => {
      ipcRenderer.on('add', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async projectDelete(ctx, projectId: number): Promise<any> {
    ipcRenderer.send('project', { message: 'delete', projectId });
    return new Promise((resolve) => {
      ipcRenderer.on('delete', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async projectRebuild(ctx, { projectId, params }: { projectId: number; params: Project }): Promise<any> {
    ipcRenderer.send('project', { message: 'rebuild', projectId, params });
    return new Promise((resolve) => {
      ipcRenderer.on('rebuild', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async projectSave(ctx, { projectId, params }: { projectId: number; params: Project }): Promise<any> {
    ipcRenderer.send('project', { message: 'save', projectId, params });
    return new Promise((resolve) => {
      ipcRenderer.on('save', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async getProjects({ state, commit }): Promise<Project[]> {
    ipcRenderer.send('project', { message: 'getAll' });
    return new Promise((resolve) => {
      ipcRenderer.on('getAll', (event, payload: Project[]) => {
        resolve(payload);
        commit('CLEAR_APPS');
        if (payload && payload.length) {
          for (const project of payload) {
            if (project.apps && project.apps.length) {
              for (const app of project.apps) {
                commit('APP_ADD', { name: app.name, status: undefined });
              }
            }
          }
        }
      });
    });
  },

  async getAppStatus({ state, commit }) {
    if (state.apps.length !== 0) {
      ipcRenderer.send('project', { message: 'getAppStatus' });
      ipcRenderer.on('getAppStatus', (event, payload: any) => {
        if (payload?.length) {
          for (const app of payload) {
            commit('APP_SET_STATUS', { name: app.name, status: app.status });
          }
        }
      });
    }
  },

  async getProject(ctx, projectId: number): Promise<Project> {
    ipcRenderer.send('project', { message: 'get', projectId });
    return new Promise((resolve) => {
      ipcRenderer.on('get', (event, payload: Project) => {
        resolve(payload);
      });
    });
  },

  async projectSendJob(ctx, { jobName, projectId, params }: { jobName: string; projectId: number; params: any }): Promise<any> {
    ipcRenderer.send('project', { message: jobName, projectId, params });
    return new Promise((resolve, reject) => {
      ipcRenderer.on(jobName, (event, payload: any) => {
        if (payload instanceof Error) {
          reject(payload);
        } else {
          resolve(payload);
        }
      });
    });
  },

  async readProjectFolder(ctx, path: string): Promise<any> {
    ipcRenderer.send('project', { message: 'readFolder', path });
    return new Promise((resolve) => {
      ipcRenderer.on('readFolder', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async readIniFile(ctx, path: string): Promise<any> {
    ipcRenderer.send('project', { message: 'readIniFile', path });
    return new Promise((resolve) => {
      ipcRenderer.on('readIniFile', (event, payload: any) => {
        resolve(payload);
      });
    });
  },

  async fillProjects(): Promise<boolean> {
    ipcRenderer.send('project', { message: 'fillProjects' });
    return new Promise((resolve, reject) => {
      ipcRenderer.on('fillProjects', (event, payload: boolean | Error) => {
        if (payload instanceof Error) {
          reject(payload);
        } else {
          resolve(payload);
        }
      });
    });
  },

  async moveProject(ctx, { oldIndex, newIndex }: { oldIndex: number; newIndex: number }): Promise<boolean> {
    ipcRenderer.send('project', { message: 'moveProject', oldIndex, newIndex });
    return new Promise((resolve) => {
      ipcRenderer.on('moveProject', (event, payload: boolean) => {
        resolve(payload);
      });
    });
  },
};

const getters: GetterTree<ProjectState, any> = {
  getAppStatus: (state: ProjectState) => (name: string) => {
    const app = state.apps.find((value) => value.name === name);
    return app ? app.status : undefined;
  },
  getAppColor: (state: ProjectState, getters) => (name: string) => {
    const status = getters.getAppStatus(name);
    switch (status) {
      case 0:
        return 'green';
      case 1:
        return 'warning';

      default:
        return 'error';
    }
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
};

const projectStore: Module<ProjectState, any> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default projectStore;
