import { createStore } from 'vuex'
import user from './modules/user'
import posts from './modules/posts'
import categories from './modules/categories'
import tags from './modules/tags'

export default createStore({
  modules: {
    user,
    posts,
    categories,
    tags,
  },
})
