import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import vuescroll from 'vuescroll';
import { loadFonts } from './plugins/webfontloader';

import AppBar from '@/components/App/AppBar.vue';

import BaseInput from '@/components/Base/BaseInput.vue';
import BaseInputFolder from '@/components/Base/BaseInputFolder.vue';
import BaseInputFile from '@/components/Base/BaseInputFile.vue';
import BaseCombobox from '@/components/Base/BaseCombobox.vue';
import BaseInputHistory from '@/components/Base/BaseInputHistory.vue';
import BaseCheckbox from '@/components/Base/BaseCheckbox.vue';

import HelpIcon from '@/components/HelpIcon.vue';

loadFonts();

const app = createApp(App);

app.use(vuetify).use(router).use(vuescroll).mount('#app');

app.component('AppBar', AppBar);

app.component('BaseInput', BaseInput);
app.component('BaseInputFolder', BaseInputFolder);
app.component('BaseInputFile', BaseInputFile);
app.component('BaseCombobox', BaseCombobox);
app.component('BaseInputHistory', BaseInputHistory);
app.component('BaseCheckbox', BaseCheckbox);

app.component('HelpIcon', HelpIcon);