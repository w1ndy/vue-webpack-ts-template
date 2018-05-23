import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// tslint:disable-next-line:match-default-export-name
import App from './App.vue'
import router from './router'
import { store } from './store'

Vue.config.productionTip =
  process.env.NODE_ENV === 'production' ? true : false

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
