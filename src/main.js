import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false

import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(lazyload,{
    loading : 'src/common/image/default.png'
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})