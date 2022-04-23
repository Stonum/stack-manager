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

const eventResolver = function (name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ipcRenderer.on(name, (event, payload: any | Error): any => {
      if (payload instanceof Error) {
        reject(payload);
      } else {
        resolve(payload);
      }
    });
  });
};

const actions: ActionTree<ProjectState, any> = {
  projectAdd(ctx, params: Project): Promise<any> {
    ipcRenderer.send('project', { message: 'add', params });
    return eventResolver('add');
  },

  projectDelete(ctx, projectId: number): Promise<any> {
    ipcRenderer.send('project', { message: 'delete', projectId });
    return eventResolver('delete');
  },

  projectRebuild(ctx, { projectId, params }: { projectId: number; params: Project }): Promise<any> {
    ipcRenderer.send('project', { message: 'rebuild', projectId, params });
    return eventResolver('rebuild');
  },

  getProjects({ state, commit }): Promise<Project[]> {
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

  getAppStatus({ state, commit }) {
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

  getProject(ctx, projectId: number): Promise<Project> {
    ipcRenderer.send('project', { message: 'get', projectId });
    return eventResolver('get');
  },

  projectSendJob(ctx, { jobName, projectId, params }: { jobName: string; projectId: number; params: any }): Promise<any> {
    ipcRenderer.send('project', { message: jobName, projectId, params });
    return eventResolver(jobName);
  },

  readProjectFolder(ctx, path: string): Promise<any> {
    ipcRenderer.send('project', { message: 'readFolder', path });
    return eventResolver('readFolder');
  },

  readIniFile(ctx, path: string): Promise<any> {
    ipcRenderer.send('project', { message: 'readIniFile', path });
    return eventResolver('readIniFile');
  },

  fillProjects(): Promise<boolean> {
    ipcRenderer.send('project', { message: 'fillProjects' });
    return eventResolver('fillProjects');
  },

  moveProject(ctx, { oldIndex, newIndex }: { oldIndex: number; newIndex: number }): Promise<boolean> {
    ipcRenderer.send('project', { message: 'moveProject', oldIndex, newIndex });
    return eventResolver('moveProject');
  },

  createStaticApp(ctx, service: string): Promise<boolean> {
    ipcRenderer.send('project', { message: 'createStaticApp', name: service });
    return eventResolver('createStaticApp');
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
