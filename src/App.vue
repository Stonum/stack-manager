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
  async mounted() {
    const currentVersion = await this.$store.dispatch('mainStore/getVersion');
    const version = await this.$store.dispatch('mainStore/getSettings', { key: 'currentVersion' });

    if (version != currentVersion) {
      this.$router.push('/changelog');
      this.$store.dispatch('mainStore/setSettings', { key: 'currentVersion', data: currentVersion });
    }
  },
});
</script>
