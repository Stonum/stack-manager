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

const wrapperStyle = reactive<CSSProperties>({
   height: '595px',
   'overflow-y': 'scroll',
});

function onChangeFooterSize(payload: number) {
  wrapperStyle.height = `${595 - payload}px`;
}
</script>
