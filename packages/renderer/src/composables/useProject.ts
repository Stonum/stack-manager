import { reactive } from 'vue';
import { ipcRenderer } from '#preload';

interface ProjectState {
  [index: number]: ProjectCondition
}

const projectState = reactive<ProjectState>({});

export function useProject(projectId: number) {

  if (!projectState[projectId]) {
    projectState[projectId] = reactive({});
  }

  const state = projectState[projectId];

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
    return ipcRenderer.invoke('project', { message: 'readFolder', path });
  }

  async function readIniFile(path: string) {
    return ipcRenderer.invoke('project', { message: 'readIniFile', path });
  }

  return {
    add,
    remove: del,
    sendJob,
    readFolder,
    readIniFile,
    state
  };
}