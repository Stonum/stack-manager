<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field
          v-model="disp_url"
          label="Диспетчер ( адрес : порт )"
          placeholder="http://<url>:<port>"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="stack_version" label="Каталог Stack_Version" />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="nginx" label="Каталог nginx" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      disp_url: "http://localhost:8090",
      stack_version: "e:\\stack.version",
      nginx: "e:\\back_end\\nginx",
    };
  },
});
</script>
