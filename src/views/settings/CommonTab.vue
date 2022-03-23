<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="8">
        <v-text-field v-model="settings.dispatcher_url" label="Диспетчер ( адрес : порт )" placeholder="http://<url>:<port>" prepend-icon="mdi-web" clearable />
      </v-col>
      <v-spacer />
      <v-col cols="3">
        <v-text-field v-model="settings.dispatcher_password" label="Пароль" type="password" clearable />
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.dispatcher_folder" label="Каталог службы диспетчера" clearable>
          <template #append-outer>
            <help-icon>Каталог службы диспетчера. Нужен для парсинга проектов. Если в команде запуска указан путь типа "../"</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.stackversion" label="Каталог Stack_Version" clearable>
          <template #append-outer>
            <help-icon
              >Локальный каталог для версий. Сюда будет копироваться каталог версии. Если не указан, будем использовать ссылку на каталог версии указанной при создании</help-icon
            >
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.bin" label="Каталог bin" clearable>
          <template #append-outer>
            <help-icon>Общий каталог где будут создаваться папки для запуска веб сервиса. Если не заполнен, создаем в bin проекта</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.share" label="Каталог публикации файлов (/share)" clearable>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'share')" title="Создать веб сервис">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
            <help-icon>Каталог куда стэк публикует файлы отчетов и прочие выгрузки</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.upload" label="Каталог загрузки файлов (/upload)" clearable>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'upload')" title="Создать веб сервис">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
            <help-icon>Каталог куда загружаются файлы для подкачек</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model.number="settings.refresh_interval" label="Интервал обномления статусов приложений" type="number" suffix="мс" />
      </v-col>
      <v-col cols="12">
        <v-switch v-model="settings.fullLogging" label="Полное логирование ( включает логирование всех запросов после перезапуска )" />
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
