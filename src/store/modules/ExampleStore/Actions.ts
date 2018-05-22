import Vue from 'vue'
import VueResource from 'vue-resource'
import { IActionContext, IActionHandlers } from 'vuex'

// tslint:disable-next-line:no-implicit-dependencies
import API from 'api'

import { MUTATIONS } from './MutationTypes'
import { IExampleStoreState } from './State'

export const actions: IActionHandlers<IExampleStoreState> = {
  async setWelcomeMessage(ctx: IActionContext<IExampleStoreState>, message: string): Promise<void> {
    const req: API.Welcome.Request = {
      name: 'vue-webpack-ts-template'
    }
    const resp: VueResource.HttpResponse = await Vue.http.post('/api/welcome', req)
    const body: API.Welcome.Response = await resp.json()
    ctx.commit(MUTATIONS.SET_MESSAGE, body.message)
  }
}
