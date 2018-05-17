import Vue from 'vue'
import VueResource from 'vue-resource'
import { VuexActions } from 'vuex'

import API from 'api'

import { IExampleStoreState } from './State'
import Mutations from './MutationTypes'

const actions: VuexActions<IExampleStoreState> = {
  async setWelcomeMessage({ commit }, message: string) {
    const resp = await Vue.http.post('/api/welcome',{
      name: 'vue-webpack-ts-template'
    } as API.Welcome.Request)
    const body = (await resp.json()) as API.Welcome.Response
    commit(Mutations.SET_MESSAGE, (await resp.json()).message)
  }
}

export default actions
