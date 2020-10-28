import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from '../views/Home'
import Stats from '../views/Stats'

Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
        path: '/stats',
        name: 'stats',
        component: Stats,
      }
  ]
})