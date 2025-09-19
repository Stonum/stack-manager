import Store from 'electron-store';
import { app } from 'electron';
import { join } from 'path';
import os from 'os';

const defSettings = {
  tasks: [
    { title: 'АРМ администратора', prefix: 'admin', id: 11075, selected: true, port: 0 },
    { title: 'Расчеты с абонентами - физическими лицами', prefix: 'fl', id: 252, selected: true, port: 1 },
    { title: 'Расчеты с абонентами - юридическими лицами', prefix: 'ul', id: 11058, selected: true, port: 2 },
    { title: 'АРМ юриста', prefix: 'dlg_fl', id: 278, selected: true, port: 3 },
    { title: 'АРМ юриста (юридические лица)', prefix: 'dlg_ul', id: 284, selected: true, port: 4 },
    { title: 'Коммуникации', prefix: 'commun', id: 281, selected: true, port: 5 },
    { title: 'Касса', prefix: 'kassa', id: 11065, selected: false, port: 6 },
    { title: 'Паспортный стол', prefix: 'passport', id: 169, selected: false, port: 7 },
    { title: 'Аварийно-диспетчерская служба', prefix: 'avar', id: 11061, selected: false, port: 8 },
    { title: 'Подомовой учет', prefix: 'pdu', id: 253, selected: false, port: 9 },
    { title: 'АРМ юриста поставщика', prefix: 'post_ur', id: 5024, selected: false, port: 10 },
    { title: 'Расчеты с поставщиками', prefix: 'rsp', id: 279, selected: false, port: 11 },
  ] as Task[],

  dispatcher_url: '',
  dispatcher_folder: '',
  dispatcher_password: '',
  rabbitmq_url: '',
  rabbitmq_login: '',
  rabbitmq_password: '',
  refresh_interval: 20000,
  share: '',
  share_name: '_share',
  upload: '',
  upload_name: '_upload',
  birt: '',
  birt_name: '_birt',
  birt_port: 20777,
  dotnetcore: '',
  dotnetcore_name: '_dotnetcore',
  dotnetcore_port: 20001,
  colorBlindMode: false,
  workspacePath: join(app.getPath('userData'), 'workspaces'),
  staticPath: join(app.getPath('userData'), 'domains'),
  stackversion: '',
  bin: '',
  jre: '',
  fullLogging: false,
  version: app.getVersion(),
  trustedServer: import.meta.env.VITE_TRUSTED_SERVER || '',
  consul: import.meta.env.VITE_CONSUL || '',
};

type SettingsType = typeof defSettings;

class SettingsStore extends Store {

  constructor(options: any) {
    super(options);
  }

  get<Key extends keyof SettingsType>(key: Key, defaultValue?: unknown): SettingsType[Key] {
    const result = super.get(key, defaultValue) as SettingsType[Key];
    // обработка неполностью введенного урла
    if (key === 'dispatcher_url' || key === 'rabbitmq_url') {
      if (result && typeof result === 'string') {
        let url = result as string;
        if (url.indexOf('://') < 0) {
          url = 'http://' + result;
        }
        url = url.replace('localhost', os.hostname()).replace('127.0.0.1', os.hostname());
        return url as SettingsType[Key];
      }
    }
    return result;
  }
}

export const settings = new SettingsStore({ name: 'settings', cwd: 'config', defaults: defSettings });
class ProjectStore {

  private store;

  constructor(options: any) {
    this.store = new Store(options);
  }

  getAll(): Project[] {
    return this.store.get('projects', []) as Project[];
  }

  setAll(projects: Project[]) {
    this.store.set('projects', projects);
  }

  get(projectId: number): Project | undefined {
    const res = this.getAll();
    return res.find(project => project.id === projectId);
  }

  set(projectId: number, project: Project) {
    const res = this.getAll();
    const index = res.findIndex(project => project.id === projectId);
    if (index >= 0) {
      res[index] = project;
      this.setAll(res);
    } else {
      throw 'Не найден проект с id = ' + projectId;
    }
  }

  add(project: Project) {
    const res = this.getAll();
    res.push(project);
    this.setAll(res);
  }

  delete(projectId: number) {
    const res = this.getAll();
    const index = res.findIndex(project => project.id === projectId);
    if (index >= 0) {
      res.splice(index, 1);
      this.setAll(res);
    } else {
      throw 'Не найден проект с id = ' + projectId;
    }
  }

  setAppStatus(projectId: number, appName: string, status: boolean) {

    const project = this.get(projectId);
    if (project) {
      project.apps.forEach((app, appId) => {
        if (app.name == appName) {
          this.store.set(`projects.${projectId}.apps.${appId}.active`, status);
        }
      });
    } else {
      throw 'Не найден проект с id = ' + projectId;
    }

  }
}

export const projects = new ProjectStore({ name: 'projects', cwd: 'config' });
