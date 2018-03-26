import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger' //通过mutations修改state会在控制台console
Vue.use(Vuex)

// Vuex调试工具
const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,  // vuex严格模式
    plugins: debug ? [createLogger()] : []
})