import { app } from 'electron';
import path from 'path';

import { settings, projects } from './store';

// здесь будут возможны манипуляции при обновлении версии
export default async function upgradeBeforeStart() {
  const currentVer = app.getVersion();
  const version = (settings.get('version') || '0.0.0') as string;

  const allProjects = projects.get('projects', []) as Project[];

  // добавились настройки гейтвэя
  if (verToNumber(version) < verToNumber('0.5.3')) {
    console.log('there2');
    for (const project of allProjects) {
      if (project.gateway?.path && !project.gateway.settings) {
        project.gateway.settings = path.join(project.gateway.path, 'application.yml');
      }
    }
    projects.set('projects', allProjects);
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
