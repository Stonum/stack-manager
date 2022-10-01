import MainListener from './mainListener';
import ProjectListener from './projectListener';

export async function registerListeners() {
  new MainListener();
  new ProjectListener();
}
