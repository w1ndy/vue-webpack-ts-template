import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip =
  process.env.NODE_ENV === 'production' ? true : false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
