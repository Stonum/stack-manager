<template>
  <app-bar>
    <v-btn plain @click="$emit('save')">Сохранить настройки</v-btn>
  </app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingsTooBar',
});
</script>
