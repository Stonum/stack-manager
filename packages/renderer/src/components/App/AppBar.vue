<template>
   <v-app-bar dense app color="primary" dark>
      <v-btn v-if="!hideHomeBtn" plain icon to="/" title="На главную">
         <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn v-if="!hideAddBtn" plain icon to="/project/-1" title="Добавить новый проект">
         <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-app-bar-title>{{ title }}</v-app-bar-title>

      <v-spacer />

      <slot />

      <v-btn v-if="!hideSettingsBtn" plain icon to="/settings" title="Настройки">
         <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
   </v-app-bar>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import router from '/@/router';

const { title } = defineProps(['title']);

const currentPath = computed<string>(() => router.currentRoute.value.path);
const hideHomeBtn = computed<boolean>(() => currentPath.value === '/');
const hideAddBtn = computed<boolean>(() => currentPath.value !== '/');
const hideSettingsBtn = computed<boolean>(() => currentPath.value !== '/');
</script>
