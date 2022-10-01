import { reactive, ref, Ref, isRef } from 'vue';
import { ipcRenderer } from '#preload';

interface ProjectState {
  [index: number]: ProjectCondition
}

const projectState = reactive<ProjectState>({});

function normalizeObject<T,>(obj: Ref<T> | T): T {
  return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj));
}

export function useProject(projectId: number, immediate = false) {

  if (!projectState[projectId]) {
    projectState[projectId] = reactive({});
  }

  const state = projectState[projectId];
  const loading = ref(false);

  let project = ref({
    path: {},
    sql: {},
    gateway: {},
    apps: [] as ProjectApp[],
  }) as Ref<Project>;

  function setStatus(jobName: string, status: boolean) {
    switch (jobName) {
      case 'appReStart':
        state.restarting = status;
        break;
      case 'buildFront':
        state.deploying = status;
        break;
      case 'gitPull':
        state.pulling = status;
        break;
    }
  }

  async function add(params: Project) {
    state.building = true;
    const res = await ipcRenderer.invoke('project', { message: 'add', params });
    state.building = false;
    return res;
  }

  async function del() {
    return ipcRenderer.invoke('project', { message: 'delete', projectId });
  }

  async function sendJob(jobName: string, params?: any) {
    setStatus(jobName, true);
    try {
      await ipcRenderer.invoke('project', { message: jobName, projectId, params });
    } finally {
      setStatus(jobName, false);
    }
  }

  async function readFolder(path: string) {
    const data = await ipcRenderer.invoke('project', { message: 'readFolder', path });
    let iniFiles = [];
    if (data) {
      iniFiles = data.ini;
      project.value.path.front = data.front;
      project.value.path.ini = iniFiles[0];
      project.value.type = data.type;
      if (project.value.gateway) {
        project.value.gateway.path = data.gateway;
      }
      readIniFile(project.value.path.ini);
    }
    return iniFiles;
  }

  async function readIniFile(path: string) {
    const data = await ipcRenderer.invoke('project', { message: 'readIniFile', path });
    if (data && project.value) {
      project.value.sql.server = data.server;
      project.value.sql.base = data.base;
      project.value.path.version = data.version;
      if (project.value.gateway && !project.value.gateway?.path && data.gateway) {
        project.value.gateway.path = data.gateway;
      }
    }
  }

  async function buildProject() {
    loading.value = true;
    try {
      if (projectId < 0) {
        await ipcRenderer.invoke('project', { message: 'add', params: normalizeObject(project.value) });
      } else {
        await ipcRenderer.invoke('project', { message: 'rebuild', projectId, params: normalizeObject(project.value) });
      }
    } catch (e: AnyException) {
      return false;
    } finally {
      loading.value = false;
    }
    return true;
  }

  async function get() {
    loading.value = true;
    project.value = await ipcRenderer.invoke('project', { message: 'get', projectId });
    loading.value = false;
  }

  if (immediate && projectId >= 0) {
    get();
  }

  return {
    get,
    add,
    remove: del,
    sendJob,
    readFolder,
    readIniFile,
    buildProject,
    state,
    project,
    loading
  };
}