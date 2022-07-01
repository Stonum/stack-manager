<template>
  <v-footer app padless fixed>
    <v-container fluid class="pb-0">
      <v-card fluid :elevation="0">
        <v-tabs v-model="activeTab" hide-slider :height="tabHeaderHight">
          <v-tab @click="onClickTab(0)">
            <v-badge :value="messagesCount" color="primary" :content="messagesCount"> Сообщения </v-badge>
            <v-btn plain icon title="Очистить список сообщений" class="ml-3" color="error" @click.stop="onClearMessages">
              <v-icon>mdi-delete-circle-outline</v-icon>
            </v-btn>
          </v-tab>
          <v-tab @click="onClickTab(1)">
            <v-badge :value="eventsCount" color="primary" :content="eventsCount"> События диспетчера </v-badge>
          </v-tab>

          <v-spacer />
          <v-btn v-if="updateIsAvailable" :loading="isUpdating" color="primary" plain title="Установить обновление" @click="onUpdate">
            Доступно обновление версии
            <v-icon class="ml-2"> mdi-cloud-download-outline </v-icon>
          </v-btn>

          <v-btn color="primary" icon @click="onClickUpDown">
            <v-icon>{{ updownicon }}</v-icon>
          </v-btn>
        </v-tabs>

        <v-tabs-items v-model="activeTab" :style="`height: ${tabBodyHeight}px`">
          <v-tab-item>
            <message-list :items="messages" :height="tabBodyHeight" />
          </v-tab-item>
          <v-tab-item>
            <message-list :items="events" :height="tabBodyHeight" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue';

import MessageList from '../MessageList/MessageList.vue';

export default Vue.extend({
  name: 'AppFooter',
  components: { MessageList },
  data() {
    const tabHeaderHight = 40;
    const tabBodyMaxHeight = tabHeaderHight * 8 - tabHeaderHight;
    return {
      tabHeaderHight,
      tabBodyMaxHeight,
      tabBodyHeight: 0,
      activeTab: null,
      isUpdating: false,
    };
  },
  computed: {
    messages(): Message[] {
      return this.$store.getters['mainStore/getMessages']().sort((a: Message, b: Message) => {
        return a.time < b.time ? 1 : -1;
      });
    },
    messagesCount(): number {
      return this.messages.length;
    },
    events(): Message[] {
      return this.$store.getters['projectStore/getEvents']();
    },
    eventsCount(): number {
      return this.events.length;
    },
    collapsedFooter(): boolean {
      return this.tabBodyHeight === 0;
    },
    updownicon(): string {
      return this.collapsedFooter ? 'mdi-chevron-up' : 'mdi-chevron-down';
    },
    updateIsAvailable(): boolean {
      return this.$store.getters['mainStore/getUpdateAvailable']();
    },
  },
  created() {
    this.$emit('change', this.tabHeaderHight + this.tabBodyHeight);
  },
  methods: {
    onClickTab(tab: number) {
      if (this.collapsedFooter || tab === this.activeTab) {
        this.onClickUpDown();
      }
    },
    onClickUpDown() {
      this.tabBodyHeight = this.collapsedFooter ? this.tabBodyMaxHeight : 0;
      this.$emit('change', this.tabHeaderHight + this.tabBodyHeight);
    },
    async onUpdate() {
      this.isUpdating = true;
      try {
        await this.$store.dispatch('mainStore/downloadAndInstallUpdate');
      } finally {
        this.isUpdating = false;
      }
    },
    onClearMessages() {
      this.$store.dispatch('mainStore/clearMessages');
    },
  },
});
</script>
