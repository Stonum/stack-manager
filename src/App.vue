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

import Toast from '@/components/Toast.vue';

Vue.component('SelectFolder', SelectFolder);
Vue.component('AppBar', AppBar);
Vue.component('YesNoDialog', YesNoDialog);

export default Vue.extend({
  name: 'App',
  components: { Toast },
});
</script>
