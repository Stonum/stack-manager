<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="700px">
      <v-card>
        <v-card-title class="text-primary">
          Заполнение списка проектов
        </v-card-title>
        <v-card-text> Ваш список проектов пустой. Авторизуемся в диспетчере и заполним структуру? </v-card-text>
        <v-container>
          <v-row>
            <v-col cols="8">
              <base-input v-model="settings.dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" />
            </v-col>
            <v-spacer />
            <v-col cols="3">
              <base-input v-model="settings.dispatcher_password" label="Пароль" type="password" />
            </v-col>
            <v-col cols="12">
              <base-input-folder v-model="settings.dispatcher_folder" label="Каталог службы диспетчера" />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :loading="isLoading" text @click="onClickFill">
            Да
          </v-btn>
          <v-btn color="primary" :disabled="isLoading" text @click="emit('close')">
            Нет
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSettings, useIpcRendererInvokeAsync } from '@/composables';

const emit = defineEmits(['close']);

const isLoading = ref(false);
const dialog = ref(true);

const { settings, saveSettings } = useSettings();

const { execute } = useIpcRendererInvokeAsync('project', { message: 'fillProjects' }, false, { immediate: false });

const onClickFill = async () => {
  isLoading.value = true;
  try {
    await saveSettings();
    await execute();
    emit('close');
  } finally {
    isLoading.value = false;
  }
};
</script>
