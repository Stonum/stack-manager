import path from 'path';
import fs from 'fs';
import ini from 'ini';
import fsp from 'fs/promises';

export function readIniFile(filePath: string) {
  let strData = fs.readFileSync(filePath, 'utf8');
  // костыль с обработкой массивов
  strData = strData.replaceAll('PRG=', 'PRG[]=').replaceAll('DB=', 'DB[]=').replaceAll('RS=', 'RS[]=').replaceAll('RPT=', 'RPT[]=');
  let data = ini.parse(strData);

  if (data.Include) {
    const dataInc = readIniFile(path.join(path.dirname(filePath), data.Include));
    data = Object.assign({}, data, dataInc);
  }
  for (const key of Object.keys(data)) {
    if (data[key].Include) {
      const dataInc = readIniFile(path.join(path.dirname(filePath), data[key].Include));
      data = Object.assign({}, data, dataInc);
    }
  }
  return data;
}

export function writeIniFile(filePath: string, data: any) {
  let strData = ini.stringify(data);
  // костыль с обработкой массивов
  strData = strData.replaceAll('PRG[]=', 'PRG=').replaceAll('DB[]=', 'DB=').replaceAll('RS[]=', 'RS=').replaceAll('RPT[]=', 'RPT=');
  // костыль с кавычками в путях
  strData = strData.replaceAll('"', '');
  // костыль с двойными слэшами в путях
  strData = strData.replaceAll('\\\\', '\\');
  fs.writeFileSync(filePath, strData);
}

export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? await getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

export async function copyFiles(src: string, desc: string) {
  const files = await getFiles(src);
  return Promise.all(
    files.map((file) => {
      const folder = path.dirname(file.replace(src, desc));
      const fname = path.basename(file);
      if (!fs.existsSync(path.join(folder, fname))) {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        return fsp.copyFile(file, path.join(folder, fname));
      }
    })
  );
}
