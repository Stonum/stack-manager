import http from 'http';

export default class Dispatcher {
  private url: URL;
  private secret: string;
  private token: string | null;

  constructor(url: string, secret: string) {
    if (url.indexOf('://') < 0) {
      url = 'http://' + url;
    }

    this.url = new URL(url);
    if (this.url.pathname === '/') {
      this.url.pathname = '/SetupDispatcher';
    }

    this.secret = secret;
    this.token = null;
  }

  get webServer() {
    return new WebServer(this);
  }

  get appLauncher() {
    return new AppLauncher(this);
  }

  async send(body: any): Promise<any> {
    if (this.token === null) {
      await this.authenticate(this.secret);
      return this._send(body);
    }
    return this._send(body);
  }

  async authenticate(secret: string) {
    const response = await this._send({ secret });
    this.token = response['S-Session-Token'] || null;
    console.log(this.token);
    return this.token !== null;
  }

  _send(body: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(body);
      console.log('_send', json);
      const data = Buffer.from(json, 'utf-8');
      // @ts-ignore
      const request = http
        .request(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': data.byteLength,
            's-session-token': this.token,
          },
        })
        .end(data);
      // @ts-ignore
      request.on('response', (response: any) => {
        let data = '';
        response.on('data', (chunk: any) => {
          data += chunk;
        });
        response.on('end', () => {
          try {
            const resp = JSON.parse(data);
            if (resp.error) {
              reject(resp.error);
            }
            resolve(resp);
          } catch (err) {
            reject(err);
          }
        });
      });
      // @ts-ignore
      request.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}

class DispatcherElement {
  public connection: Dispatcher;

  constructor(connection: Dispatcher) {
    this.connection = connection;
  }

  async _call(buildQuery: Function) {
    const b = new QueryBuilder();
    buildQuery(this._initBuilder(b));
    return this.connection.send(b.root);
  }

  _initBuilder(builder: QueryBuilder) {
    return builder;
  }
}

class DispatcherContainer extends DispatcherElement {
  constructor(connection: Dispatcher) {
    super(connection);
  }

  async add(name: string) {
    await this._call((b: QueryBuilder) => b.method('Add', name));
    return this.item(name);
  }

  item(name: string) {
    return this._createItem(name);
  }

  async restartItems(...names) {
    return this._call((b: QueryBuilder) => {
      for (const name of names) {
        b.method('Item', name).method('Restart');
      }
    });
  }

  async stopItems(...names) {
    return this._call((b) => {
      for (const name of names) {
        b.method('Item', name).method('Stop');
      }
    });
  }
}

class DispatcherContainerItem extends DispatcherElement {
  public container: DispatcherElement;
  private name: string;

  constructor(container: DispatcherElement, name: string) {
    super(container.connection);
    this.container = container;
    this.name = name;
  }

  _initBuilder(builder: QueryBuilder) {
    return this.container._initBuilder(builder).method('Item', this.name);
  }

  async setParams(params: any) {
    return this._call((b: QueryBuilder) => {
      for (const [key, value] of Object.entries(params)) {
        b.property('Parameter', key).method('SetValue', value);
      }
    });
  }

  async getState(param: string) {
    const res = await this._call((b: QueryBuilder) => {
      b.root.push({ State: [] });
    });
    // TODO - все бы это дело надо привести в нормальный вид
    return +res[0].WebServer[0].Item[0].State.result;
  }

  async restart() {
    return this._call((b: QueryBuilder) => b.method('Restart'));
  }

  async stop() {
    return this._call((b: QueryBuilder) => b.method('Stop'));
  }

  async delete() {
    return this._call((b: QueryBuilder) => b.method('Delete'));
  }
}

class WebServer extends DispatcherContainer {
  constructor(connection: Dispatcher) {
    super(connection);
  }

  _initBuilder(builder: QueryBuilder) {
    return builder.class('WebServer');
  }

  _createItem(name: string) {
    return new WebApp(this, name);
  }
}

class AppLauncher extends DispatcherContainer {
  constructor(connection: Dispatcher) {
    super(connection);
  }

  _initBuilder(builder: QueryBuilder) {
    return builder.class('ProgramSpys');
  }

  _createItem(name: string) {
    return new AutoApp(this, name);
  }

  async restartItems(...names: Array<string>) {
    return this._call((b: QueryBuilder) => {
      for (const name of names) {
        b.method('Item', name).method('Stop');
        b.method('Item', name).method('Start');
      }
    });
  }
}

class WebApp extends DispatcherContainerItem {
  constructor(container: Dispatcher, name: string) {
    super(container, name);
  }
}

class AutoApp extends DispatcherContainerItem {
  constructor(container: Dispatcher, name: string) {
    super(container, name);
  }

  async start() {
    return this._call((b: QueryBuilder) => b.method('Start'));
  }

  async restart() {
    await this.stop();
    return this.start();
  }
}

interface QueryBuilder {
  root: Array<any>;
}

class QueryBuilder {
  constructor(root?: Array<any>) {
    this.root = root || [];
  }

  clear() {
    this.root = [];
  }

  class(name: string) {
    const methods = [] as Array<any>;
    this.root.push({ [name]: methods });
    return new QueryBuilder(methods);
  }

  method(name: string, ...params: any) {
    return this._push('method', name, params);
  }

  property(name: string, ...params: any) {
    return this._push('property', name, params);
  }

  _push(type: string, name: string, params: any) {
    const methods = [] as Array<any>;
    this.root.push({ type, params, [name]: methods });
    return new QueryBuilder(methods);
  }
}
