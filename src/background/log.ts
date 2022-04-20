import log from 'electron-log';
import { app } from 'electron';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import path from 'path';
import { settings } from './store';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isFullLogging = settings.get('fullLogging');

const folder = path.join(app.getPath('userData'), 'logs');
const filePath = () => path.join(folder, `log_${format(new Date(), 'yyyy_MM_dd', { locale: ru })}.log`);

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
