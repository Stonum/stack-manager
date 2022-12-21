import path from 'path';
import fs from 'fs';
import ini from 'ini';
import fsp from 'fs/promises';
import MarkdownIt from 'markdown-it';
import toml from 'toml-js';
import yaml from 'js-yaml';

export async function readSettingsFile(filePath: string) {
  const ext = path.extname(filePath)?.toLowerCase();

  switch (ext) {
    case '.ini':
      return await readIniFile(filePath);
    case '.toml':
      return await readTomlFile(filePath);
    case '.yml':
      return await readYamlFile(filePath);
    case '.json':
    case '.code-workspace':
      return await readJsonFile(filePath);
    default:
      throw new Error('unknown extension');
  }
}

export async function writeSettingsFile(filePath: string, data: any) {
  const ext = path.extname(filePath)?.toLowerCase();

  switch (ext) {
    case '.ini':
      return await writeIniFile(filePath, data);
    case '.toml':
      return await writeTomlFile(filePath, data);
    case '.yml':
      return await writeYamlFile(filePath, data);
    case '.json':
    case '.code-workspace':
      return await writeJsonFile(filePath, data);
    default:
      throw new Error('unknown extension');
  }
}

export async function readIniFile(filePath: string) {
  let strData = await fsp.readFile(filePath, 'utf8');
  // костыль с обработкой массивов
  strData = strData.replaceAll('PRG=', 'PRG[]=').replaceAll('DB=', 'DB[]=').replaceAll('RS=', 'RS[]=').replaceAll('RPT=', 'RPT[]=');
  let data = ini.parse(strData);

  if (data.Include) {
    const dataInc = await readIniFile(path.resolve(path.dirname(filePath), data.Include));
    data = Object.assign({}, data, dataInc);
  }
  for (const key of Object.keys(data)) {
    if (data[key].Include) {
      const dataInc = await readIniFile(path.resolve(path.dirname(filePath), data[key].Include));
      data = Object.assign({}, data, dataInc);
    }
  }
  return data;
}

export async function writeIniFile(filePath: string, data: any) {
  let strData = ini.stringify(data);
  // костыль с обработкой массивов
  strData = strData
    .replaceAll(/PRG\[\]=/g, 'PRG=')
    .replaceAll(/DB\[\]=/g, 'DB=')
    .replaceAll(/RS\[\]=/g, 'RS=')
    .replaceAll(/RPT\[\]=/g, 'RPT=');
  // костыль с кавычками в путях
  strData = strData.replaceAll('"', '');
  // костыль с двойными слэшами в путях
  strData = strData.replaceAll('\\\\', '\\');
  await fsp.writeFile(filePath, strData);
}

export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fsp.readdir(dir, { withFileTypes: true });
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
    files.map(async (file) => {
      const folder = path.dirname(file.replace(src, desc));
      const fname = path.basename(file);

      if (!fs.existsSync(folder)) {
        await fsp.mkdir(folder, { recursive: true });
      }
      return fsp.copyFile(file, path.join(folder, fname));
    })
  );
}

export async function readMarkdownFile(src: string) {
  const md = new MarkdownIt();
  let strData = await fsp.readFile(src, 'utf8');
  if (strData) {
    const regCommitLink = /\(\[\S*\)\)/;
    strData = strData.replaceAll(regCommitLink, '').trimEnd();
    const regLink = /\(http\S*\)/;
    strData = strData.replaceAll(regLink, '').trimEnd();
  }
  const result = md.render(strData);
  return result;
}

export async function readTomlFile(filePath: string) {
  let strData = await fsp.readFile(filePath, 'utf8');
  // уберем закомментированные строки ( я нуб, надо удалить пустые строки тоже... )
  strData = strData.replace(/#(.+)$/gm, 'x').replaceAll('x\\r\\n', '');
  return toml.parse(strData);
}

export async function writeTomlFile(filePath: string, data: any) {
  await fsp.writeFile(filePath, toml.dump(data));
}

export async function readYamlFile(filePath: string) {
  return yaml.loadAll(await fsp.readFile(filePath, 'utf8'));
}

export async function writeYamlFile(filePath: string, data: any) {
  const replacer = (key: string, value: any) => { return value ?? undefined; };
  let stringdata = '';
  for (const doc of data) {
    if (stringdata.length) {
      stringdata += '\n---\n';
    }
    stringdata += yaml.dump(doc, { replacer });
  }
  await fsp.writeFile(filePath, stringdata);
}

export async function readJsonFile(filePath: string) {
  try {
    return JSON.parse(await fsp.readFile(filePath, 'utf8'));
  } catch (e: AnyException) {
    throw new Error('Failed to parse JSON file - ' + filePath + '\n' + e.message);
  }
}

export async function writeJsonFile(filePath: string, data: any) {
  return fsp.writeFile(filePath, JSON.stringify(data, null, '\t'));
}
