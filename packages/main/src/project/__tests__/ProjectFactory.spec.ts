import { expect, describe, it, vi } from 'vitest';
import ProjectFactory from '../projectFactory';
import ProjectItem from '../projectItem';

const emptyProject = {
  id: 999999,
  name: '',
  port: 8001,
  type: 1,
  restartMaxCount: 5,
  path: {
    version: '',
    bin: '',
    git: '',
    ini: '',
    front: '',
  },
  sql: {
    server: '',
    base: '',
    login: '',
    password: '',
    pgbouncer: false,
  },
  gateway: {
    name: '_gateway',
    path: '',
    port: 8101,
  },
  apps: [] as any[]
};

vi.mock('electron', () => {
  return {
    app: {
      getPath: vi.fn().mockReturnValue(''),
      getVersion: vi.fn().mockReturnValue('0.0.0')
    }
  };
});

vi.mock('electron-store', () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => {
      return {
        get: vi.fn().mockReturnValue(''), set: vi.fn()
      };
    }),
  };
});

vi.mock('../../middleware/dispatcher.ts');

describe('ProjectFactory', () => {

  it('Init empty project', async () => {
    let project = await ProjectFactory.init({ type: 1 });
    expect(project.id).not.toBe(emptyProject.id);

    project.id = emptyProject.id;
    expect(project).toEqual(emptyProject);

    project = await ProjectFactory.init({ type: 0 });
    expect(project.gateway).toBeUndefined();

    project = await ProjectFactory.init({ name: 'test_project', type: 1 });
    expect(project.gateway).toEqual({ name: 'test_project_gateway', port: 8101, path: '' });
  });

  it('Create project item', async () => {
    const project = await ProjectFactory.create(emptyProject);
    expect(project).toBeInstanceOf(ProjectItem);
  });

  it('Normalize project item', async () => {
    const project = await ProjectFactory.create(emptyProject);
    expect(await ProjectFactory.extractObject(project)).toEqual(emptyProject);
  });

  it('Copy project item', async () => {
    const projectWithApp = { ...emptyProject };
    projectWithApp.apps = [{ id: 123, name: 'test', port: 3000, path: 'xxx', args: '', active: false }];

    const copy = await ProjectFactory.copy(projectWithApp);

    expect(copy.id).not.toBe(projectWithApp.id);

    expect(copy.name).toBe(projectWithApp.name + '_copy');
    expect(copy.type).toBe(projectWithApp.type);
    expect(copy.path.git).toBe(projectWithApp.path.git);

    expect(copy.apps.length).toBe(projectWithApp.apps.length);
  });
});