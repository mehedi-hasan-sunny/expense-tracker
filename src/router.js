import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/MonthlyExpense',
      name: 'Monthly Expense',
      component: () => import(/* webpackChunkName: "about" */ './views/MonthlyExpense.vue')
    },
    {
      path: '/DailyExpense',
      name: 'Daily Expense',
      component: () => import(/* webpackChunkName: "about" */ './views/DailyExpense.vue')
    }
  ]
})
