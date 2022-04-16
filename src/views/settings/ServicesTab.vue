<template>
  <v-container fluid>
    <v-row no-gutters>
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
      <v-col cols="12">
        <select-folder v-model="settings.birt" label="Каталог Birt" clearable>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'birt')" title="Создать сервис Birt">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
            <help-icon>Каталог откуда запускается служба отчетов BirtWebReporter</help-icon>
          </template>
        </select-folder>
      </v-col>
      <v-col cols="12">
        <select-folder v-model="settings.dotnetcore" label="Каталог DotNetCore" clearable>
          <template #append-outer>
            <v-btn icon tile small @click.stop="$emit('create', 'dotnetcore')" title="Создать сервис DotNetCore">
              <v-icon> mdi-export-variant </v-icon>
            </v-btn>
            <help-icon>Каталог построителя библиотеки построения отчетов dotnetcore</help-icon>
          </template>
        </select-folder>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'ServicesTab',
  props: {
    settings: { type: Object as PropType<Settings>, required: true },
  },
});
</script>
