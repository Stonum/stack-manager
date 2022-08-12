import { ipcRenderer } from '#preload';
import { useAsyncState, UseAsyncStateOptions, UseAsyncStateReturn } from '@vueuse/core';

export function useIpcRendererInvoke<T>(channel: string, payload: any, initialState: T, options: UseAsyncStateOptions<true> = {}): UseAsyncStateReturn<T, boolean> {
  return useAsyncState<T>(async () => {
    return ipcRenderer.invoke(channel, payload);
  }, initialState, Object.assign({ immediate: false }, options));
}