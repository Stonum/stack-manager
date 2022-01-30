export function parseArgs(argsString: string) {
  const args = argsString.split(' ');
  const tmp = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      const arg = args[i].replaceAll('-', '').replaceAll('"', '');
      const [key, value] = arg.indexOf(':') > 0 ? arg.split(':') : arg.split('=');
      if (value !== undefined) {
        tmp.push({ key, value });
      } else {
        tmp.push({ key, value: true });
      }
    } else {
      // значит это значение которое ввели через пробел
      if (tmp.length > 0) {
        // присвоим его значение предыдущему элементу
        if (tmp[tmp.length - 1].value === true) {
          tmp[tmp.length - 1].value = args[i];
        }
      }
    }
  }
  const res = {} as any;

  for (const item of tmp) {
    res[item.key] = item.value;
  }

  return res;
}
