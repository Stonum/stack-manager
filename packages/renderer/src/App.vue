<template>
  <v-app>
    <v-main v-resize="onResize">
      <div :style="wrapperStyle" class="scrollbar__visible">
        <router-view />
      </div>
    </v-main>
    <app-toast />
    <app-footer @change="onChangeFooterSize" />
  </v-app>
</template>

<script lang="ts" setup>
import { CSSProperties, computed, ref, onMounted } from 'vue';

import AppFooter from '@/components/App/AppFooter.vue';
import AppToast from '@/components/App/AppToast.vue';

const mainHeight = ref(0);
const footerHeight = ref(0);
const wrapperStyle = computed<CSSProperties>(() => {
   return {
      height: `${mainHeight.value-footerHeight.value}px`,
      'overflow-y': 'scroll',
   };
});

const onResize = () => {
   mainHeight.value = window.innerHeight - 48; // 48px на верхний padding
};
onMounted(onResize);

function onChangeFooterSize(payload: number) {
   footerHeight.value = payload;
}
</script>
