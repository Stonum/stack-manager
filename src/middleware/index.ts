import { ipcRenderer } from 'electron';

export const setSettings = (key: string, payload: any) => {
  ipcRenderer.send('main', { message: 'setSettings', key, payload });
};

export const getSettings = async (key: string): Promise<any> => {
  ipcRenderer.send('main', { message: 'getSettings', key });
  return new Promise((resolve) => {
    ipcRenderer.on('getSettings', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const selectDir = async (path?: string): Promise<string> => {
  ipcRenderer.send('main', { message: 'selectDir', path });
  return new Promise((resolve) => {
    ipcRenderer.on('selectDir', (event, payload: string) => {
      resolve(payload);
    });
  });
};

export const projectAdd = async (params: any): Promise<any> => {
  ipcRenderer.send('project', { message: 'add', params });
  return new Promise((resolve) => {
    ipcRenderer.on('add', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const getProjects = async (): Promise<any> => {
  ipcRenderer.send('project', { message: 'getAll' });
  return new Promise((resolve) => {
    ipcRenderer.on('getAll', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const getProject = async (projectId: number): Promise<any> => {
  ipcRenderer.send('project', { message: 'get', projectId });
  return new Promise((resolve) => {
    ipcRenderer.on('get', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const projectSendJob = async (jobName: string, projectId: number): Promise<any> => {
  ipcRenderer.send('project', { message: jobName, projectId });
  return new Promise((resolve) => {
    ipcRenderer.on(jobName, (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const readProjectFolder = async (path: string): Promise<any> => {
  ipcRenderer.send('project', { message: 'readFolder', path });
  return new Promise((resolve) => {
    ipcRenderer.on('readFolder', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const readIniFile = async (path: string): Promise<any> => {
  ipcRenderer.send('project', { message: 'readIniFile', path });
  return new Promise((resolve) => {
    ipcRenderer.on('readIniFile', (event, payload: any) => {
      resolve(payload);
    });
  });
};
