import { ref } from 'vue';
import { ipcRenderer } from '#preload';

export function useUpdater() {

  const updateIsAvailable = ref(false);
  const isUpdating = ref(false);

  async function checkForUpdates() {
    updateIsAvailable.value = await ipcRenderer.invoke('main', { message: 'checkForUpdates' });
  }

  async function downloadAndInstallUpdate() {
    isUpdating.value = true;
    await ipcRenderer.invoke('main', { message: 'downloadAndInstallUpdate' });
    isUpdating.value = false;
  }

  checkForUpdates();
  // раз в сутки и при старте проверяем наличие обновлений
  setInterval(() => {
    checkForUpdates();
  }, 24 * 60 * 60 * 1000);

  return {
    updateIsAvailable,
    isUpdating,
    downloadAndInstallUpdate
  };
}