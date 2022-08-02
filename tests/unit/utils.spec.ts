import * as utils from '@/background/utils';

describe('test utils', () => {
  it('parse args from command line', () => {
    const strArgs = ' -p=123 -u:SA --loadres --inspect 123';
    const objArgs = {
      p: '123',
      u: 'SA',
      loadres: true,
      inspect: '123',
    };
    expect(utils.parseArgs(strArgs)).toMatchObject(objArgs);
  });
});
