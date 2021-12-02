import Store from 'electron-store';

export const settings = new Store({ name: 'settings', cwd: 'config' });
export const projects = new Store({ name: 'projects', cwd: 'config' });
