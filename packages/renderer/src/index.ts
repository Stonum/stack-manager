import { createApp } from 'vue';
import App from '/@/App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import AppBar from '/@/components/App/AppBar.vue';

loadFonts();

const app = createApp(App);

app.use(vuetify).use(router).mount('#app');

app.component('AppBar', AppBar);
