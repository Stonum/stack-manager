import Vue from 'vue';
import Vuex from 'vuex';

import mainStore from './mainStore';
import projectStore from './projectStore';

Vue.use(Vuex);

const store = new Vuex.Store({ modules: { mainStore, projectStore } });

export default store;
