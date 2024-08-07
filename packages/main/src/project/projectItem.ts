import path from 'path';
import fs from 'fs';

import { copyFiles, getFiles, readSettingsFile } from '../utils';

import { settings } from '@/store';

import * as config from './projectConfig';
import * as helper from './projectHelpers';

import Dispatcher, { IServerAPI } from '@/middleware/dispatcher';
import cmd from '@/cmd';


export default class ProjectItem {

  id: number;
  name: string;
  path: ProjectPaths;
  sql: ProjectSQLSettings;
  apps: ProjectApp[];
  port: number | null;
  type: StackBackendType;
  restartMaxCount: number;
  gateway?: ProjectGateway;

  webServer: IServerAPI;

  frontPath: string;
  wsPath: string;
  verPath: string;

  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.path = project.path;
    this.sql = project.sql;
    this.apps = project.apps;
    this.port = project.port;
    this.type = project.type;
    this.restartMaxCount = project.restartMaxCount;
    this.gateway = project.gateway;

    this.frontPath = path.join(settings.get('staticPath'), project.name);
    this.wsPath = path.join(settings.get('workspacePath'), `${this.name}.code-workspace`);

    const mathed = project.path.version.match(helper.verpattern);
    this.verPath = project.path.version;
    if (settings.get('stackversion')) {
      if (mathed && mathed[1]) {
        const ver = mathed[1].replaceAll('//', '');
        this.verPath = path.join(settings.get('stackversion') as string, ver);
      }
    }
    this.verPath = path.join(this.verPath, '\\');

    const address = settings.get('dispatcher_url') as string;
    const secret = settings.get('dispatcher_password') as string;
    const disp = new Dispatcher(address, secret);

    this.webServer = project.type === helper.StackBackendType.apphost ? disp.appServer() : disp.webServer();
  }

  async changeFolder() {
    if (!this.path.git) {
      return;
    }

    if (fs.existsSync(path.join(this.path.git, 'Stack.Front'))) {
      this.path.front = path.join(this.path.git, 'Stack.Front');
    }

    const iniFiles = [];
    const pathBin = path.join(this.path.git, 'Stack.Srv', 'Bin');
    if (fs.existsSync(pathBin)) {
      const files = await getFiles(pathBin);
      for (const file of files) {
        if (path.basename(file).toLowerCase() == 'stack.ini') {
          iniFiles.push(file);
        }
      }
    }
    if (iniFiles.length) {
      this.path.ini = iniFiles[0];
    }

    if (fs.existsSync(path.join(pathBin, '0', 'app_host.exe'))) {
      this.type = 1;
      if (!this.gateway) {
        this.gateway = {
          name: this.name + '_gateway',
          path: '',
          port: 0,
        };
      }
      // поищем гейтвэй
      const pathGateWay = path.join(this.path.git, 'StackGateway');
      if (fs.existsSync(pathGateWay)) {
        this.gateway.path = pathGateWay;
      }
    }
    return iniFiles;
  }

  async changeIniFile() {
    if (!this.path.ini) {
      return;
    }

    const data = (await readSettingsFile(this.path.ini)) as StackIniFile;
    const verPath = this.path.version;

    if (data['SQL-mode']) {
      this.sql.server = data['SQL-mode'].Server || '';
      this.sql.base = data['SQL-mode'].Base || '';
    }

    const pathlist = [];

    if (data.AppPath?.DB?.length) {
      for (const cpath of data.AppPath.DB) {
        const res = cpath.match(helper.verpattern);
        if (res) {
          this.path.version = res[0];
        }

        const cpath_res = path.resolve(path.dirname(this.path.ini), cpath);
        pathlist.push(cpath_res);
      }
    }

    let commonFolder;
    if (pathlist.length) {
      commonFolder = pathlist[pathlist.length - 1];
    }

    if (commonFolder) {
      const srv_index = commonFolder.toLowerCase().indexOf('stack.srv');
      if (srv_index > 0) {
        commonFolder = commonFolder.substring(0, srv_index);
      }
    }
    if (!this.path.version && commonFolder) {
      this.path.version = commonFolder;
    }
    // если найденный каталог не попадает под паттерн версии то не меняем, ибо нашли что-то не то
    if (!this.path.version.match(helper.verpattern)) {
      this.path.version = verPath;
    }

    // поищем гейтвэй
    if (this.gateway) {
      const pathGateWay = path.join(this.path.version, 'StackGateway');
      if (fs.existsSync(pathGateWay)) {
        this.gateway.path = pathGateWay;
      }
    }

    return commonFolder;
  }

  async delete() {
    await this.deleteApps();

    // удаляем созоданный каталог в бин
    if (fs.existsSync(this.path.bin)) {
      fs.rmSync(this.path.bin, { recursive: true, force: true });
    }

    // удаляем созданный фронт
    if (fs.existsSync(this.frontPath)) {
      fs.rmSync(this.frontPath, { recursive: true, force: true });
    }
  }

  async deleteApps() {

    const promises = this.apps.map((app) => {
      return this.webServer.deleteItem(app.name);
    });
    if (this.gateway?.name) {
      promises.push(this.webServer.deleteItem(this.gateway.name));
    }

    return Promise.all(promises);
  }

  async build() {
    const apphost_project = this.type === helper.StackBackendType.apphost;

    // копируем каталог версии если его нет
    if (!fs.existsSync(this.verPath)) {
      await copyFiles(this.path.version, this.verPath);
    }

    const pathbin_old = path.dirname(this.path.ini);
    const pathbin_new = this.path.bin;

    // копируем exe и прочие файлы в бин каталог
    const pathini = this.path.ini;
    const pathbin_ver = path.join(this.verPath, 'Stack.srv', 'Bin', '0');

    if (fs.existsSync(pathbin_ver)) {
      await copyFiles(pathbin_ver, pathbin_new);
    } else {
      // смотрим путь в котором лежит инишка, и копируем оттуда
      if (fs.existsSync(pathini)) {
        const bin_dir = path.dirname(pathini);
        await copyFiles(bin_dir, pathbin_new);
      }
    }

    // редактируем stack.ini и создаем в целевом каталоге
    if (fs.existsSync(pathini)) {
      config.generateStackIni(this, pathini, pathbin_old, pathbin_new, this.verPath);
    }

    if (apphost_project) {
      await config.generateCredentials(this, pathbin_new);

      // деплоим гейтвэй
      if (this.gateway?.name) {
        const path_gateway = path.join(pathbin_new, 'StackGateway');
        await copyFiles(this.gateway.path, path_gateway);
        const gatewaySettingsPath = await config.generateGatewaySettings(this, path_gateway);
        const bootstrapSettingsPath = await config.generateBootstrapSettings(this, path_gateway);

        let cmdArgs = `-Xmx1024m -jar ${helper.getGatewayFileName(path_gateway)} `;
        if (bootstrapSettingsPath) {
          cmdArgs += ` --spring.cloud.bootstrap.location=${path.relative(path_gateway, bootstrapSettingsPath)}`;
        }
        if (gatewaySettingsPath) {
          cmdArgs += ` --spring.config.location=classpath:/application.yml,classpath:file:${path.relative(path_gateway, gatewaySettingsPath)}`;
        }

        await this.webServer.addItem(this.gateway.name, {
          IsActive: 1,
          cmd: path.join(settings.get('jre'), 'bin', 'javaw.exe'),
          cmdArgs,
          path: path_gateway,
          restart: 1,
          restartMaxCount: this.restartMaxCount,
        });
        await this.webServer.startItem(this.gateway.name);
      }
    }

    if (!apphost_project) {
      for (const app of this.apps) {
        const inspect = app.port ? `--inspect=${app.port}` : '';
        await this.webServer.addItem(app.name, {
          UrlPathPrefix: app.path,
          StackProgramDir: this.path.bin,
          StackProgramParameters: `-u:${this.sql.login} -p:${this.sql.password} -t:${app.id} -LOADRES ${inspect} -nc ${app.args}`,
          IsActive: app.active ? 1 : 0,
          FunctionName: 'StackAPI_kvplata_v1',
          ResultContentType: 'application/json;charset=utf-8',
          UseComStack: 1,
          ShareStaticContent: 0,
          UploadStaticContent: 0,
          FallbackEnabled: 0,
          AllowServiceCommands: 0,
          RestartComStackMaxCount: this.restartMaxCount
        });
        if (app.active) {
          await this.webServer.startItem(app.name);
        }
      }
    }
    if (apphost_project) {
      for (const app of this.apps) {
        await config.generateTaskSettings(this, app);

        const task = (settings.get('tasks') as Task[])?.find((task: Task) => task.id === app.id);
        const syncThreadCount = app.syncThreadCount || 20;
        const asyncThreadCount = app.asyncThreadCount || 2;
        const asyncTaskCount = app.asyncTaskCount || 5;
        const trustedServer = settings.get('trustedServer');

        const addParams = app.id === 11075 ? ',очищатьПросроченныеДанные:true' : '';
        const expression = `ЗапуститьОчередьСообщений(@{количествоПотоков:${syncThreadCount},количествоАсинхронныхПотоков:${asyncThreadCount},количествоАсинхронныхРабот:${asyncTaskCount}${addParams}})`;
        const rabbitsettings = `settings_${task?.prefix || app.id}.toml`;
        const inspect = app.port ? `--inspect=${app.port}` : '';
        const cmdArgs = `--task=${app.id} ${inspect} -r ${trustedServer} -i "stack.ini" -c "credentials.ini" --rabbit="${rabbitsettings}" -f "${expression}"`;

        await this.webServer.addItem(app.name, {
          IsActive: app.active ? 1 : 0,
          cmd: path.join(this.path.bin, 'app_host.exe'),
          cmdArgs,
          path: this.path.bin,
          restart: this.restartMaxCount > 0 ? 1 : 0,
          restartMaxCount: this.restartMaxCount,
        });
        if (app.active) {
          await this.webServer.startItem(app.name);
        }
      }
    }

    if (this.path.front && fs.existsSync(this.path.front)) {
      await config.generateEnvLocal(this);
    }

    await config.generateWorkspaceFile(this, this.wsPath, this.verPath);
  }

  async buildFront() {
    if (!this.path.front) {
      throw new Error(`Не задан каталог Stack.Front`);
    }
    if (!fs.existsSync(this.path.front)) {
      throw new Error(`Не найден указанный каталог Stack.Front`);
    }

    if (fs.existsSync(path.join(this.path.front, 'node_modules'))) {
      await cmd.exec('npm ci --progress=false', this.path.front);
    } else {
      await cmd.exec('npm install --progress=false', this.path.front);
    }

    await config.generateEnvLocal(this);
    await cmd.exec(`npm run build -- --mode=${this.name}`, this.path.front);

    if (fs.existsSync(path.join(this.path.front, 'dist'))) {
      if (fs.existsSync(this.frontPath)) {
        fs.rmSync(this.frontPath, { recursive: true, force: true });
      }
      await copyFiles(path.join(this.path.front, 'dist'), this.frontPath);
      await config.generateEnvJson(this, this.frontPath);
    } else {
      throw new Error(`Не найден dist каталог`);
    }
  }

  async appStart(appName: string) {
    await this.webServer.startItem(appName);
  }

  async appReStart(appName?: string) {
    if (appName) {
      await this.webServer.restartItem(appName);
    } else {
      if (this.apps?.length) {
        for (const app of this.apps) {
          if (app.active) {
            await this.webServer.restartItem(app.name);
          }
        }
      }
    }
  }

  async appStop(appName: string) {
    await this.webServer.stopItem(appName);
  }

  async gitPull() {
    if (!this.path.git) {
      throw new Error(`Не задан каталог git`);
    }

    const promises = [];  
    promises.push(cmd.exec('git pull', this.path.git));
    // если фронт лежит не в папке проекта, обновим гит отдельно
    if (this.path.front && path.resolve(path.dirname(this.path.front)) !== path.resolve(this.path.git)) {
      promises.push(cmd.exec('git pull', this.path.front));
    }

    await Promise.all(promises);
  }

  async openWorkspace() {
    if (!fs.existsSync(this.wsPath)) {
      await config.generateWorkspaceFile(this, this.wsPath, this.verPath);
    }

    cmd.exec(`code ${this.wsPath}`);
  }
}