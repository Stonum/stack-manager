import { Ref, isRef, ref, watch } from 'vue';
import { ipcRenderer } from '#preload';
import { useMessages } from '@/composables';

async function saveSettingKey(key: string, data: string | boolean | number | Task[]) {
  return ipcRenderer.invoke('main', { message: 'setSettings', key, data });
}

function normalizeObject<T,>(obj: Ref<T> | T): T {
  return JSON.parse(JSON.stringify(isRef(obj) ? obj.value : obj));
}

const settings = ref<Settings>({});

export function useSettings() {

  let settingsBeforeChange: Settings = {};
  const loading = ref(false);
  const isChanged = ref(false);

  const { addMessage } = useMessages();

  watch(settings, (oldVal, newVal) => {
    if (oldVal === newVal) {
      isChanged.value = true;
    }
  }, { deep: true });

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
    addMessage('info', 'Настройки сохранены');
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

