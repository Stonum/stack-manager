<template>
  <v-app>
    <v-main ref="vmain">
      <div :style="wrapperStyle" class="scrollbar__visible">
        <router-view />
      </div>
    </v-main>
    <app-toast />
    <app-footer @change="onChangeFooterSize" />
  </v-app>
</template>

<script lang="ts" setup>
import { CSSProperties, computed, ref, watch } from 'vue';

import AppFooter from '@/components/App/AppFooter.vue';
import AppToast from '@/components/App/AppToast.vue';

const vmain = ref(null);
const mainHeight = ref(0);
const footerHeight = ref(0);
const wrapperStyle = computed<CSSProperties>(() => {
   return {
      height: `${mainHeight.value-footerHeight.value}px`,
      'overflow-y': 'scroll',
   };
});

watch(vmain, () => {
   // @ts-ignore
   mainHeight.value = vmain.value?.$vuetify.display.height - 48; // 48px на верхний padding
});

function onChangeFooterSize(payload: number) {
   footerHeight.value = payload;
}
</script>
