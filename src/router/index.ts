import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import("@/views/index.vue"),
    },
    {
      path: '/test-layout',
      name: 'layout',
      component: import("@/views/components/test-create.vue"),
    },
    {
      path: '/test',
      component: import("@/views/components/components/ProgressNode.vue"),
    },
    {
      path: '/test1',
      component: import("@/views/components/xflow/test1.vue"),
    },
  ],
})

export default router
