// Extend Vue constructor to make Vue.http working

import Vue from 'vue'
import { HttpOptions, HttpResponse, $http } from 'vue-resource'

declare module 'vue/types/vue' {
  export interface VueConstructor<V extends Vue = Vue> {
    http: {
      (options: HttpOptions): PromiseLike<HttpResponse>
      get: $http
      post: $http
      put: $http
      patch: $http
      delete: $http
      jsonp: $http
    }
  }
}
