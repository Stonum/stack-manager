import { expect, describe, it, vi } from 'vitest';
import fs from 'fs';

import * as helper from '../projectHelpers';

vi.mock('fs');

describe('ProjectHelpers', () => {

  it('type stack should be 0', () => {
    expect(helper.StackBackendType.stack).toBe(0);
  });

  it('type apphost should be 1', () => {
    expect(helper.StackBackendType.apphost).toBe(1);
  });

  it('correct find version folder', () => {
    const verPath = 'root\\22.22_22221111\\folder';
    const math = verPath.match(helper.verpattern);
    expect(math).not.toBeNull();
    expect(math && math[1]).toBe('\\22.22_22221111\\');
  });

  it('correct gateway filename', () => {

    // @ts-ignore-next-line
    fs.readdirSync.mockReturnValue(
      [
        { name: 'stackgateway-1.0.3.jar', isFile: vi.fn().mockReturnValue(false) },
        { name: 'stackgateway-1.0.1.jar', isFile: vi.fn().mockReturnValue(true) },
        { name: 'stackgateway-1.0.2.jar', isFile: vi.fn().mockReturnValue(true) },
        { name: 'stackgateway-1.0.4', isFile: vi.fn().mockReturnValue(true) },
      ]
    );

    expect(helper.getGatewayFileName('')).toBe('stackgateway-1.0.2.jar');
  });
});