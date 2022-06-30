<template>
  <v-container fluid>
    <app-bar />
    <div @click.stop="onClick" v-html="html" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'ChangeLog',
  data() {
    return {
      html: null,
    };
  },
  async mounted() {
    this.html = await this.getChangeLog();
  },
  methods: {
    ...mapActions('mainStore', ['openURL', 'getChangeLog']),

    onClick(payload: any) {
      payload.preventDefault();
      if (payload.target.href) {
        this.openURL({ url: payload.target.href });
      }
    },
  },
});
</script>
