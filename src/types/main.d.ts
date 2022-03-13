type AnyException = any;

interface Settings {
  [index: string]: string | number;
}

interface Task {
  title: string;
  prefix: string;
  id: number;
  selected: boolean;
  port: number | null;
}

interface ProjectApp {
  name: string;
  id: number;
  path: string;
  port: number | null;
  args: string;
}

interface ProjectSQLSettings {
  server: string;
  base: string;
  login: string;
  password: string;
}

interface ProjectPaths {
  version: string;
  bin: string;
  git: string;
  ini: string;
  front: string;
}
interface Project {
  name: string;
  path: ProjectPaths;
  sql: ProjectSQLSettings;
  apps: ProjectApp[];
  port: number | null;
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
