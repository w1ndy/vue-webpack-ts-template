import { IMutationHandlers } from 'vuex'

import { MUTATIONS } from './MutationTypes'
import { IExampleStoreState } from './State'

// tslint:disable:function-name
export const mutations: IMutationHandlers<IExampleStoreState> = {
  [MUTATIONS.SET_MESSAGE] (state: IExampleStoreState, message: string): void {
    state.message = message
  }
}
