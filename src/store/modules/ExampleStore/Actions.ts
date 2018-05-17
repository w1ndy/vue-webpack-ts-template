import { VuexActions } from 'vuex'
import { IExampleStoreState } from './State'
import Mutations from './MutationTypes'

const actions: VuexActions<IExampleStoreState> = {
  setWelcomeMessage({ commit }, message: string) {
    commit(Mutations.SET_MESSAGE, message)
  }
}

export default actions
