type AnyException = any;

interface Settings {
  [index: string]: string;
}

interface Task {
  title: string;
  prefix: string;
  id: number;
  selected: boolean;
  port: number | null;
}

interface App {
  name: string;
  id: number;
  path: string;
  port: number | null;
  status?: number;
}

interface Project {
  name: string;
  path: {
    version: string;
    bin: string;
    git: string;
    ini: string;
    front: string;
  };
  sql: {
    server: string;
    base: string;
    login: string;
    password: string;
  };
  apps: App[];
}

interface DispatcherItem {
  Name: string;
  State: string;
  StackProgramDir: string;
  FunctionName: string;
  UrlPathPrefix: string;
  StackProgramParameters: string;
  [parameter: string]: string | number;
}
