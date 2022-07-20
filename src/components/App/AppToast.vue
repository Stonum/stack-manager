<template>
  <v-snackbar v-model="visible" :color="color" absolute style="z-index: 100" :timeout="10000" @click.native="visible = false">
    {{ text }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppToast',
  data() {
    return {
      visible: false,
      text: null,
      color: 'info',
    };
  },
  created() {
    this.$store.subscribe((mutatipn) => {
      if (mutatipn.type === 'mainStore/MESSAGE_ADD') {
        this.visible = true;
        this.text = mutatipn.payload?.text;
        this.color = mutatipn.payload?.type && mutatipn.payload?.type === 'error' ? 'error' : 'info';
      }
    });
  },
});
</script>
