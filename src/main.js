import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Popper from 'popper.js'
import moment from 'moment';
import VueMoment from 'vue-moment';
import router from './router/index.js'

Vue.prototype.moment = moment


Popper.Defaults.modifiers.computeStyle.gpuAcceleration = false

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment, { moment });
Vue.use(VueRouter)

export const updateMatches = new Vue();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
