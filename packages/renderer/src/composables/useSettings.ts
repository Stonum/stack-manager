import { Ref, isRef, ref, watch } from 'vue';
import { ipcRenderer } from '#preload';


async function saveSettingKey(key: string, data: string | boolean | number | Task[]) {
  return ipcRenderer.invoke('main', { message: 'setSettings', key, data });
}

function normalizeObject<T,>(obj: Ref<T> | T): T {
  return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj));
}

export function useSettings() {
  const settings = ref<Settings>({});

  let settingsBeforeChange: Settings = {};
  const loading = ref(false);
  const isChanged = ref(false);

  watch(settings, () => { isChanged.value = true; }, { deep: true });

  async function loadSettings() {
    loading.value = true;
    settings.value = await ipcRenderer.invoke('main', { message: 'getSettings', key: {} });
    settingsBeforeChange = normalizeObject(settings.value);
    loading.value = false;
    isChanged.value = false;
  }

  async function saveSettings() {
    for (const key in settings.value) {
      if (key !== 'tasks' && settings.value[key] !== settingsBeforeChange[key]) {
        await saveSettingKey(key, settings.value[key]);
      }
      if (key === 'tasks' && settings.value.tasks) {
        if (JSON.stringify(settings.value.tasks) !== JSON.stringify(settingsBeforeChange.tasks)) {
          await saveSettingKey(key, normalizeObject(settings.value.tasks));
        }
      }
    }

    loadSettings();
  }

  async function createService(service: string) {
    await saveSettingKey(service, settings.value[service]);
    if (service === 'birt' || service === 'dotnetcore') {
      await saveSettingKey(service + '_port', settings.value[service + '_port']);
    }
    await ipcRenderer.invoke('project', { message: 'createStaticApp', name: service });
  }

  loadSettings();

  return {
    settings,
    isChanged,
    saveSettings,
    createService
  };
}

