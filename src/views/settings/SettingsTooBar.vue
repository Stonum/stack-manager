<template>
  <app-bar>
    <v-btn plain :loading="loading" @click="onClickFill">Заполнить список проектов</v-btn>
    <v-btn plain @click="$emit('save')">Сохранить настройки</v-btn>
  </app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingsTooBar',
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onClickFill() {
      this.loading = true;
      try {
        await this.$store.dispatch('projectStore/fillProjects');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
