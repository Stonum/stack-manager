<template>
  <v-container fluid>
    <app-bar />
    <div v-html="html" @click.prevent.stop="onClick" />
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
    ...mapActions('projectStore', ['projectSendJob']),

    onClick(payload: any) {
      if (payload.target.href) {
        this.projectSendJob({ jobName: 'openUrl', projectId: null, params: payload.target.href });
      }
    },
  },
  async mounted() {
    this.html = await this.$store.dispatch('mainStore/getChangeLog');
  },
});
</script>
