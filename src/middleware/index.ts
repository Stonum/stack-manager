import { ipcRenderer } from 'electron';

export const setBackendData = (message: string, data?: any) => {
  ipcRenderer.send('main', { message, data });
};
export const getBackendData = async (message: string, params?: any) => {
  ipcRenderer.send('main', { message, params });
  return new Promise((resolve) => {
    ipcRenderer.on(message, (event, payload) => {
      resolve(payload);
    });
  });
};
