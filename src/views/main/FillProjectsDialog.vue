<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <v-card>
        <v-card-title> Заполнение списка проектов </v-card-title>
        <v-card-text> Ваш список проектов пустой. Авторизуемся в диспетчере и заполним структуру? </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="8">
              <v-text-field v-model="settings.dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" />
            </v-col>
            <v-spacer />
            <v-col cols="3">
              <v-text-field v-model="settings.dispatcher_password" label="Пароль" type="password" />
            </v-col>
            <v-col cols="12">
              <select-folder v-model="settings.dispatcher_folder" label="Каталог службы диспетчера" />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :loading="loading" text @click="onClickFill"> Да </v-btn>
          <v-btn color="primary" :disabled="loading" text @click="$emit('close')"> Нет </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FillProjectsDialog',
  data() {
    return {
      dialog: true,
      loading: false,
      settings: {
        dispatcher_folder: '',
        dispatcher_url: '',
        dispatcher_password: '',
      } as Settings,
    };
  },
  async mounted() {
    for (const key of Object.keys(this.settings) as string[]) {
      this.settings[key] = await this.$store.dispatch('mainStore/getSettings', { key });
    }
  },
  methods: {
    async onClickFill() {
      for (const key of Object.keys(this.settings) as string[]) {
        this.$store.dispatch('mainStore/setSettings', { key, data: this.settings[key] });
      }
      this.loading = true;
      try {
        await this.$store.dispatch('projectStore/fillProjects');
        this.$emit('close');
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
