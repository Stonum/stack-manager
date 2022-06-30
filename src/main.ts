import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  created() {
    // Prevent blank screen in Electron builds
    if (process.env.NODE_ENV === 'production') {
      this.$router.push('/');
    }
  },
  render: (h) => h(App),
}).$mount('#app');
