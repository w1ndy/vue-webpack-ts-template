import { VuexGetters } from 'vuex'
import { IExampleStoreState } from './State'

const getters: VuexGetters<IExampleStoreState> = {
  welcomeMessage: state => state.message
}

export default getters
