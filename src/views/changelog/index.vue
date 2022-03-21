<template>
  <v-container fluid>
    <app-bar />
    <div v-html="html" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ChangeLog',
  data() {
    return {
      html: null,
    };
  },
  async mounted() {
    this.html = await this.$store.dispatch('mainStore/getChangeLog');
  },
});
</script>
