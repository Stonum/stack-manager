<template>
  <v-footer app fixed class="pa-0" style="border-top: 1px solid lightgrey">
    <v-container fluid class="pa-0">
      <v-card fluid :elevation="0">
        <v-tabs v-model="activeTab" hide-slider :height="tabHeaderHight">
          <v-tab value="messages" @click="onClickTab('messages')">
            Сообщения
            <transition name="bounce">
              <v-badge
                :key="`messages` + messagesCount"
                class="px-3 pb-4"
                :value="messagesCount"
                color="primary"
                :content="messagesCount"
              />
            </transition>
            <v-btn icon="mdi-delete-circle-outline" color="error" variant="text" density="compact" title="Очистить список сообщений" @click.stop="onClearMessages" />
          </v-tab>
          <v-tab value="events" @click="onClickTab('events')">
            События диспетчера
            <transition name="bounce">
              <v-badge
                :key="`events` + eventsCount"
                class="pl-3 pb-4"
                :value="eventsCount"
                color="primary"
                :content="eventsCount"
              />
            </transition>
          </v-tab>

          <v-spacer />
          <!-- <v-btn v-if="updateIsAvailable" :loading="isUpdating" color="primary" plain title="Установить обновление"
                  @click="onUpdate">
                  Доступно обновление версии
                  <v-icon class="ml-2"> mdi-cloud-download-outline </v-icon>
               </v-btn> -->

          <v-btn icon flat @click="onClickUpDown">
            <v-icon color="primary">
              {{ updownicon }}
            </v-icon>
          </v-btn>
        </v-tabs>

        <v-window v-model="activeTab" :style="`height: ${tabBodyHeight}px`">
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
import { ref, computed, onActivated } from 'vue';
import { useIpcRendererInvokeAsync } from '@/composables/useIpcRendererInvokeAsync';

import MessageList from '../MessageList/MessageList.vue';

const emit = defineEmits<{ (event: 'change', id: number): void }>();

const tabHeaderHight = ref(30);
const tabBodyMaxHeight = ref(tabHeaderHight.value * 8 - tabHeaderHight.value);
const tabBodyHeight = ref(0);
const activeTab = ref(null);

const messages = ref<Message[]>([]);
const messagesCount = computed(() => messages.value.length);

const { state: events, execute } = useIpcRendererInvokeAsync<Message[]>('project', { message: 'getEvents' }, [], { immediate: true, resetOnExecute: false });
const eventsCount = computed(() => events.value.length);

// setInterval(() => {
//    execute();
// }, 10000);

const collapsedFooter = computed(() => tabBodyHeight.value === 0);
const updownicon = computed(() => collapsedFooter.value ? 'mdi-chevron-up' : 'mdi-chevron-down');

const onClickTab = (tab: string) => {
   if (collapsedFooter.value || tab === activeTab.value) {
      onClickUpDown();
   }
};

const onClickUpDown = () => {
   tabBodyHeight.value = collapsedFooter.value ? tabBodyMaxHeight.value : 0;
   emit('change', tabHeaderHight.value + tabBodyHeight.value);
};

const onClearMessages = () => {

};

onActivated(() => { emit('change', tabHeaderHight.value + tabBodyHeight.value); });
</script>

<style scoped>
.bounce-enter-active {
   animation: bounce-in 0.5s;
}

.bounce-leave-active {
   animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
   0% {
      transform: scale(0);
   }

   50% {
      transform: scale(1.2);
   }

   100% {
      transform: scale(1);
   }
}
</style>
