declare module 'vuex' {
  import { PluginObject } from 'vue'

  interface Getters {
    [name: string]: any
  }

  export interface VuexGetters<S> {
    [getterName: string]: (state: S, getters: Getters) => any
  }

  export interface VuexMutations<S> {
    [mutationName: string]: (state: S, payload?: any) => void
  }

  export interface VuexCommitOptions {
    root: boolean
  }

  export interface VuexDispatchOptions {
    root: boolean
  }

  export interface VuexActionContext<S> {
    state: S
    commit(mutation: string, payload?: any, options?: VuexCommitOptions): void
    dispatch(action: string, payload?: any, options?: VuexDispatchOptions): Promise<any>
    getters: Getters
    rootGetters: Getters
  }

  export interface VuexActions<S> {
    [actionName: string]: (context: VuexActionContext<S>, payload?: any) => void
  }

  export interface VuexOptions {}

  export interface VuexStore<S> {
    namespaced?: boolean
    state?: S
    getters?: VuexGetters<S>
    mutations?: VuexMutations<S>
    actions?: VuexActions<S>
    modules?: {
      [moduleName: string]: VuexStore<any>
    }
  }

  export interface IVuex extends PluginObject<VuexOptions> {}
  const Vuex: IVuex

  module Vuex {
    interface Store {
      constructor (spec: VuexStore<any>): Store
    }
  }

  export default Vuex
}
