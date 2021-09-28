<template>
  <v-app>
    <v-app-bar elevate-on-scroll dense app color="primary" dark>
      <v-btn icon to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-app-bar-title>{{ pageName }}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon to="/settings">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    pageName(): string {
      return this.$route.name || "";
    },
  },
});
</script>
