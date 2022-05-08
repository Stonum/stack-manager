<template>
  <v-container fluid>
    <app-bar />
    <div v-html="html" @click.stop="onClick" />
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
  methods: {
    ...mapActions('mainStore', ['openURL', 'getChangeLog']),

    onClick(payload: any) {
      payload.preventDefault();
      if (payload.target.href) {
        this.openURL({ url: payload.target.href });
      }
    },
  },
  async mounted() {
    this.html = await this.getChangeLog();
  },
});
</script>
