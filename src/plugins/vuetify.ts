import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ru from 'vuetify/src/locale/ru';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },

    themes: {
      light: {
        primary: '#1A965A',
        secondary: '#E1EEE1',
        accent: '#89C745',
        error: '#E47272',
        warning: '#D9AB36',
        info: '#006699',
        success: '#339900',
        stack: '#113A51',
      },
    },
  },

  lang: {
    locales: { ru },
    current: 'ru',
  },

  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
});
