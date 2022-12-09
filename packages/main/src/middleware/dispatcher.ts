import Axios from 'axios';
import log from '../log';
import os from 'os';

const axios = Axios.create({
  method: 'post',
});

const isDevelopment = import.meta.env.DEV;

export default class Dispatcher {
  static token = null as string | null;

  private url: URL;
  private secret: string;
  private token: string | null;

  constructor(url: string, secret: string) {
    if (!url) {
      throw new Error('Не указан адрес диспетчера');
    }
    if (!secret) {
      throw new Error('Не указан пароль для диспетчера');
    }

    if (url.indexOf('://') < 0) {
      url = 'http://' + url;
    }

    url = url.replace('localhost', os.hostname()).replace('127.0.0.1', os.hostname());

    this.url = new URL(url);
    if (this.url.pathname === '/') {
      this.url.pathname = '/SetupDispatcher';
    }

    this.secret = secret;
    this.token = Dispatcher.token;
  }

  get isAuth() {
    return this.token !== null;
  }

  public webServer() {
    return new ServerAPI(this, 'WebServer');
  }

  public appServer() {
    return new ServerAPI(this, 'ProgramSpys');
  }

  public eventServer() {
    return new EventsAPI(this);
  }

  private async authenticate() {
    this.token = null;
    const response = await this._sendRequest({ secret: this.secret });
    this.token = response['S-Session-Token'] || null;
    Dispatcher.token = this.token;
    if (this.token === null) {
      throw { message: 'Не удалось авторизоваться в службе диспетчера', code: 500 };
    } else {
      return true;
    }
  }

  public async sendRequest(request: object): Promise<any> {
    try {
      if (this.token === null) {
        await this.authenticate();
        return this._sendRequest(request);
      }
      return await this._sendRequest(request);
    } catch (error: any) {
      if (error.code === 401) {
        await this.authenticate();
        return await this._sendRequest(request);
      } else {
        throw new Error(`Dispatcher error: ${error.message}, code: ${error.code}`);
      }
    }
  }

  // Посылаем запрос на бекенд и сразу парсим результат
  private async _sendRequest(request: object): Promise<any> {
    const URL = this.url.href;
    const headers = {} as any;
    const token = this.token;
    if (token) {
      headers['s-session-token'] = token;
    }
    const timeout = 60000;
    if (!isDevelopment) {
      log.debug('dispatcher', 'req', JSON.stringify(request).substring(0, 100));
    }
    const result = await axios
      .post(URL, request, { headers, timeout })
      .then((response: any) => {
        if (!isDevelopment) {
          log.debug('dispatcher', 'res', JSON.stringify(response.data).substring(0, 100));
        }
        return response.data;
      })
      .catch((error: any) => {
        if (!isDevelopment) {
          log.error('dispatcher', 'err', JSON.stringify(error).substring(0, 100));
        }
        if (error.response?.data) {
          return error.response.data;
        } else {
          throw error;
        }
      });

    if (result) {
      if (result.error) {
        throw result.error;
      }
      return result;
    }
    return '';
  }
}

class DispatcherAPI {
  private type: string;
  private dispatcher: Dispatcher;

  constructor(dispather: Dispatcher, type: string) {
    this.dispatcher = dispather;
    this.type = type;
  }

  get isAuth() {
    return this.dispatcher.isAuth;
  }

  public async Add(name: string): Promise<boolean> {
    try {
      const request = [{ [this.type]: [{ params: [name], type: 'method', Add: [] }] }];
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async Delete(name: string): Promise<boolean> {
    try {
      const request = [{ [this.type]: [this.setMethod(name as string, 'Delete')] }];
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async Save(name: string, params?: any): Promise<boolean> {
    try {
      const arrParameters = [];
      for (const property in params) {
        if (property !== 'Name' && property !== 'State') {
          const res = this.setParameter(property, params[property] as string);
          arrParameters.push(res);
        }
      }
      const request = [{ [this.type]: [{ params: [name], type: 'method', Item: arrParameters }] }];
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async getMainProperties(): Promise<{}> {
    // Запрашиваем список св-в
    const namesProp = await this.getParameterNamesList();
    if (!namesProp) {
      return [];
    }
    // Запрашиваем значения параметров
    const selection = await this.getParameterValue(namesProp);
    return selection;
  }

  public async saveMainProperties(record: {}): Promise<boolean> {
    try {
      const arrParameters = [];
      for (const property in record) {
        // @ts-ignore
        const res = this.setParameter(property, record[property] as string);
        arrParameters.push(res);
      }

      const request = [{ [this.type]: arrParameters }];
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async getRecords(name?: string): Promise<DispatcherItem[]> {
    // Запрашиваем данные об именах диспетчеров или веб-сервисов
    const res = await this.getNameList();
    const names = name === undefined ? res : res.filter((item: string) => item === name);
    if (!names.length) {
      return [];
    }

    // Запрашиваем имена параметров, доступных для указанного типа
    const parameters = await this.getParametersList(names);
    // Запрашиваем значения параметров
    return await this.getSelections(names, parameters);
  }

  public async executeMethod(name: string, method: string): Promise<boolean> {
    try {
      const request = this.setMethodsRequest(name, method);
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async executeDispMethod(method: string): Promise<boolean> {
    try {
      const request = [{ [this.type]: [{ type: 'method', [method]: [] }] }];
      await this.dispatcher.sendRequest(request);
      return true;
    } catch (error: AnyException) {
      return false;
    }
  }

  public async getResultExecuteDispMethod(method: string): Promise<string> {
    try {
      const request = [{ [this.type]: [{ type: 'method', [method]: [] }] }];
      const result = await this.dispatcher.sendRequest(request);
      if (result) {
        return result[0][this.type][0][method].result;
      }
      return '';
    } catch (error: AnyException) {
      return 'Не удалось выполнить метод';
    }
  }

  public setMethodsRequest(name: string, action: string) {
    const arrServices = [];
    arrServices.push(this.setMethod(name, action));
    const request = [{ [this.type]: arrServices }];
    return request;
  }

  // передает объекту метод на выполнение
  public setMethod(title: string, method: string, params?: any) {
    if (params) {
      return { params: [title], type: 'method', Item: [{ params, type: 'method', [method]: [] }] };
    } else {
      return { params: [title], type: 'method', Item: [{ type: 'method', [method]: [] }] };
    }
  }

  // создает объект для присвоения значения параметру
  public setParameter(name: string, value: string) {
    return { params: [name], type: 'property', Parameter: [{ params: [value], SetValue: [] }] };
  }

  // Список с-в, корневого элемента , например WebServer
  public async getParameterNamesList(): Promise<string[]> {
    const request = [];
    request.push({ [this.type]: this.getParameterNamesRequest() });
    const result = (await this.dispatcher.sendRequest(request))[0];
    if (result && result[this.type] && result[this.type][0]) {
      return JSON.parse(result[this.type][0].ParameterNames.result);
    }
    return [];
  }

  public async getNameList(): Promise<string[]> {
    const request = [];
    request.push({ [this.type]: this.getNamesRequest() });
    const result = (await this.dispatcher.sendRequest(request))[0];
    if (result && result[this.type] && result[this.type][0]) {
      return JSON.parse(result[this.type][0].Names.result) || [];
    }
    return [];
  }

  public async getParametersList(names: string[]) {
    const request = [];
    request.push({ [this.type]: this.getParametersRequest(names) });
    const result = (await this.dispatcher.sendRequest(request))[0];
    if (result && result[this.type] && result[this.type][0] && result[this.type][0].Item && result[this.type][0].Item[0]) {
      return JSON.parse(result[this.type][0].Item[0].ParameterNames.result);
    }
    return '';
  }

  protected async getParameterValue(paramNames: object) {
    const resObj = { [this.type]: [] as object[] };
    resObj[this.type] = this.getMainServiceParameters(paramNames);
    const result = this.parseMainServiceParameters((await this.dispatcher.sendRequest([resObj]))[0][this.type]);
    return result;
  }

  public async getSelections(serviceNames: any, paramNames: object) {
    const resObj = { [this.type]: [] as object[] };
    serviceNames.forEach((serviceName: string) => {
      if (serviceName !== 'SetupDispatcher') {
        resObj[this.type].push(this.getServiceParameters(serviceName, paramNames));
      }
    });
    const result = this.parseResult((await this.dispatcher.sendRequest([resObj]))[0][this.type]);
    return result;
  }

  public parseResult(res: any) {
    const result = [] as any[];
    res.forEach((service: object) => {
      result.push(Object.assign({}, this.parseServiceParameters(service)));
    });
    return result;
  }

  // парсим блок с диспетчером или вебсервером, преобразуем его в объект { title: название, [параметр: значение] }
  public parseServiceParameters(service: any) {
    let res = { Name: '' };
    if (service && service.params && service.params[0]) {
      res.Name = service.params[0];
    }
    if (service && service.Item) {
      service.Item.forEach((parameter: object) => {
        res = Object.assign(res, {}, this.parseParameter(parameter));
      });
    }
    return res;
  }

  public parseMainServiceParameters(parameters: any) {
    let res = {};
    parameters.forEach((parameter: object) => {
      res = Object.assign(res, {}, this.parseParameter(parameter));
    });
    return res;
  }

  // парсим блок со значеним параметра и возвращаем его в виде { параметр: значение }
  public parseParameter(parameter: any) {
    let name = '';
    let value = '';
    if (parameter && parameter.params && parameter.params[0]) {
      name = parameter.params[0];
    }
    if (parameter && parameter.Parameter && parameter.Parameter[0] && parameter.Parameter[0].Value && parameter.Parameter[0].Value.result) {
      value = parameter.Parameter[0].Value.result;
    }
    // проверка на состояния проводится отдельно
    if (parameter && parameter.State && parameter.State.result) {
      name = 'State';
      value = parameter.State.result;
    }
    return { [name]: value };
  }

  // блок запроса значения параметров по одному вебсерверу или диспетчеру
  public getMainServiceParameters(paramNames: any) {
    const res = [] as object[];
    paramNames.forEach((paramName: string) => {
      res.push(this.getParamValue(paramName));
    });
    return res;
  }

  // блок запроса значения параметров по одному вебсерверу или диспетчеру
  public getServiceParameters(serviceName: string, paramNames: any) {
    const res = { params: [] as string[], Item: [] as object[] };
    res.params.push(serviceName);
    paramNames.forEach((paramName: string) => {
      res.Item.push(this.getParamValue(paramName));
    });
    // проверка на состояния проводится отдельно
    res.Item.push({ State: [] });
    return res;
  }

  // блок запроса значения параметра
  public getParamValue(name: string) {
    const res = { params: [] as string[], type: 'property', Parameter: [{ Value: [] }] };
    res.params.push(name);
    return res;
  }

  // блок запроса свойств диспетчера или вебсервера
  public getParametersRequest(names: string[]) {
    const res = [];
    res.push({
      params: [names?.length - 1 || 0],
      Item: [
        {
          ParameterNames: [],
        },
      ],
    });
    return res;
  }

  // Формирует блок для запроса имени вебсерверов, диспетчеров, все что имеет атрибут "имя"
  public getNamesRequest() {
    const res = [];
    res.push(this.getMethod('Names'));
    return res;
  }

  public getParameterNamesRequest() {
    const res = [];
    res.push(this.getMethod('ParameterNames'));
    return res;
  }

  public getMethod(name: string, param?: string) {
    let res = {};
    if (param) {
      res = Object.assign(res, {}, { params: [param], [name]: [] });
      return res;
    } else {
      return { [name]: [] };
    }
  }
}

export interface IServerAPI {
  get isAuth(): boolean;
  getItems(): Promise<DispatcherItem[]>;
  getItem(name: string): Promise<DispatcherItem>;
  addItem(name: string, params?: any): Promise<boolean>;
  deleteItem(name: string): Promise<boolean>;
  setParameters(name: string, params: any): Promise<boolean>;
  stopItem(name: string): Promise<boolean>;
  startItem(name: string): Promise<boolean>;
  restartItem(name: string): Promise<boolean>;
}
class ServerAPI implements IServerAPI {
  private api: DispatcherAPI;
  private type: string;

  constructor(dispatcher: Dispatcher, type: string) {
    this.type = type;
    this.api = new DispatcherAPI(dispatcher, type);
  }

  get isAuth() {
    return this.api.isAuth;
  }

  async getItems(): Promise<DispatcherItem[]> {
    const res = await this.api.getRecords();
    return res;
  }

  async getItem(name: string): Promise<DispatcherItem> {
    const res = await this.api.getRecords(name);
    return res && res[0];
  }

  async addItem(name: string, params?: any): Promise<boolean> {
    const res = await this.api.Add(name);
    if (res && params) {
      return await this.api.Save(name, params);
    }
    return res;
  }

  async deleteItem(name: string): Promise<boolean> {
    await this.stopItem(name);
    return await this.api.Delete(name);
  }

  async setParameters(name: string, params: any): Promise<boolean> {
    return await this.api.Save(name, params);
  }

  async stopItem(name: string): Promise<boolean> {
    await this.setParameters(name, { IsActive: 0 });
    return this.api.executeMethod(name, 'Stop');
  }

  async startItem(name: string): Promise<boolean> {
    await this.setParameters(name, { IsActive: 1 });
    return this.api.executeMethod(name, this.type === 'WebServer' ? 'ReStart' : 'Start');
  }

  async restartItem(name: string): Promise<boolean> {
    await this.api.executeMethod(name, 'Stop');
    return this.api.executeMethod(name, this.type === 'WebServer' ? 'ReStart' : 'Start');
  }
}

class EventsAPI {
  private dispatcher: Dispatcher;
  private type: string;

  constructor(dispatcher: Dispatcher) {
    this.dispatcher = dispatcher;
    this.type = 'EventList';
  }

  async getItems(): Promise<DispatcherItem[]> {
    const res = await this.getRecords();
    return res;
  }

  public async getRecords(): Promise<DispatcherItem[]> {
    const count = await this.getCount();
    const selection = await this.getSelections(count);
    return selection;
  }

  public async getCount() {
    const request = [];
    request.push({ [this.type]: this.getCountRequest() });

    const result = (await this.dispatcher.sendRequest(request))[0];
    if (result && result[this.type] && result[this.type][0]) {
      return JSON.parse(result[this.type][0].Count.result);
    }
    return 0;
  }

  public getCountRequest() {
    const res = [];
    res.push({ Count: [] });
    return res;
  }

  public async getSelections(count: number) {
    let index = 0;
    const end = Math.min(count, 1000);

    const resObj = { [this.type]: [] as object[] };
    for (index; index < end; index++) {
      const res = this.getEvent(index);
      resObj[this.type].push(res);
    }
    const result = this.parseResult((await this.dispatcher.sendRequest([resObj]))[0][this.type]);

    return result;
  }

  public getEvent(idx: number) {
    let res = { type: 'property' };
    res = Object.assign({ params: [idx] }, res, {});
    res = Object.assign(res, {}, this.getMethod('EventMessage'));
    res = Object.assign(res, {}, this.getMethod('EventCode'));
    res = Object.assign(res, {}, this.getMethod('EventType'));
    res = Object.assign(res, {}, this.getMethod('EventDateTime'));

    return res;
  }

  public getMethod(name: string, param?: string) {
    let res = {};
    if (param) {
      res = Object.assign(res, {}, { params: [param], [name]: [] });
      return res;
    } else {
      return { [name]: [] };
    }
  }

  public parseResult(res: any) {
    const result: any[] = [];
    let index = 0;
    res.forEach((service: object) => {
      result.push(Object.assign({ $номерЗаписи: ++index }, {}, this.parseEventsMethods(service)));
    });
    return result;
  }

  public parseEventsMethods(service: any) {
    let res = {};
    if (service) {
      for (const property in service) {
        if (service[property] && service[property].result) {
          res = Object.assign(res, {}, { [property]: service[property].result });
        }
      }
    }
    return res;
  }
}
