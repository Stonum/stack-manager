<template>
  <v-app-bar dense app color="primary" dark density="compact">
    <v-btn v-if="!hideHomeBtn" icon="mdi-home" to="/" title="На главную" />
    <v-btn v-if="!hideAddBtn" icon="mdi-plus" to="/project/-1" title="Добавить новый проект" />

    <v-app-bar-title>{{ props.title }}</v-app-bar-title>
    <v-spacer />

    <slot />

    <v-btn v-if="!hideSettingsBtn" icon="mdi-cog-outline" to="/settings" title="Настройки" />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import router from '@/router';

const props = defineProps({ 'title': { type: String, required: true } });

const currentPath = computed<string>(() => router.currentRoute.value.path);
const hideHomeBtn = computed<boolean>(() => currentPath.value === '/');
const hideAddBtn = computed<boolean>(() => currentPath.value !== '/');
const hideSettingsBtn = computed<boolean>(() => currentPath.value !== '/');
</script>
