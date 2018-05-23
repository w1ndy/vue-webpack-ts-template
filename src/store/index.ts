import Vue from 'vue'

// tslint:disable-next-line:match-default-export-name
import Vuex, { Store } from 'vuex'

import { Example } from './modules/ExampleStore'

Vue.use(Vuex)

export const store: Store<{}> = new Vuex.Store({
  modules: {
    Example
  }
})
