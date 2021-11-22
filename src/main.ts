import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './middleware';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  // store,
  vuetify,
  render: (h) => h(App),
  created() {
    // Prevent blank screen in Electron builds
    if (process.env.NODE_ENV === 'production') {
      this.$router.push('/');
    }
    // this.$store.dispatch('fillStore');
  },
}).$mount('#app');
