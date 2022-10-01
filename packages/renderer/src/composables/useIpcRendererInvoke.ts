import { ipcRenderer } from '#preload';

export function useIpcRendererInvoke<T>(channel: string, payload: any): Promise<T> {
  return ipcRenderer.invoke(channel, payload);
}