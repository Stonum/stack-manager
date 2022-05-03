<template>
  <v-snackbar v-model="visible" color="error" @click.native="visible = false" absolute style="z-index: 100" :timeout="10000">
    {{ text }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Toast',
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
