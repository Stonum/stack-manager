import { reactive, ref, Ref, isRef } from 'vue';
import { ipcRenderer } from '#preload';

import { useEvents, useApp } from '@/composables';

interface ProjectState {
  [index: number]: ProjectCondition
}

const projectState = reactive<ProjectState>({});

function normalizeObject<T,>(obj: Ref<T> | T): T {
  return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj));
}

const { loadEvents } = useEvents();
const { loadStatuses } = useApp();

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

  async function del() {
    const res = await ipcRenderer.invoke('project', { message: 'delete', projectId });
    loadEvents();
    return res;
  }

  async function sendJob(jobName: string, params?: any) {
    setStatus(jobName, true);
    try {
      await ipcRenderer.invoke('project', { message: jobName, projectId, params });
    } finally {
      setStatus(jobName, false);
      loadEvents();
      loadStatuses();
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
    state.building = true;
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
      state.building = false;
      loadEvents();
      loadStatuses();
    }
    return true;
  }

  async function checkVersion() {
    const data = await ipcRenderer.invoke('project', { message: 'readIniFile', path: project.value.path.ini });
    if (data.version && data.version.toString().toLowerCase() !== project.value.path.version?.toLowerCase()) {
      return {
        differentVersion: true,
        newVersion: data.version
      };
    }
    return {
      differentVersion: false,
      newVersion: project.value.path.version
    };
  }

  async function openProjectFolder() {
    await get();
    await ipcRenderer.invoke('main', { message: 'openPath', path: project.value.path.bin });
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
    remove: del,
    sendJob,
    readFolder,
    readIniFile,
    buildProject,
    checkVersion,
    openProjectFolder,
    state,
    project,
    loading
  };
}