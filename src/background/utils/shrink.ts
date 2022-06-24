import { dirname } from 'path';

export function shrinkListFolders(arrFolders: string[]): string[] {
  console.log(arrFolders);

  const setFolders = new Set() as Set<string>;
  const arrSort = arrFolders.sort((a: string, b: string) => a.localeCompare(b)).reverse();

  for (const f of arrSort) {
    const dir = dirname(f);

    // количество элементов в которых имеется указанный родительский каталог
    const len_folders1 = arrSort.filter((el) => `${el}\\`.startsWith(`${dir}\\`)).length;
    // каталоги которые входят в родительский каталог
    const len_folders2 = arrSort.filter((el) => `${dir}\\`.startsWith(`${el}\\`)).length;
    // если количество записей с совпадающим путем === 1 то вносим ее а не каталог, чтобы не уйти до корня диска
    const len_folders3 = arrSort.filter((el) => `${el}\\`.startsWith(`${f}\\`)).length;

    if ((len_folders1 > 1 || len_folders2 > 1) && len_folders1 !== arrSort.length && len_folders3 === 1) {
      setFolders.add(dir);
    } else {
      setFolders.add(f);
    }
  }

  if (arrFolders.length > setFolders.size) {
    return shrinkListFolders([...setFolders]);
  }

  return [...setFolders].reverse();
}
