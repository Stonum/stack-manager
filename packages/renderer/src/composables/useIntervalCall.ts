import { ipcRenderer } from '#preload';

export function useIntervalCall(callback: Function) {
  let interval = 1000;

  setTimeout(async function start() {
    const isVisible = ipcRenderer.invoke('main', { message: 'getVisibleWindow' });
    if (!isVisible) {
      setTimeout(start, 1000);
      return;
    }
    interval = +(await ipcRenderer.invoke('main', { message: 'getSettings', key: 'refresh_interval' })) || 20000;
    try {
      callback();
    } catch (e: AnyException) {
      // в случае ошибки увеличиваем интервал, т.к. возможно диспетчер лежит
      interval = 60 * 1000;
    }

    setTimeout(start, interval);
  }, interval);
}

