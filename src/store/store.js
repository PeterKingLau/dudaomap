//配置vuex持久化
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate  from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
    state:{//存值
        markerMess:{},//存督导员的电话号码
    },
    getters:{
       getmarkerMess(state){//取电话号码
          return state.markerMess
       }
    },
    mutations:{
        updatemarkerMess(state,data){ //异步调用赋值
            state.markerMess=data
        }
    },
    plugins:[
        createPersistedstate({
             reducer(val){
                return val
             }
        })
    ]
})