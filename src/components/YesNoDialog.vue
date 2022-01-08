<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title> {{ message }} </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('click', true)"> Да </v-btn>
          <v-btn color="primary" text @click="$emit('click', false)"> Нет </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'YesNoDialog',
  props: {
    message: { type: String, required: true },
  },
  data() {
    return {
      dialog: true,
    };
  },
});
</script>
