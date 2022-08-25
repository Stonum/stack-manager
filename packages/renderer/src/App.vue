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

<script lang="ts" setup>
import { ref } from 'vue';

import AppFooter from '@/components/App/AppFooter.vue';
import AppToast from '@/components/App/AppToast.vue';

const footerSize = ref(0);

function onChangeFooterSize(payload: number) {
  footerSize.value = payload;
}
</script>