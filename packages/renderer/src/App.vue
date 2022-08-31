<template>
  <v-app>
    <v-main>
      <div :style="`height: ${620 - footerSize}px; position: relative; overflow: auto;`" class="scrollbar__visible">
        <router-view />
      </div>
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