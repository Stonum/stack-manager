<template>
  <v-snackbar v-model="visible" color="error" absolute style="z-index: 100" :timeout="10000" @click.native="visible = false">
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
    };
  },
  created() {
    this.$store.subscribe((mutatipn) => {
      if (mutatipn.type === 'mainStore/MESSAGE_ADD' && mutatipn.payload?.type === 'error') {
        this.visible = true;
        this.text = mutatipn.payload?.text;
      }
    });
  },
});
</script>
