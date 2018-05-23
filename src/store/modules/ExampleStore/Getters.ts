import { GetterTree } from 'vuex'

import { IRootState } from '../../RootState'
import { IExampleStoreState } from './State'

export const getters: GetterTree<IExampleStoreState, IRootState> = {
  welcomeMessage: (state: IExampleStoreState): string => state.message
}
