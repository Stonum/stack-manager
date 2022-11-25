<template>
  <v-footer app fixed class="pa-0" style="border-top: 1px solid lightgrey">
    <v-container fluid class="pa-0">
      <v-card fluid :elevation="0">
        <v-tabs hide-slider :height="tabHeaderHight">
          <v-tab value="messages" @click="onClickTab('messages')">
            Сообщения
            <transition name="bounce">
              <v-badge :key="`messages` + messagesCount" class="px-3 pb-4" :value="messagesCount" color="primary" :content="messagesCount" />
            </transition>
            <v-btn icon="mdi-delete-circle-outline" color="error" variant="text" density="compact" title="Очистить список сообщений" @click.stop="clearMessages" />
          </v-tab>
          <v-tab value="events" @click="onClickTab('events')">
            События диспетчера
            <transition name="bounce">
              <v-badge :key="`events` + eventsCount" class="pl-3 pb-4" :value="eventsCount" color="primary" :content="eventsCount" />
            </transition>
          </v-tab>

          <v-spacer />
          <v-btn
            v-if="updateIsAvailable"
            class="mt-1"
            :loading="isUpdating"
            append-icon="mdi-cloud-download-outline"
            variant="plain"
            color="primary"
            title="Установить обновление"
            @click="downloadAndInstallUpdate"
          >
            Доступно обновление версии
          </v-btn>

          <v-btn icon flat data-test-id="button-up-down" @click="onClickUpDown">
            <v-icon color="primary">
              {{ updownicon }}
            </v-icon>
          </v-btn>
        </v-tabs>

        <v-window v-model="activeTab" data-test-id="footer-window" :style="`height: ${tabBodyHeight}px`">
          <v-window-item value="messages">
            <message-list :items="messages" :height="tabBodyHeight" />
          </v-window-item>
          <v-window-item value="events">
            <message-list :items="events" :height="tabBodyHeight" />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useFooter, useUpdater, useMessages, useEvents, useIntervalCall } from '@/composables';

import MessageList from '../MessageList/MessageList.vue';

const emit = defineEmits<{ (event: 'change', id: number): void }>();

const { collapsed, updownicon, tabBodyHeight, tabHeaderHight, onClickUpDown } = useFooter(emit);
const activeTab = ref('');

const onClickTab = (tab: string) => {
  if (collapsed.value || tab === activeTab.value) {
    onClickUpDown();
  }
  activeTab.value = tab;
};

const { messages, clearMessages } = useMessages();
const messagesCount = computed(() => messages.value.length);

const { events, loadEvents } = useEvents();
const eventsCount = computed(() => events.value.length);
useIntervalCall(loadEvents);

const { updateIsAvailable, isUpdating, downloadAndInstallUpdate } = useUpdater();
</script>