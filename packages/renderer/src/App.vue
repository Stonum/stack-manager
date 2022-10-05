<template>
  <v-app>
    <v-main>
      <div :style="wrapperStyle" class="scrollbar__visible">
        <router-view />
      </div>
    </v-main>
    <app-toast />
    <app-footer @change="onChangeFooterSize" />
  </v-app>
</template>

<script lang="ts" setup>
import { CSSProperties, reactive } from 'vue';

import AppFooter from '@/components/App/AppFooter.vue';
import AppToast from '@/components/App/AppToast.vue';

// TODO убрать хардкод, брать высоту от v-main
const wrapperStyle = reactive<CSSProperties>({
   height: '625px',
   'overflow-y': 'scroll',
});

function onChangeFooterSize(payload: number) {
  wrapperStyle.height = `${625 - payload}px`;
}
</script>
