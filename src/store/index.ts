import Vue from 'vue'
import Vuex from 'vuex'

import { Example } from './modules/ExampleStore'

Vue.use(Vuex)

export const store: Vuex.Store = new Vuex.Store({
  modules: {
    Example
  }
})
