import { reactive, computed } from 'vue';
import { ipcRenderer } from '#preload';

interface AppState {
  name: string;
  status: number;
}

const appState = reactive<AppState[]>([]);

async function loadStatuses() {
  const apps = await ipcRenderer.invoke('project', { message: 'getAppStatus' });
  if (apps.length) {
    for (const { name, status } of apps) {
      const app = appState.find((value) => value.name === name);
      if (app) {
        app.status = status ?? -1;
      } else {
        appState.push({ name, status: status ?? -1 });
      }
    }
  }
}

export function useApp(name?: string) {

  const status = computed<number>(() => {
    if (!name) {
      return -1;
    }
    const app = appState.find((value) => value.name === name);
    return app ? app.status : -1;
  });

  const color = computed<string>(() => {
    switch (status.value) {
      case 0:
        return 'green';
      case 1:
        return 'warning';
      case 2:
        // return colorBlindMode ? 'blue' : 'error';
        return 'error';
      default:
        return '#D3D3D3';
    }
  });

  return {
    status,
    color,
    loadStatuses,
  };
}