declare module 'vuex' {
  import { PluginObject } from 'vue'

  export interface VuexOptions {}
  export interface IVuex extends PluginObject<VuexOptions> {}
  const Vuex: IVuex

  export interface IGetters {
    [getterName: string]: any
  }

  export interface IGetterHandlers<S> {
    [getterName: string]: (state: S, getters: IGetters) => any
  }

  export interface IMutationHandlers<S> {
    [mutationName: string]: (state: S, payload?: any) => void
  }

  export interface IMutation {
    type: string
    payload: any
  }

  export interface ICommitOptions {
    root?: boolean
  }

  export interface IDispatchOptions {
    root?: boolean
  }

  export interface IAction {
    type: string
    payload: any
  }

  export interface IActionContext<S> {
    state: S
    commit(mutation: string, payload?: any, options?: ICommitOptions): void
    dispatch(action: string, payload?: any, options?: IDispatchOptions): Promise<any>
    getters: IGetters
    rootGetters: IGetters
  }

  export interface IActionHandlers<S> {
    [actionName: string]: (context: IActionContext<S>, payload?: any) => void
  }

  export interface IModule<S> {
    namespaced?: boolean
    state?: S
    getters?: IGetters
    mutations?: IMutationHandlers<S>
    actions?: IActionHandlers<S>
    modules?: {
      [moduleName: string]: IModule<any>
    }
  }

  export interface IModuleRegistrationOptions {
    preserveState: boolean
  }

  export interface IWatchOptions {}

  module Vuex {
    export interface IStore<S> extends IModule<S> {
      (spec: IModule<S>): IStore<S>

      state: S
      getters: IGetters

      commit(type: string, payload?: any, options?: ICommitOptions): void
      dispatch(type: string, payload?: any, options?: IDispatchOptions): Promise<any>
      replaceState(state: S): void
      watch<T>(fn: (state: S, getters: IGetters) => any, callback: (value: T, oldValue: T) => void, options?: IWatchOptions): () => void
      subscribe<P extends IMutation>(handler: (mutation: P, state: S) => void): () => void
      subscribeAction(handler: (action: IAction, state: S) => void): () => void
      registerModule(path: string | string[], module: IModule<any>, options?: IModuleRegistrationOptions): void
      unregisterModule(path: string | string[]): void
      hotUpdate(newOptions: IStore<any>): void
    }

    export type Store = IStore<any>
  }

  export default Vuex
}
