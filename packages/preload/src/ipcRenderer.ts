import { ipcRenderer as ipc } from 'electron';

function on(channel: string, cb: any) {
  return ipc.on(channel, cb);
}

const invoke = ipc.invoke;

export const ipcRenderer = { on, invoke };

