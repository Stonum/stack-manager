import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import { ipcRenderer } from "electron";

Vue.config.productionTip = false;
// Vue.prototype.$ipcRenderer = ipcRenderer;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    // Prevent blank screen in Electron builds
    this.$router.push("/");
    // //@ts-ignore
    // this.$ipcRenderer.on("SET_ROUTE", (event: any, data: string) => {
    //   this.$router.push(data);
    // });
  },
}).$mount("#app");
