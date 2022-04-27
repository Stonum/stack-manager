<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-text-field v-model="settings.dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable dense />
      </v-col>
      <v-spacer />
      <v-col cols="3">
        <v-text-field v-model="settings.dispatcher_password" label="Пароль" type="password" clearable dense />
      </v-col>
      <v-col cols="8">
        <v-text-field v-model="settings.rabbitmq_url" label="RabbitMQ ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable dense />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.stackversion" label="Локальный каталог Stack.Version" clearable dense>
          <template #append-outer>
            <help-icon
              >Локальный каталог для версий. Сюда будет копироваться каталог версии. Если не указан, будем использовать ссылку на каталог версии указанной при создании</help-icon
            >
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.bin" label="Общий каталог bin" clearable dense>
          <template #append-outer>
            <help-icon>Общий каталог где будут создаваться папки для запуска веб сервиса. Если не заполнен, создаем в bin проекта</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.jre" label="Каталог jre" clearable dense>
          <template #append-outer>
            <help-icon>Каталог jre</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model.number="settings.refresh_interval" label="Интервал обномления статусов приложений" type="number" suffix="мс" dense />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="settings.fullLogging" label="Полное логирование ( включает логирование всех запросов после перезапуска )" dense />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'SettingsTab',
  props: {
    settings: { type: Object as PropType<Settings>, required: true },
  },
});
</script>
