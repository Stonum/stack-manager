import { app } from 'electron';

import { settings, projects } from './store';

// здесь будут возможны манипуляции при обновлении версии
export default async function upgradeBeforeStart() {
  const currentVer = app.getVersion();
  const version = (settings.get('version') || '0.0.0') as string;

  // у старых проектов без типа надо проставить значение
  if (verToNumber(version) < verToNumber('0.7.9')) {
    if (settings.get('trustedServer') === '') {
      // удалим пустое значение, чтобы подхватилось дефолтное
      settings.delete('trustedServer');
    }
  }

  // проставляем id у имеющихся проектов
  if (verToNumber(version) < verToNumber('0.7.12')) {
    const p = projects.getAll();
    let newId = Date.now();
    for (const project of p) {
      project.id = project.id ?? newId++;
    }
    projects.setAll(p);
  }

  if (version !== currentVer) {
    settings.set('version', currentVer);
  }
}

function verToNumber(ver: string) {
  return ver.split('.').reduce((acc, val, idx, arr) => {
    return acc + +val * Math.pow(10, arr.length - idx);
  }, 0);
}