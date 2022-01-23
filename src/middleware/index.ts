import { ipcRenderer } from 'electron';

export const setSettings = (key: string, data: any) => {
  ipcRenderer.send('main', { message: 'setSettings', key, data });
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

export const projectAdd = async (params: Project): Promise<any> => {
  ipcRenderer.send('project', { message: 'add', params });
  return new Promise((resolve) => {
    ipcRenderer.on('add', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const projectDelete = async (projectId: number): Promise<any> => {
  ipcRenderer.send('project', { message: 'delete', projectId });
  return new Promise((resolve) => {
    ipcRenderer.on('delete', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const projectRebuild = async (projectId: number, params: Project): Promise<any> => {
  ipcRenderer.send('project', { message: 'rebuild', projectId, params });
  return new Promise((resolve) => {
    ipcRenderer.on('rebuild', (event, payload: any) => {
      resolve(payload);
    });
  });
};

export const getProjects = async (): Promise<Project[]> => {
  ipcRenderer.send('project', { message: 'getAll' });
  return new Promise((resolve) => {
    ipcRenderer.on('getAll', (event, payload: Project[]) => {
      resolve(payload);
    });
  });
};

export const getProject = async (projectId: number): Promise<Project> => {
  ipcRenderer.send('project', { message: 'get', projectId });
  return new Promise((resolve) => {
    ipcRenderer.on('get', (event, payload: Project) => {
      resolve(payload);
    });
  });
};

export const projectSendJob = async (jobName: string, projectId: number, params: any): Promise<any> => {
  ipcRenderer.send('project', { message: jobName, projectId, params });
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

export const fillProjects = async (): Promise<boolean> => {
  ipcRenderer.send('project', { message: 'fillProjects' });
  return new Promise((resolve) => {
    ipcRenderer.on('fillProjects', (event, payload: boolean) => {
      resolve(payload);
    });
  });
};
