type AnyException = any;

type StackBackendType = 0 | 1;

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
  syncThreadCount?: number;
  asyncThreadCount?: number;
  asyncTaskCount?: number;
  active: boolean;
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

interface ProjectGateway {
  name: string;
  path: string;
  port: number;
}
interface Project {
  name: string;
  path: ProjectPaths;
  sql: ProjectSQLSettings;
  apps: ProjectApp[];
  port: number | null;
  type: StackBackendType;
  gateway?: ProjectGateway;
}

interface DispatcherItem {
  Name: string;
  State: string;
  StackProgramDir: string;
  FunctionName: string;
  UrlPathPrefix: string;
  StackProgramParameters: string;
  [parameter: string]: string;
}

type Message = { type: string; text: string; time: Date };

interface ProjectCondition {
  building?: boolean;
  pulling?: boolean;
  deploying?: boolean;
  restarting?: boolean;
}
