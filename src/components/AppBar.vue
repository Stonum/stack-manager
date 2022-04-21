<template>
  <v-app-bar elevate-on-scroll dense app color="primary" dark>
    <v-btn v-if="!hideHomeBtn" plain icon to="/" title="На главную">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn v-if="!hideAddBtn" plain icon to="/project/-1" title="Добавить новый проект">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-app-bar-title>{{ title || pageName }}</v-app-bar-title>

    <v-spacer></v-spacer>

    <slot />

    <v-btn v-if="!hideSettingsBtn" plain icon to="/settings" title="Настройки">
      <v-icon>mdi-cog-outline</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppBar',
  props: {
    title: { type: String },
  },
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
