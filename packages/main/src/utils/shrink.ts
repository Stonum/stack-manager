import { dirname } from 'path';

export function shrinkListFolders(arrFolders: string[]): string[] {
  const setFolders = new Set() as Set<string>;

  // сначала соберем уникальные каталоги и подкаталоги в Set
  for (const f of arrFolders) {
    let dir = f;
    while (dir !== dirname(dir)) {
      setFolders.add(dir);
      dir = dirname(dir);
    }
  }

  // получим массив объектов, с путем и количеством вхождений этого пути в массив
  const folders = [...setFolders]
    .map((val, idx, arr) => {
      return {
        path: val,
        count: arr.filter((v) => v.startsWith(val)).length,
      };
    })
    .sort((a, b) => b.count - a.count);
  // отсортируем его по убыванию количества вхождений пути

  // в результат положим уникальные каталоги
  const result = [];
  for (let i = 0; i + 1 < folders.length; i++) {
    // если уже добавлен в результат подкаталог который входит в текущий, то пропускаем
    const includes = result.filter((f: string) => `${folders[i].path}\\`.startsWith(`${f}\\`));

    if (includes.length > 0) {
      continue;
    }

    // если следующий элемент вообще из другого подкаталога то добавляем текущий
    if (folders[i + 1].path.startsWith(folders[i].path)) {
      // если следующий элемент встречается меньше раз чем наш текущий, то добавляем текущий
      if (folders[i].count > folders[i].count + 1) {
        result.push(folders[i].path);
      }
    } else {
      result.push(folders[i].path);
    }
  }

  return result.sort((a: string, b: string) => a.localeCompare(b));
}
