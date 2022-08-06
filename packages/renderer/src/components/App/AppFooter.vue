<template>
   <v-footer app padless fixed>
      <v-container fluid class="pb-0">
         <v-card fluid :elevation="0">
            <v-tabs v-model="activeTab" hide-slider :height="tabHeaderHight">
               <v-tab @click="onClickTab(0)">
                  Сообщения
                  <!-- <transition name="bounce">
                     <v-badge :key="`messages` + messagesCount" class="pb-1" :value="messagesCount" color="primary"
                        :content="messagesCount" />
                  </transition> -->
                  <v-btn plain icon title="Очистить список сообщений" class="ml-3" color="error"
                     @click.stop="onClearMessages">
                     <v-icon>mdi-delete-circle-outline</v-icon>
                  </v-btn>
               </v-tab>
               <v-tab @click="onClickTab(1)">
                  События диспетчера
                  <!-- <transition name="bounce">
                     <v-badge :key="`events` + eventsCount" class="pb-1" :value="eventsCount" color="primary"
                        :content="eventsCount" />
                  </transition> -->
               </v-tab>

               <v-spacer />
               <!-- <v-btn v-if="updateIsAvailable" :loading="isUpdating" color="primary" plain title="Установить обновление"
                  @click="onUpdate">
                  Доступно обновление версии
                  <v-icon class="ml-2"> mdi-cloud-download-outline </v-icon>
               </v-btn> -->

               <v-btn color="primary" icon @click="onClickUpDown">
                  <v-icon>{{ updownicon }}</v-icon>
               </v-btn>
            </v-tabs>

            <!-- <v-tabs-items v-model="activeTab" :style="`height: ${tabBodyHeight}px`">
               <v-tab-item>
                  <message-list :items="messages" :height="tabBodyHeight" />
               </v-tab-item>
               <v-tab-item>
                  <message-list :items="events" :height="tabBodyHeight" />
               </v-tab-item>
            </v-tabs-items> -->
         </v-card>
      </v-container>
   </v-footer>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits, onActivated } from 'vue';
// import MessageList from '../MessageList/MessageList.vue';

const tabHeaderHight = ref(40);
const tabBodyMaxHeight = ref(tabHeaderHight.value * 8 - tabHeaderHight.value);
const tabBodyHeight = ref(0);
const activeTab = ref(null);

const collapsedFooter = computed(() => tabBodyHeight.value === 0);
const updownicon = computed(() => collapsedFooter.value ? 'mdi-chevron-up' : 'mdi-chevron-down');

const emit = defineEmits<{
   (e: 'change', id: number): void
}>()

const onClickTab = (tab: number) => {
   if (collapsedFooter.value || tab === activeTab.value) {
      onClickUpDown();
   }
}

const onClickUpDown = () => {
   tabBodyHeight.value = collapsedFooter.value ? tabBodyMaxHeight.value : 0;
   emit('change', tabHeaderHight.value + tabBodyHeight.value);
}

const onClearMessages = () => {

};

// onActivated(() => { emit('change', tabHeaderHight.value + tabBodyHeight.value); });
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
