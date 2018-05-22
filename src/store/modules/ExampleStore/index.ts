import { IModule } from 'vuex'

import { actions } from './Actions'
import { getters } from './Getters'
import { mutations } from './Mutations'
import { IExampleStoreState, state } from './State'

// tslint:disable:variable-name
export const Example: IModule<IExampleStoreState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
