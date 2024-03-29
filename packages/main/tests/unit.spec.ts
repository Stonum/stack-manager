import type { MockedClass, MockedObject } from 'vitest';
import {beforeEach, expect, test, vi} from 'vitest';
import {restoreOrCreateWindow} from '../src/mainWindow';

import { BrowserWindow, App } from 'electron';

/**
 * Mock real electron BrowserWindow API
 */
vi.mock('electron', () => {

  // Use "as unknown as" because vi.fn() does not have static methods
  const bw = vi.fn() as unknown as MockedClass<typeof BrowserWindow>;
  bw.getAllWindows = vi.fn(() => bw.mock.instances);
  bw.prototype.loadURL = vi.fn();
  // Use "any" because the on function is overloaded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bw.prototype.on = vi.fn<any>();
  bw.prototype.destroy = vi.fn();
  bw.prototype.isDestroyed = vi.fn();
  bw.prototype.isMinimized = vi.fn();
  bw.prototype.focus = vi.fn();
  bw.prototype.restore = vi.fn();

  const eapp = vi.fn() as unknown as MockedObject<App>;
  eapp.getName = vi.fn();
  eapp.getVersion = vi.fn();

  return { BrowserWindow: bw, app: eapp };
});

vi.mock('electron-window-state', () => {
  return {
    __esModule: true,
    default: vi.fn().mockImplementation(() => {
      return {
        x: 0, y: 0, width: 800, height: 600,
        manage: vi.fn()
      };
    }),
  };
});


beforeEach(() => {
  vi.clearAllMocks();
});


test('Should create a new window', async () => {
  const {mock} = vi.mocked(BrowserWindow);
  expect(mock.instances).toHaveLength(0);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  expect(mock.instances[0].loadURL).toHaveBeenCalledOnce();
  expect(mock.instances[0].loadURL).toHaveBeenCalledWith(expect.stringMatching(/index\.html$/));
});


test('Should restore an existing window', async () => {
  const {mock} = vi.mocked(BrowserWindow);

  // Create a window and minimize it.
  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  const appWindow = vi.mocked(mock.instances[0]);
  appWindow.isMinimized.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  expect(appWindow.restore).toHaveBeenCalledOnce();
});


test('Should create a new window if the previous one was destroyed', async () => {
  const {mock} = vi.mocked(BrowserWindow);

  // Create a window and destroy it.
  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(1);
  const appWindow = vi.mocked(mock.instances[0]);
  appWindow.isDestroyed.mockReturnValueOnce(true);

  await restoreOrCreateWindow();
  expect(mock.instances).toHaveLength(2);
});
