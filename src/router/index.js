import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import HelloWorld from '@/components/move'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path : '/test',
      name : 'test',
      component : resolve => require(['@/components/hoverTest'] , resolve)
    },
    {
      path : '/transition',
      name : 'transition',
      component : resolve => require(['@/components/transition'] , resolve)
    },
    {
      path : '/element',
      name : 'element',
      component : resolve => require(['@/components/element'] , resolve)
    },
    {
      path : '/testId',
      name : 'testId',
      component : resolve => require(['@/components/test-id'] , resolve)
    }
  ]
})
