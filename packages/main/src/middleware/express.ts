import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import path from 'path';
import fs from 'fs';
import log from '../log';

import { settings } from '../store';

export default class StaticServer {
  private name: string;
  private port: number;
  private app: Express;
  private isStarted = false;
  private server = null as Server | null;

  constructor(name: string, port: number) {
    this.name = name;
    this.port = port;

    this.app = express();
    const staticPath = path.join(settings.get('staticPath'), this.name);

    if (fs.existsSync(staticPath)) {
      this.app.use(express.static(staticPath));

      // проброс путей для позадачных каталогов
      const dirs = fs.readdirSync(staticPath, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory()) {
          this.app.use(`/${dir.name}/*`, express.static(path.join(staticPath, dir.name)));
        }
      }
    } else {
      this.app.get('/', (req: Request, res: Response) => {
        res.send(`
          <h1>Ошибка публикации</h1>
          <p>
              Отсутствуют данные в каталоге ${staticPath}</br>
              Выполните пункт меню "Собрать фронт" проекта "${name}"
          </p>
        `);
      });
    }
  }

  get started() {
    return this.isStarted;
  }

  listen() {
    log.debug(`Server ${this.name} is starting...`);
    try {
      this.server = this.app.listen(this.port, () => {
        log.debug(`Server ${this.name} started on http://localhost:${this.port}`);
      });
      this.isStarted = true;
    } catch (e: AnyException) {
      throw new Error('Express server error ' + e.message);
    }
  }

  close() {
    if (this.server && this.isStarted) {
      this.server.close();
      this.isStarted = false;
    }
  }
}
