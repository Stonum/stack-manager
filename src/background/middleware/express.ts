import express from 'express';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import log from '../log';

import { settings } from '../store';

export default class StaticServer {
  private server = null as any;

  constructor(name: string, port: number) {
    const server = express();
    const staticPath = path.join(settings.get('staticPath'), name);

    if (fs.existsSync(staticPath)) {
      server.use(express.static(staticPath));

      // проброс путей для позадачных каталогов
      const dirs = fs.readdirSync(staticPath, { withFileTypes: true });
      for (const dir of dirs) {
        if (dir.isDirectory()) {
          server.use(`/${dir.name}/*`, express.static(path.join(staticPath, dir.name)));
        }
      }
    } else {
      server.get('/', (req, res) => {
        res.send(`
          <h1>Ошибка публикации</h1>
          <p>
              Отсутствуют данные в каталоге ${staticPath}</br>
              Выполните пункт меню "Собрать фронт" проекта "${name}"
          </p>
        `);
      });
    }

    log.debug(`Server ${name} is starting...`);

    this.server = server.listen(port, () => {
      log.debug(`Server ${name} started on http://localhost:${port}`);
    });
  }

  get started() {
    return !!this.server;
  }

  close() {
    if (this.server) {
      this.server.close();
    }
  }
}
