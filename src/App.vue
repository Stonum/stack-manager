<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <toast />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import SelectFolder from '@/components/SelectFolder.vue';
import AppBar from '@/components/AppBar.vue';
import YesNoDialog from '@/components/YesNoDialog.vue';
import HelpIcon from '@/components/HelpIcon.vue';

import Toast from '@/components/Toast.vue';

Vue.component('SelectFolder', SelectFolder);
Vue.component('AppBar', AppBar);
Vue.component('YesNoDialog', YesNoDialog);
Vue.component('HelpIcon', HelpIcon);

export default Vue.extend({
  name: 'App',
  components: { Toast },
  data() {
    return {
      timer: null as any,
    };
  },
  async mounted() {
    const interval = +(await this.$store.dispatch('mainStore/getSettings', { key: 'refresh_interval' })) || 20000;
    this.timer = setInterval(() => {
      this.$store.dispatch('projectStore/getAppStatus');
    }, interval);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
});
</script>
