import { IGetterHandlers } from 'vuex'
import { IExampleStoreState } from './State'

export const getters: IGetterHandlers<IExampleStoreState> = {
  welcomeMessage: (state: IExampleStoreState): string => state.message
}
