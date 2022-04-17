import { app } from 'electron';

import { settings, projects } from './store';

// здесь будут возможны манипуляции при обновлении версии
export default async function upgradeBeforeStart() {
  const currentVer = app.getVersion();
  const version = settings.get('version');

  if (version !== currentVer) {
    settings.set('version', currentVer);
  }
}
