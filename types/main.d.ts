type AnyException = any;

type StackBackendType = 0 | 1;

type Settings = {
  [index: string]: string | number;
  tasks?: Task[]
}

type Task = {
  /** long title task */
  title: string;
  /** short name a task, e.g. 'ul' */
  prefix: string;
  /** task numeric code */
  id: number;
  /** if is true, this task add for new project */
  selected: boolean;
  /** @deprecated */
  port: number | null;
}

type ProjectApp = {
  /** short name a task, e.g. 'ul' */
  name: string;
  /** task numeric code */
  id: number;
  /** url for dispatcher app */
  path: string;
  /** debug port */
  port: number | null;
  /** custom command line arguments */
  args: string;
  syncThreadCount?: number;
  asyncThreadCount?: number;
  asyncTaskCount?: number;
  /** status app in project. active or not */
  active: boolean;
}

type ProjectSQLSettings = {
  /**
   * sql server name or ip,
   * with port for psql servers, default port is 5432
   */
  server: string;
  /** base name */
  base: string;
  login: string;
  password: string;
}

type ProjectPaths = {
  /** path to version folder */
  version: string;
  /** path to bin folder, this is auto generated as project name */
  bin: string;
  /** path to project git repo, used for git update command */
  git: string;
  /** path to ini file, used to generated own ini file for current project */
  ini: string;
  /** path to folder with frontend */
  front: string;
}

type ProjectGateway = {
  /** auto generated name for gateway app */
  name: string;
  /** path to folder with gateway jar file and application.yml */
  path: string;
  /** listening gateway port */
  port: number;

}
type Project = {
  name: string;
  path: ProjectPaths;
  sql: ProjectSQLSettings;
  apps: ProjectApp[];
  /** port for express server to publish static front */
  port: number | null;
  type: StackBackendType;
  gateway?: ProjectGateway;
  /** max count auto restart apps in project */
  restartMaxCount: number;
}

type ProjectOptions = Partial<Project>;

type DispatcherItem = {
  Name: string;
  State: string;
  StackProgramDir: string;
  FunctionName: string;
  UrlPathPrefix: string;
  StackProgramParameters: string;
  [parameter: string]: string;
}


type MessageType = 'info' | 'error';
type Message = { type: MessageType; text: string; time: Date };

type ProjectCondition = {
  building?: boolean;
  pulling?: boolean;
  deploying?: boolean;
  restarting?: boolean;
}

type SelectableApp = ProjectApp & Task;