<template>
  <v-menu open-on-hover left bottom offset-y offset-overflow>
    <template v-slot:activator="data">
      <v-btn icon class="pb-3" v-on="data.on">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container>
        <span class="text-caption"><slot /></span>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelpIcon',
});
</script>
