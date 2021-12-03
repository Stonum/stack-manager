<template>
  <v-app>
    <v-app-bar elevate-on-scroll dense app color="primary" dark>
      <v-btn v-if="!hideHomeBtn" plain icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn v-if="!hideAddBtn" plain icon to="/new">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-app-bar-title>{{ pageName }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!hideSettingsBtn" plain icon to="/settings">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import SelectFolder from '@/components/SelectFolder.vue';

Vue.component('SelectFolder', SelectFolder);

export default Vue.extend({
  name: 'App',
  data: () => ({
    //
  }),
  computed: {
    pageName(): string {
      return this.$route.name || '';
    },
    hideHomeBtn(): boolean {
      return this.$route.path === '/';
    },
    hideAddBtn(): boolean {
      return this.$route.path !== '/';
    },
    hideSettingsBtn(): boolean {
      return this.$route.path !== '/';
    },
  },
});
</script>
