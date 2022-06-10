import { app } from 'electron';
import path from 'path';

import { settings, projects } from './store';

// здесь будут возможны манипуляции при обновлении версии
export default async function upgradeBeforeStart() {
  const currentVer = app.getVersion();
  const version = (settings.get('version') || '0.0.0') as string;

  const allProjects = projects.get('projects', []) as Project[];

  // у старых проектов без типа надо проставить значение
  if (verToNumber(version) < verToNumber('0.5.7')) {
    for (const project of allProjects) {
      if (!project.type) {
        project.type = 0;
      }
    }
    projects.set('projects', allProjects);
  }

  // добавил флаг активности приложений
  if (verToNumber(version) < verToNumber('0.5.9')) {
    for (const project of allProjects) {
      if (project.apps) {
        project.apps = project.apps.map((app: ProjectApp) => {
          return { ...app, active: Object.prototype.hasOwnProperty.call(app, 'active') ? app.active : true };
        });
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
