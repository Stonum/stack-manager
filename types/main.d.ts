type AnyException = any;

type StackBackendType = 0 | 1;

type Settings = {
  [index: string]: string | number;
  tasks?: Task[]
}

type Task = {
  title: string;
  prefix: string;
  id: number;
  selected: boolean;
  port: number | null;
}

type ProjectApp = {
  name: string;
  id: number;
  path: string;
  port: number | null;
  args: string;
  syncThreadCount?: number;
  asyncThreadCount?: number;
  asyncTaskCount?: number;
  active: boolean;
}

type ProjectSQLSettings = {
  server: string;
  base: string;
  login: string;
  password: string;
  port?: number;
}

type ProjectPaths = {
  version: string;
  bin: string;
  git: string;
  ini: string;
  front: string;
}

type ProjectGateway = {
  name: string;
  path: string;
  port: number;

}
type Project = {
  name: string;
  path: ProjectPaths;
  sql: ProjectSQLSettings;
  apps: ProjectApp[];
  port: number | null;
  type: StackBackendType;
  gateway?: ProjectGateway;
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