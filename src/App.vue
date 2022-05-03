<template>
  <v-app>
    <v-main>
      <vue-scroll :style="`height: ${620 - footerSize}px`">
        <router-view />
      </vue-scroll>
    </v-main>
    <toast />
    <footer-bar @change="onChangeFooterSize" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import SelectFolder from '@/components/SelectFolder.vue';
import SelectFile from '@/components/SelectFile.vue';
import AppBar from '@/components/AppBar.vue';
import YesNoDialog from '@/components/YesNoDialog.vue';
import HelpIcon from '@/components/HelpIcon.vue';

import Toast from '@/components/Toast.vue';
import FooterBar from '@/components/FooterBar.vue';

import VueScroll from 'vuescroll';

Vue.component('SelectFolder', SelectFolder);
Vue.component('SelectFile', SelectFile);
Vue.component('AppBar', AppBar);
Vue.component('YesNoDialog', YesNoDialog);
Vue.component('HelpIcon', HelpIcon);
Vue.component('VueScroll', VueScroll);

export default Vue.extend({
  name: 'App',
  components: { Toast, FooterBar },
  data() {
    return { footerSize: 0 };
  },
  methods: {
    onChangeFooterSize(payload: number) {
      this.footerSize = payload;
    },
  },
});
</script>
