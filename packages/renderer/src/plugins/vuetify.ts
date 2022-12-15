// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '@/styles/styles.scss';

// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      options: {
        customProperties: true,
      },

      themes: {
        light: {
          dark: false,
          colors: {
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
    },

    // display: {
    //   thresholds: {
    //     xs: 0,
    //     sm: 750,
    //     md: 960,
    //     lg: 1150,
    //     xl: 1900,
    //   },
    // },

    defaults: {
      VTabs: {
        color: 'primary'
      },
      VCheckbox: {
        color: 'primary'
      },
      VTextField: {
        color: 'primary'
      },
      VSwitch: {
        color: 'primary'
      }
    }
  }
);

