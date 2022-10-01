import log from 'electron-log';
import { app } from 'electron';
import path from 'path';
import { settings } from './store';

const format = (date: Date) => {
  const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
  const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay();
  return `${date.getFullYear()}_${month}_${day}`;
};

const isDevelopment = process.env.NODE_ENV !== 'production';
const isFullLogging = settings.get('fullLogging');

const folder = path.join(app.getPath('userData'), 'logs');
const filePath = () => path.join(folder, `log_${format(new Date())}.log`);

log.transports.file.resolvePath = filePath;
if (!isDevelopment && !isFullLogging) {
  log.transports.file.level = 'error';
}

if (!isDevelopment) {
  log.transports.console.level = false;
} else {
  log.transports.file.level = false;
}

export default log;
