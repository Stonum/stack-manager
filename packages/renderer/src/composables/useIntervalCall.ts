import { ipcRenderer } from '#preload';

const callbacks: Function[] = [];
let interval = 1000;

let isVisible = document.visibilityState === 'visible';
document.addEventListener('visibilitychange', () => {
  // выводим состояние видимости страницы в консоль
  isVisible = document.visibilityState === 'visible';
});


setTimeout(async function start() {
  if (!isVisible || callbacks.length === 0) {
    setTimeout(start, 500);
    return;
  }

  interval = +(await ipcRenderer.invoke('main', { message: 'getSettings', key: 'refresh_interval' })) || 20000;
  try {
    callbacks.forEach((callback) => callback());
  } catch (e: AnyException) {
    // в случае ошибки увеличиваем интервал, т.к. возможно диспетчер лежит
    interval = 60 * 1000;
  }

  setTimeout(start, interval);
}, interval);

export function useIntervalCall(callback: Function) {
  // просто по имени ф-ии проверяем, нет ли уже такой в пуле вызовов
  if (!callbacks.find(cb => cb.name === callback.name)) {
    callbacks.push(callback);
  }
}

