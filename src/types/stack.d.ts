type AnyException = any;

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
