<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent :max-width="width">
      <v-card>
        <v-card-title> {{ header }} </v-card-title>
        <v-card-text v-if="text"> {{ text }} </v-card-text>
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
    header: { type: String, required: true },
    text: { type: String },
    width: { type: Number, default: 290 },
  },
  data() {
    return {
      dialog: true,
    };
  },
});
</script>
