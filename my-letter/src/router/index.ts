import { createRouter, createWebHistory } from 'vue-router'

import OpeningPage from '../components/OpeningPage.vue'
import Letter2507View from '../components/views/Letter2507View.vue'
import Letter2508View from '../components/views/Letter2508View.vue'
import ReplyView from '../components/views/ReplyView.vue'
import ReplySentView from '../components/views/ReplySentView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: OpeningPage,
    },

    {
      path: '/2507',
      name: 'letter-2507',
      component: Letter2507View,
       meta: {
        requiresPuzzle: true,
      },
    },

    {
      path: '/2508',
      name: 'letter-2508',
      component: Letter2508View,
       meta: {
        requiresPuzzle: true,
      },
    },
    {
    path: '/reply',
    name: 'reply',
    component: ReplyView,
    meta: {
    requiresReplyAccess: true,
    },
  },
    {
    path: '/reply/sent',
    name: 'reply-sent',
    component: ReplySentView,
  }
  ],
})
router.beforeEach((to) => {

  /* Route không yêu cầu puzzle → cho đi bình thường*/
  if (!to.meta.requiresPuzzle) {
    return true
  }

  /*Route mà người dùng đã được cấp quyền*/
  const puzzleAccess = sessionStorage.getItem('puzzleAccess')

  /*Route hiện tại*/
  const currentRoute = to.path.replace('/', '')

  /*Nếu chưa giải puzzle hoặc giải puzzle /không đúng với route hiện tại → quay về Home */
  if (puzzleAccess !== currentRoute) {
    return {
      name: 'home',
    }
  }
  

  /* Đúng route → cho phép truy cập*/
  return true
})

export default router