
import { ipcRenderer } from '#preload';
import { useAsyncState, UseAsyncStateOptions, UseAsyncStateReturn } from '@vueuse/core';

export function useIpcRendererInvokeAsync<T>(channel: string, payload: any, initialState: T, options: UseAsyncStateOptions<boolean> = {}): UseAsyncStateReturn<T, boolean> {
  return useAsyncState<T, boolean>(async () => {
    return ipcRenderer.invoke(channel, payload);
  }, initialState, options);
}