import { reactive, ref, Ref, isRef } from 'vue';
import { ipcRenderer } from '#preload';

import { useEvents, useApp } from '@/composables';
import { copyFile } from 'original-fs';

interface ProjectState {
  [index: number]: ProjectCondition
}

const projectState = reactive<ProjectState>({});

function normalizeObject<T,>(obj: Ref<T> | T): T {
  return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj));
}

const { loadEvents } = useEvents();
const { loadStatuses } = useApp();

export function useProject(projectId: number, immediate = false, sourceId = null as null | number) {

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

  async function readFolder() {
    const data = await ipcRenderer.invoke('project', { message: 'changeFolder', params: normalizeObject(project.value) });
    project.value = data.project;
    return data.iniFiles || [];
  }

  async function readIniFile() {
    const data = await ipcRenderer.invoke('project', { message: 'changeIniFile', params: normalizeObject(project.value) });
    project.value = data.project;
  }

  async function changeType() {
    const data = await ipcRenderer.invoke('project', { message: 'changeType', params: normalizeObject(project.value) });
    project.value = data.project;
  }

  async function buildProject() {
    state.building = true;
    try {
      if (projectId < 0) {
        await ipcRenderer.invoke('project', { message: 'add', params: normalizeObject(project.value) });
      } else {
        await ipcRenderer.invoke('project', { message: 'rebuild', projectId, params: normalizeObject(project.value) });
      }
    } catch (e: AnyException) {
      return false;
    } finally {
      state.building = false;
      loadEvents();
      loadStatuses();
    }
    return true;
  }

  async function checkVersion() {
    const data = await ipcRenderer.invoke('project', { message: 'changeIniFile', params: normalizeObject(project.value) });
    const ver = data.project.path.version;
    if (ver && ver.toString().toLowerCase() !== project.value.path.version?.toLowerCase()) {
      return {
        differentVersion: true,
        newVersion: ver
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

  async function init() {
    loading.value = true;
    project.value = await ipcRenderer.invoke('project', { message: 'init' });
    loading.value = false;
  }

  async function copy() {
    loading.value = true;
    project.value = await ipcRenderer.invoke('project', { message: 'copy', projectId: sourceId });
    loading.value = false;
  }

  if (immediate) {
    if (projectId >= 0) {
      get();
    } else {
      if (sourceId) {
        copy();
      } else {
        init();
      }
    }
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
    changeType,
    state,
    project,
    loading
  };
}