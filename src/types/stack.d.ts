type AnyException = any;

interface Task {
  title: string;
  prefix: string;
  id: number;
  selected: boolean;
  port: number | null;
}

interface Project {
  name: String;
  path: {
    version: string;
    bin: string;
    git: string;
  };
  sql: {
    server: string;
    base: string;
    login: string;
    password: string;
  };
  tasks: Task[];
}
