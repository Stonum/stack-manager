import Store from 'electron-store';
import { app } from 'electron';
import { join } from 'path';

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

  refresh_interval: 20000,
  share_name: '_share',
  upload_name: '_upload',
  birt_name: '_birt',
  birt_port: 20777,
  dotnetcore_name: '_dotnetcore',
  dotnetcore_port: 20001,
  colorBlindMode: false,
  workspacePath: join(app.getPath('userData'), 'workspaces'),
  staticPath: join(app.getPath('userData'), 'domains'),
};

export const settings = new Store({ name: 'settings', cwd: 'config', defaults: defSettings });
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

  get(index: number): Project {
    const res = this.getAll();
    return res[index];
  }

  set(index: number, project: Project) {
    const res = this.getAll();
    res[index] = project;
    this.setAll(res);
  }

  add(project: Project) {
    const res = this.getAll();
    res.push(project);
    this.setAll(res);
  }

  delete(index: number) {
    const res = this.getAll();
    res.splice(index, 1);
    this.setAll(res);
  }

  setAppStatus(projectId: number, appName: string, status: boolean) {
    const res = this.getAll();

    if (res[projectId]) {

      const project = res[projectId];

      project.apps.forEach((app, appId) => {
        if (app.name == appName) {
          this.store.set(`projects.${projectId}.apps.${appId}.active`, status);
        }
      });
    }
  }
}

export const projects = new ProjectStore({ name: 'projects', cwd: 'config' });
