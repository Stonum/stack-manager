<template>
  <app-bar>
    <v-btn plain :loading="loading" @click="onClickFill">Заполнить список проектов</v-btn>
    <v-btn plain @click="$emit('save')">Сохранить настройки</v-btn>
  </app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { fillProjects } from '@/middleware/index';

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
        await fillProjects();
      } finally {
        this.loading = false;
      }
      this.$router.push('/');
    },
  },
});
</script>
