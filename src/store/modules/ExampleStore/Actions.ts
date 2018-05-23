import Vue from 'vue'
import VueResource from 'vue-resource'
import { ActionContext, ActionTree } from 'vuex'

// tslint:disable-next-line:no-implicit-dependencies
import API from 'api'

import { MUTATIONS } from './MutationTypes'

import { IRootState } from '../../RootState'
import { IExampleStoreState } from './State'

export const actions: ActionTree<IExampleStoreState, IRootState> = {
  async setWelcomeMessage(ctx: ActionContext<IExampleStoreState, IRootState>, message: string): Promise<void> {
    const req: API.Welcome.Request = {
      name: 'vue-webpack-ts-template'
    }
    const resp: VueResource.HttpResponse = await Vue.http.post('/api/welcome', req)
    const body: API.Welcome.Response = await (<PromiseLike<API.Welcome.Response>>resp.json())
    ctx.commit(MUTATIONS.SET_MESSAGE, body.message)
  }
}
