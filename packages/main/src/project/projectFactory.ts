import path from 'path';
import fs from 'fs';

import { projects, settings } from '../store';

import ProjectItem from './projectItem';
import * as helper from './projectHelpers';

export default class ProjectFactory {

  static init(params?: ProjectOptions): Project {
    return this.prepare(params || {});
  }

  static create(projectId: number | null, params: ProjectOptions, withoutCheck = false): ProjectItem {
    const project = this.prepare(params);
    if (withoutCheck) {
      this.check(projectId, project);
    }
    return new ProjectItem(project);
  }

  static extractObject(project: ProjectItem) {
    return this.prepare(project);
  }

  private static prepare(params: ProjectOptions) {
    const project = {} as Project;

    project.name = params.name || '';

    project.port = params.port || 0;
    project.type = params.type || 0;

    let bindir = settings.get('bin') as string;
    // если каталог не указан, то будем создавать в папке проекта
    if (!bindir) {
      bindir = path.join(params.path?.git || '.', 'Stack.Srv', 'bin');
    }
    const pathbin_new = project.name ? path.join(bindir, project.name) : '';

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

    if (project.type === helper.StackBackendType.apphost && params.gateway) {
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

  private static check(projectId: number | null, project: Project) {
    const allProjects = projects.getAll();

    const indname = allProjects.findIndex((p: Project, id: number) => {
      return p.name === project.name && id !== projectId;
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
        const res = allProjects.find((p: Project, id: number) => {
          return id !== projectId && (p.gateway?.port === port || p.port === port);
        });
        if (res) {
          throw new Error(`Указанный front порт ${port} уже используется в проекте ${res.name}`);
        }
      }
    });

  }

}

