import Vuex, { VuexStore } from 'vuex'

import state, { IExampleStoreState } from './State'
import getters from './Getters'
import mutations from './Mutations'
import actions from './Actions'

const store: VuexStore<IExampleStoreState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default store
