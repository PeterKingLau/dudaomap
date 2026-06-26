import { createRouter, createWebHashHistory } from 'vue-router'
import map from '@/views/map.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'map',
      component: map,
    },
  ],
})
