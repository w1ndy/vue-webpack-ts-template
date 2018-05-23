import { MutationTree } from 'vuex'

import { MUTATIONS } from './MutationTypes'
import { IExampleStoreState } from './State'

// tslint:disable:function-name
export const mutations: MutationTree<IExampleStoreState> = {
  [MUTATIONS.SET_MESSAGE] (state: IExampleStoreState, message: string): void {
    state.message = message
  }
}
