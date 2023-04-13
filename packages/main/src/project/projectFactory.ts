import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';

import ProjectItem from './projectItem';
import * as helper from './projectHelpers';
import { checkPort } from '@/utils';

export default class ProjectFactory {

  static async init(params?: ProjectOptions): Promise<Project> {
    return await this.setDefaultPorts(this.prepare(params || {}));
  }

  static async create(params: ProjectOptions, withCheck = false): Promise<ProjectItem> {
    const project = await this.setDefaultPorts(this.prepare(params));
    if (withCheck) {
      this.check(project);
    }
    return new ProjectItem(project);
  }

  static async copy(params: ProjectOptions): Promise<ProjectItem> {
    const newParams: ProjectOptions = { name: params.name + '_copy', id: undefined, port: 0 };
    if (params.type === helper.StackBackendType.apphost) {
      newParams.gateway = { name: params.gateway?.name || '', path: params.gateway?.path || '', port: 0 };
    }
    if (params.apps) {
      newParams.apps = [];
      for (const app of params.apps) {
        newParams.apps.push({ ...app, name: '', port: null });
      }
    }

    const project = await this.setDefaultPorts(this.prepare({ ...params, ...newParams }));
    return new ProjectItem(project);
  }

  static extractObject(project: ProjectItem) {
    return this.prepare(project);
  }

  private static prepare(params: ProjectOptions) {
    const project = {} as Project;

    project.id = params.id && params.id > 0 ? params.id : Date.now();
    project.name = params.name || '';

    project.port = params.port || 0;
    project.type = params.type || 0;

    let bindir = settings.get('bin') as string;
    // если каталог не указан, то будем создавать в папке проекта
    if (!bindir) {
      bindir = path.join(params.path?.git || '.', 'Stack.Srv', 'bin');
    }
    const pathbin_new = project.name ? path.join(bindir, project.name) : '';

    project.restartMaxCount = params.restartMaxCount ?? 5;

    project.path = {
      version: params.path?.version || '',
      bin: pathbin_new,
      git: params.path?.git || '',
      ini: params.path?.ini || '',
      front: params.path?.front || '',
    };

    project.sql = {
      server: params.sql?.server || '',
      base: params.sql?.base || '',
      login: params.sql?.login || '',
      password: params.sql?.password || '',
    };

    if (project.type === helper.StackBackendType.apphost) {
      project.gateway = {
        name: project.name + '_gateway',
        path: params.gateway?.path || '',
        port: params.gateway?.port || 0,
      };
    }

    project.apps = [];
    if (params.apps) {
      project.apps = params.apps.map((app) => {
        return {
          id: app.id,
          port: app.port,
          name: app.name || project.name + '_' + app.id,
          path: app.path,
          args: app.args,
          active: app.active,
        };
      });
    }

    return project;
  }

  private static async setDefaultPorts(project: Project) {
    if (project.port === 0) {
      project.port = await ProjectFactory.getFreePort(8000);
    }
    if (project.gateway && project.gateway?.port === 0) {
      project.gateway.port = await ProjectFactory.getFreePort(8100);
    }
    if (project.apps) {
      let freeDebugPort = 3000;
      for (const app of project.apps) {
        freeDebugPort = app.port || await ProjectFactory.getFreePort(freeDebugPort++);
        app.port = freeDebugPort;
      }
    }
    return project;
  }

  private static check(project: Project) {
    const allProjects = projects.getAll();

    const indname = allProjects.findIndex((p: Project) => {
      return p.name === project.name && p.id !== project.id;
    });
    if (indname >= 0) {
      throw new Error(`Уже есть проект с таким именем`);
    }

    // проверим валидность путей
    for (const key of Object.keys(project.path) as Array<keyof typeof project.path>) {
      const cpath = project.path[key];
      if (cpath && !fs.existsSync(cpath) && key !== 'bin') {
        throw new Error(`Некорректный путь ${cpath}`);
      }
    }

    if (project.type === helper.StackBackendType.apphost && project.gateway) {
      if (project.gateway.path && !fs.existsSync(project.gateway.path)) {
        throw new Error(`Некорректный путь ${project.gateway.path}`);
      }

      const application = path.join(project.gateway.path, 'application.yml');
      if (application && !fs.existsSync(application)) {
        throw new Error(`Не найден файл настроек ${application}`);
      }

      const jre = path.join(project.gateway.path, helper.getGatewayFileName(project.gateway.path));
      if (application && !fs.existsSync(jre)) {
        throw new Error(`Не найден файл jar файл ${jre}`);
      }

      if (project.gateway.path && !settings.get('jre')) {
        throw new Error(`Не задан каталг jre в настройках`);
      }
      if (!fs.existsSync(settings.get('jre'))) {
        throw new Error(`Не существующий каталог jre. Проверьте настройки`);
      }

      if (!settings.get('rabbitmq_url')) {
        throw new Error(`Не указан адрес RabbitMQ. Проверьте настройки`);
      }
    }

    if (project.type === helper.StackBackendType.apphost && !project.gateway) {
      throw new Error(`Не заданы настройки StackGateWay`);
    }

    const ports = [];
    ports.push(project.port);
    if (project.gateway) {
      ports.push(project.gateway.port);
    }

    ports.forEach((port: number | null | undefined) => {
      if (port) {
        const res = allProjects.find((p: Project) => {
          return p.id !== project.id && (p.gateway?.port === port || p.port === port);
        });
        if (res) {
          throw new Error(`Указанный front порт ${port} уже используется в проекте ${res.name}`);
        }
      }
    });

  }

  private static getBusyPorts(): number[] {
    const busyPorts = [] as number[];

    for (const project of projects.getAll()) {
      if (project.port) {
        busyPorts.push(project.port);
      }
      if (project.gateway?.port) {
        busyPorts.push(project.gateway.port);
      }
      for (const app of project.apps) {
        if (app.port) {
          busyPorts.push(app.port);
        }
      }
    }

    return busyPorts;
  }

  private static async getFreePort(startPort: number): Promise<number> {
    const busyPorts = ProjectFactory.getBusyPorts();
    let freePort = startPort;
    let portIsFree = false;

    do {
      freePort++;

      if (busyPorts.find(port => port === freePort)) {
        continue;
      }

      if (! await checkPort(freePort)) {
        continue;
      }

      portIsFree = true;

    } while (!portIsFree);

    return freePort;
  }
}

