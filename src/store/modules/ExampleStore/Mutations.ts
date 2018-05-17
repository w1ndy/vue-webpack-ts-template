import { VuexMutations } from 'vuex'
import { IExampleStoreState } from './State'
import Mutations from './MutationTypes'

const mutations: VuexMutations<IExampleStoreState> = {
  [Mutations.SET_MESSAGE] (state, message: string) {
    state.message = message
  }
}

export default mutations
