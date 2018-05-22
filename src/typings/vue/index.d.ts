// Extend Vue constructor to make Vue.http working

import Vue from 'vue'
import VueResource from 'vue-resource'

declare module 'vue/types/vue' {
  export interface VueConstructor<V extends Vue = Vue> {
    http: {
      (options: VueResource.HttpOptions): PromiseLike<VueResource.HttpResponse>
      get: VueResource.$http
      post: VueResource.$http
      put: VueResource.$http
      patch: VueResource.$http
      delete: VueResource.$http
      jsonp: VueResource.$http
    }
  }
}
