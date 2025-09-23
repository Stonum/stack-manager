import sudo from 'sudo-prompt';
import child from 'child_process';

const options = {
  name: 'stackmanager',
  icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

const execSudo = function (cmd: string) {
  return new Promise((resolve, reject) => {
    sudo.exec(cmd, options, function (error, stdout) {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
};

const exec = function (cmd: string, path?: string, env: Object = {}) {
   return new Promise((resolve, reject) => {
      const options = { cwd: path || process.cwd(), env: { ...process.env, ...env } };
      child.exec(cmd, options, function (error, stdout) {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
};


export default { execSudo, exec };
