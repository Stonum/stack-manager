
import path from 'path';
import fs from 'fs';
import os from 'os';

import { readSettingsFile, writeSettingsFile, writeIniFile, readIniFile } from '../utils';
import { settings } from '@/store';
import * as helper from './projectHelpers';

export async function generateStackIni(project: Project, pathini: string, binold: string, binnew: string, version: string) {
  const data = (await readSettingsFile(pathini)) as StackIniFile;

  if (!data['SQL-mode']) {
    data['SQL-mode'] = {};
  }

  const [sqlserver, sqlport] = project.sql.server.split(':');

  data['SQL-mode'].Server = sqlserver;
  data['SQL-mode'].Base = project.sql.base;
  data['SQL-mode'].Schema = project.type !== helper.StackBackendType.apphost ? project.sql.base + '.stack' : 'stack';

  if (sqlport) {
    if (!data['PostgreSQL options']) {
      data['PostgreSQL options'] = {};
    }
    data['PostgreSQL options'].AddConnectionString = `port=${sqlport} sslmode=disable`;
  }

  // correct path of resources
  if (data.AppPath) {
    for (const key in data.AppPath) {
      if (data.AppPath[key] && data.AppPath[key].length) {
        for (const idx in data.AppPath[key]) {
          const respath = data.AppPath[key][idx];
          if (respath.startsWith('..')) {
            data.AppPath[key][idx] = path.join(binold, respath);
          } else {
            data.AppPath[key][idx] = respath.replace(helper.verpattern, version);
          }
        }
      }
    }
  }

  if (project.type !== helper.StackBackendType.apphost && data.LibPath) {
    const libpath = data.LibPath.Path || '';
    if (libpath.startsWith('..')) {
      data.LibPath.Path = path.join(binold, libpath);
    } else {
      data.LibPath.Path = libpath.replace(helper.verpattern, version);
    }
  }

  if (data.JavaClient) {
    const jspath = data.JavaClient.JCPath || '';
    if (jspath.startsWith('..')) {
      data.JavaClient.JCPath = path.join(binold, jspath);
    } else {
      data.JavaClient.JCPath = jspath.replace(helper.verpattern, version);
    }

    const jrepath = data.JavaClient.JREPath || '';
    if (jrepath.startsWith('..')) {
      data.JavaClient.JREPath = path.join(binold, jrepath);
    } else {
      data.JavaClient.JREPath = jrepath.replace(helper.verpattern, version);
    }

    const jsupath = data.JavaClient.JCUpdatePath || '';
    if (jsupath.startsWith('..')) {
      data.JavaClient.JCUpdatePath = path.join(binold, jsupath);
    } else {
      data.JavaClient.JCUpdatePath = jsupath.replace(helper.verpattern, version);
    }
  }

  if (!data.API) {
    data.API = {};
  }

  const sharePath = settings.get('share') as string;
  if (sharePath) {
    data.API.PublicFilesPath = sharePath;
  }
  const uploadPath = settings.get('upload') as string;
  if (uploadPath) {
    data.API.UploadedFilesPath = uploadPath;
  }

  if (settings.get('birt') && settings.get('birt_port')) {
    if (!data.BirtStarter) {
      data.BirtStarter = {};
    }
    if (project.type === helper.StackBackendType.apphost) {
      data.BirtStarter.Port = +(settings.get('birt_port') as number);
    } else {
      data.BirtStarter.BSPort = +(settings.get('birt_port') as number);
    }
  }

  if (project.type === helper.StackBackendType.apphost) {
    if (settings.get('dotnetcore') && settings.get('dotnetcore_port')) {
      if (!data.DotNetCore) {
        data.DotNetCore = {};
      }
      data.DotNetCore.Port = +(settings.get('dotnetcore_port') as number);
    }
  }

  await writeSettingsFile(path.join(binnew, 'stack.ini'), data);
}

export async function generateTaskSettings(project: Project, app: ProjectApp) {
  const commonSettingsPath = path.join(project.path.version, 'Stack.srv', 'Bin', 'ini', 'settings.toml');

  let tomlData = {} as any;

  if (fs.existsSync(commonSettingsPath)) {
    tomlData = await readSettingsFile(commonSettingsPath);
  } else {
    tomlData.RabbitMQrpc = {};
    tomlData.RabbitMQrpc.exchange = '';
    tomlData.RabbitMQrpc.routing_key = 'rpc_queue';
    tomlData.RabbitMQrpc.qos = 1;
    tomlData.RabbitMQrpc.product_name = 'StackExe';

    tomlData.RabbitMQService = {};
    tomlData.RabbitMQService.queue = '';
    tomlData.RabbitMQService.product_name = 'StackService';
  }
  const task = (settings.get('tasks') as Task[])?.find((task: Task) => task.id === app.id);

  const taskid = task?.prefix || app.id;
  const rabbithost = new URL(settings.get('rabbitmq_url'));
  if (rabbithost) {
    tomlData.RabbitMQrpc.host = tomlData.RabbitMQService.host = rabbithost.hostname;
    tomlData.RabbitMQrpc.port = tomlData.RabbitMQService.port = +rabbithost.port;

    // tomlData.RabbitMQrpc.vhost = tomlData.RabbitMQService.vhost = '/';
    // settings.RabbitMQrpc.login = settings.RabbitMQService.login = 'stack';
    // settings.RabbitMQrpc.password = settings.RabbitMQService.password = 'stack';

    tomlData.RabbitMQrpc.routing_key = os.hostname + '_' + project.name + '_' + taskid;
    tomlData.RabbitMQrpc.routing_key_asynch = os.hostname + '_' + project.name + '_' + taskid;

    tomlData.RabbitMQService.exchange = os.hostname + '_' + project.name + '_service_exchange';
    tomlData.RabbitMQService.exchange_in = os.hostname + '_' + project.name + '_service_to_backend';
    tomlData.RabbitMQService.exchange_out = os.hostname + '_' + project.name + '_service_from_backend';
    tomlData.RabbitMQService.task = taskid;
  }

  const queueSettingsPath = path.join(project.path.bin, `settings_${taskid}.toml`);
  await writeSettingsFile(queueSettingsPath, tomlData);
}

export async function generateCredentials(project: Project, pathnew: string) {
  const data = {
    Database: {
      login: project.sql.login,
      password: project.sql.password,
    },
  };
  await writeSettingsFile(path.join(pathnew, 'credentials.ini'), data);
}

export async function generateGatewaySettings(project: Project, pathnew: string) {
  if (!project.gateway) {
    return null;
  }

  const templateYaml = path.join(project.gateway.path, 'application.yml');
  if (fs.existsSync(templateYaml)) {
    const dataYaml = await readSettingsFile(templateYaml);
    const common = dataYaml[0];

    common.server.port = +project.gateway.port || common.server.port;
    common.stack.security.cors.allowedOrigins = helper.getAllowedOrigins([8080, 8081, project.port || 0]);

    if (!common.stack.security.jwt) {
      common.stack.security.jwt = {};
    }
    common.stack.security.jwt.accessToken = { expTimeInMinute: 720 };
    common.stack.security.jwt.refreshToken = { expTimeInHour: 12 };

    common.stack.license = { trustedServer: settings.get('trustedServer') };

    const tasks = settings.get('tasks') as Task[];

    common.stack.queue.rpc.tasks = Object.fromEntries(
      project.apps.map((app: ProjectApp) => {
        const task = tasks.find((task: Task) => task.id === app.id);
        const taskid = task?.prefix || app.id;
        return [
          taskid,
          {
            routingKey: os.hostname + '_' + project.name + '_' + taskid,
            routingKeyAsync: os.hostname + '_' + project.name + '_' + taskid,
            useAsyncCache: false,
            codeTask: app.id,
          },
        ];
      })
    );

    common.stack.queue.service.exchange = os.hostname + '_' + project.name + '_service_exchange';
    common.stack.queue.service.exchangeIn = os.hostname + '_' + project.name + '_service_from_backend';
    common.stack.queue.service.exchangeOut = os.hostname + '_' + project.name + '_service_to_backend';

    common.stack.http.uploadDir = settings.get('upload');
    common.stack.http.shareDir = settings.get('share');

    const rabbithost = new URL(settings.get('rabbitmq_url'));
    if (rabbithost) {
      common.spring.rabbitmq.host = rabbithost.hostname;
      common.spring.rabbitmq.port = +rabbithost.port;

      // common.spring.rabbitmq['virtual-host'] = '/';
      // common.spring.rabbitmq.username = 'stack';
      // common.spring.rabbitmq.password = 'stack';
    }

    common.spring.profiles.active = 'postgresql';
    const profile = (() => {
      for (let i = 1; i < dataYaml.length; i++) {
        const cur = dataYaml[i];
        if (cur.spring && cur.spring.config && cur.spring.config.activate && cur.spring.config.activate['on-profile'] === common.spring.profiles.active) {
          return cur;
        }
      }
      return {
        spring: {
          config: {
            activate: {
              'on-profile': common.spring.profiles.active,
            },
          },
        },
      };
    })();

    const [sqlserver, sqlport] = project.sql.server.split(':');
    profile.spring.datasource = {
      url: `jdbc:postgresql://${sqlserver}:${sqlport || 5432}/${project.sql.base}`,
      username: project.sql.login,
      password: project.sql.password,
    };

    await writeSettingsFile(path.join(pathnew, 'application.yml'), dataYaml);
    return path.join(pathnew, 'application.yml');
  }
  return null;
}

export async function generateBootstrapSettings(project: Project, pathnew: string) {
  if (!project.gateway) {
    return null;
  }

  const templateYaml = path.join(project.gateway.path, 'bootstrap.yml');
  if (fs.existsSync(templateYaml)) {
    const dataYaml = await readSettingsFile(templateYaml);
    const common = dataYaml[0];

    common.spring.cloud.consul.enabled = false;

    await writeSettingsFile(path.join(pathnew, 'bootstrap.yml'), dataYaml);
    return path.join(pathnew, 'bootstrap.yml');
  }
  return null;
}

async function getEnvConfig(project: Project, envPath: string) {
  const tasks = settings.get('tasks') as Task[];
  const disp = new URL(settings.get('dispatcher_url') as string);
  const config = await readIniFile(envPath);

  // чистим лишние ключи из конфига
  const keys = ['BACKEND_STATE_INTERVAL', 'ASYNC_JOBS_INTERVAL', 'CLIENT_DIR', 'API_HOST_TIMEOUT'];
  for (const key of Object.keys(config)) {
    if (keys.indexOf(key) === -1) {
      delete config[key];
    }
  }

  const isAppHost = project.type === helper.StackBackendType.apphost;

  const taskPrefix = (id: number) => {
    return tasks.find((task) => {
      return task.id === id;
    })?.prefix;
  };

  if (isAppHost) {
    config['API_HOST'] = `http://${os.hostname().toLowerCase()}:${project.gateway?.port}`;
  }
  if (!isAppHost) {
    for (const app of project.apps) {
      const prefix = taskPrefix(app.id);
      config['API_HOST_' + prefix?.toUpperCase()] = disp.origin + app.path;
    }
  }

  config.BUNDLES = project.apps
    .filter((app) => app.id !== 11075)
    .map((app) => taskPrefix(app.id))
    .join(',');

  // с версии 1.0.0 стало просто /share а было /gateway/share
  let staticPrefix = isAppHost ? config['API_HOST'] : disp.origin;
  if (project.gateway?.path) {
    const harFile = helper.getGatewayFileName(project.gateway.path);
    if (isAppHost && harFile && harFile.indexOf('0.0.3') > 0) {
      staticPrefix += '/stackgateway';
    }
  }
  const sharePath = settings.get('share') as string;
  if (sharePath) {
    config['API_HOST_SHARE'] = staticPrefix + '/share';
  }
  const uploadPath = settings.get('upload') as string;
  if (uploadPath) {
    config['API_HOST_UPLOAD'] = staticPrefix + '/upload';
  }
  return config;
}

export async function generateEnvLocal(project: Project) {
  let envPath = path.join(project.path.front, '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.join(project.path.front, '.env');
    if (!fs.existsSync(envPath)) {
      envPath = path.join(project.path.front, '.env.example');
      if (!fs.existsSync(envPath)) {
        throw new Error('Не найден .env файл');
      }
    }
  }

  const config = await getEnvConfig(project, envPath);

  await writeIniFile(path.join(project.path.front, '.env.local'), config);
}

export async function generateEnvJson(project: Project, envpath: string) {
  const envPath = path.join(project.path.front, '.env.local');
  if (!fs.existsSync(envPath)) {
    await generateEnvLocal(project);
  }
  const config = await getEnvConfig(project, envPath);

  await writeSettingsFile(path.join(envpath, 'env.json'), config);
}

export async function generateWorkspaceFile(project: Project, wsPath: string, verPath: string) {
  let config = {} as any;
  if (fs.existsSync(wsPath)) {
    config = await readSettingsFile(wsPath);
  }

  config.folders = [];

  // если фронт каталог лежит в папке проекта, то добавляем его в workspace
  if (project.path.front && path.resolve(path.dirname(project.path.front)) === path.resolve(project.path.git)) {
    config.folders.push({ path: project.path.front });
  }

  // каталог клиентских заплаток если есть
  const srvName = fs.readdirSync(project.path.git).find(fld => fld.toLowerCase() === 'stack.srv');
  if (srvName) {
    config.folders.push({ path: path.join(project.path.git, srvName) });
  } else {
    config.folders.push({ path: project.path.git });
  }

  const srvNameVer = fs.readdirSync(verPath).find(fld => fld.toLowerCase() === 'stack.srv');
  if (srvNameVer) {
    config.folders.push({ path: path.join(verPath, srvNameVer), name: path.basename(verPath) });
  } else {
    config.folders.push({ path: verPath, name: path.basename(verPath) });
  }

  if (!config.settings) {
    config.settings = {
      'files.exclude': {
        '**/Update': true,
        '**/Bin': true,
        '**/BinLite': true,
      },
      'search.exclude': {
        '**/.git': true,
        '**/node_modules': true,
        '**/.tmp': true,
      },
      'editor.formatOnSave': false,
    };
  }
  // добавляем в конфиг путь к каталогу с ини файлом, чтобы не пытался его найти в каталоге фронта
  if (!config.settings.stack) {
    config.settings.stack = {};
  }
  config.settings.stack.iniPath = project.path.bin;

  const debugs = [];
  for (const app of project.apps) {
    if (app.port) {
      debugs.push({
        type: 'stack',
        request: 'attach',
        name: app.name,
        address: 'localhost',
        port: app.port,
      });
    }
  }

  if (debugs.length) {
    config.launch = {};
    config.launch.version = '0.2.0';
    config.launch.configurations = debugs;
  }

  return await writeSettingsFile(wsPath, config);
}