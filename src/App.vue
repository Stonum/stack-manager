<template>
  <v-app>
    <v-main>
      <vue-scroll :style="`height: ${620 - footerSize}px`">
        <router-view />
      </vue-scroll>
    </v-main>
    <app-toast />
    <app-footer @change="onChangeFooterSize" />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import BaseInput from '@/components/Base/BaseInput.vue';
import BaseInputFolder from '@/components/Base/BaseInputFolder.vue';
import BaseInputFile from '@/components/Base/BaseInputFile.vue';
import BaseCombobox from '@/components/Base/BaseCombobox.vue';
import BaseInputHistory from '@/components/Base/BaseInputHistory.vue';
import BaseCheckbox from '@/components/Base/BaseCheckbox.vue';

import AppBar from '@/components/App/AppBar.vue';
import AppToast from '@/components/App/AppToast.vue';
import AppFooter from '@/components/App/AppFooter.vue';

import YesNoDialog from '@/components/YesNoDialog.vue';
import HelpIcon from '@/components/HelpIcon.vue';

import VueScroll from 'vuescroll';

Vue.component('BaseInput', BaseInput);
Vue.component('BaseInputFolder', BaseInputFolder);
Vue.component('BaseInputFile', BaseInputFile);
Vue.component('BaseCombobox', BaseCombobox);
Vue.component('BaseInputHistory', BaseInputHistory);
Vue.component('BaseCheckbox', BaseCheckbox);

Vue.component('AppBar', AppBar);
Vue.component('YesNoDialog', YesNoDialog);
Vue.component('HelpIcon', HelpIcon);
Vue.component('VueScroll', VueScroll);

export default Vue.extend({
  name: 'App',
  components: { AppToast, AppFooter },
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
