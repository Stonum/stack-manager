import Axios from 'axios';
import log from '../log';

const axios = Axios.create({
  method: 'post',
});

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

  public webServer() {
    return new WebServer(this);
  }

  private async authenticate() {
    const response = await this._sendRequest({ secret: this.secret });
    this.token = response['S-Session-Token'] || null;
    return this.token !== null;
  }

  public async sendRequest(request: object): Promise<any> {
    if (this.token === null) {
      await this.authenticate();
      return this._sendRequest(request);
    }
    try {
      return this._sendRequest(request);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await this.authenticate();
        return this._sendRequest(request);
      }
    }
  }

  // Посылаем запрос на бекенд и сразу парсим результат
  private async _sendRequest(request: object): Promise<any> {
    const URL = this.url.toString();
    const headers = {} as any;
    const token = this.token;
    if (token) {
      headers['s-session-token'] = token;
    }
    const timeout = 60000;
    // log.debug('dispatcher', 'req', JSON.stringify(request));
    const result = await axios
      .post(URL, request, { headers, timeout })
      .then((response: any) => {
        // log.debug('dispatcher', 'res', JSON.stringify(response.data));
        return response.data;
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 401) {
          return Promise.reject(error);
        }
      });

    if (result) {
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
    if (!names) {
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
      params: [1],
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

class WebServer {
  private api: DispatcherAPI;

  constructor(dispatcher: Dispatcher) {
    this.api = new DispatcherAPI(dispatcher, 'WebServer');
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
    this.stopItem(name);
    return await this.api.Delete(name);
  }

  async setParameters(name: string, params: any): Promise<boolean> {
    return await this.api.Save(name, params);
  }

  async stopItem(name: string): Promise<boolean> {
    await this.setParameters(name, { IsActive: 0 });
    return await this.api.executeMethod(name, 'Stop');
  }

  async restartItem(name: string): Promise<boolean> {
    await this.setParameters(name, { IsActive: 1 });
    return await this.api.executeMethod(name, 'ReStart');
  }
}
