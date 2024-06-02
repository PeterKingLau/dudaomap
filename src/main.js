// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
import store from './store/store' //导入vuex
import '../src/assets/css/base.css'
import VueAMap from 'vue-amap'
// import VueAMap from '@vuemap/vue-amap'
// import '@vuemap/vue-amap/dist/style.css'
Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: 'c46e74d65e04cee731f8d48c7fcfcffa',
// });
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'c46e74d65e04cee731f8d48c7fcfcffa',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});
Vue.config.productionTip = false

//百度
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap,{
   ak:'92ocG5CWALrKFvPODxhE2KqKlSbr6o53'
})

//excel 导出
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel',JsonExcel)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
