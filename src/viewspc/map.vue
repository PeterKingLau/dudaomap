<template>
  <div class="mapContent">
    <div class="mapLeft">

      <el-amap vid="amapDemo" :zoom="zoom" :center="center" :viewMode='viewMode' :events='events'>

        <!--实时-->
        <div v-for="(item, index)  in realTime" :key="index">
          <!--点-->
          <!-- <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :icon='iconLs'  @init="initMap"  reEventWhenUpdate='true' @click='clickMarker'></el-amap-marker> -->
          <!-- <el-amap-marker  v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :offset='offset' reEventWhenUpdate='true'    >显示名字。电话。位置-->
          <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng, item.lat]' reEventWhenUpdate='true'
            :topWhenClick='visible' :bubble='visible' :clickable='visible' animation='AMAP_ANIMATION_DROP' :extData='item'
            :events='eventsMarker.ssMarker'>
            <div class="mapMaker mapMakerSs" ref="mapMakerHeight">
              <ul>
                <li style="color:#ffc520" v-if="item.name != '暂未上传名字'">
                  <span><img src="../assets/images/ssName.png" alt=""></span>
                  {{ item.name }}
                </li>

                <li style="color:#ffc520" v-else>
                  <span><img src="../assets/images/ssTel.png" alt=""></span>
                  {{ item.phone }}
                </li>

                <!-- <li class="posBxs">
                                   {{item.name}}
                                </li>

                                <li  class="posBxs">
                                   {{item.phone}}
                                </li>

                                <li  class="posBxs">
                                  {{item.adress}}
                                </li> -->


              </ul>

              <div class="imgPosBot">
                <img :src="iconLsYellow" alt="">
              </div>
            </div>
          </el-amap-marker>


          <!-- <div v-for='(item,index2) in getCoord' :key="index2">
                  <el-amap-polygon :path="item" visible="true"  />
             </div> -->

          <el-amap-polygon :path="polygon.path" :visible="polygon.visible" :strokeColor='polygon.strokeColor'
            :zIndex='polygon.zIndex' />


          <!-- <div v-for="(item,indexAmap) in getCoord " :key='indexAmap'>
                     <div  v-for="(itemChild,indexChild) in item" :key="indexChild">
                          <el-amap-polygon :path="[itemChild.lng, itemChild.lat]" visible="true"  />
                        </div>                           
                     </div>  -->




        </div>

        <!--正常在线--->

        <div v-for="item  in newVals" :key="item.phone">
          <!--点-->
          <!-- <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :icon='iconLs'  @init="initMap"  reEventWhenUpdate='true' @click='clickMarker'></el-amap-marker> -->
          <!-- <el-amap-marker  v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :offset='offset' reEventWhenUpdate='true'    >显示名字。电话。位置-->
          <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng, item.lat]' reEventWhenUpdate='true'
            :topWhenClick='visible' :bubble='visible' :clickable='visible' animation='AMAP_ANIMATION_DROP' :extData='item'
            :events='eventsMarker.zcMarker'>
            <div class="mapMaker mapMakerZc" ref="mapMakerHeight">
              <ul>
                <li style="color:#01ec0c" v-if="item.name != '暂未上传名字'">
                  <span><img src="../assets/images/zcName.png" alt=""></span>
                  {{ item.name }}
                </li>

                <li style="color:#01ec0c" v-else>
                  <span><img src="../assets/images/zcTel.png" alt=""></span>
                  {{ item.phone }}
                </li>

                <!-- <li class="posBxs">
                                  {{item.name}}
                                </li>

                                <li  class="posBxs">
                                   {{item.phone}}
                                </li>

                                <li  class="posBxs">
                                  {{item.adress}}
                                </li> -->


              </ul>

              <div class="imgPosBot">
                <img :src="iconLs" alt="">
              </div>
            </div>
          </el-amap-marker>
          <!--信息窗体-->
          <!-- <el-amap-info-window
                      v-model="visible"
                      :position="[item.lng,item.lat]"
                      :offset='offset'
                    >
                      <div class="mapMaker">
                            <ul>
                                <li>
                                  <span>姓名：</span>
                                  小明{{index+1}}号
                                </li>

                                <li>
                                  <span>电话：</span>
                                  {{item.phone}}
                                </li>

                                <li>
                                  <span>位置：</span>
                                   {{item.adress}}
                                </li>


                            </ul>
                      </div>
                </el-amap-info-window> -->
        </div>
        <!--长时间未移动-->
        <div v-for="item in newVals_wyd" :key="item.phone">
          <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng, item.lat]' reEventWhenUpdate='true'
            :topWhenClick='visible' :bubble='visible' :clickable='visible' animation='AMAP_ANIMATION_DROP' :extData='item'
            :events='eventsMarker.csMarker'>
            <div class="mapMaker mapMakerLv" ref="mapMakerHeight">
              <ul>
                <li style="color:#1296db" v-if="item.name != '暂未上传名字'">
                  <span><img src="../assets/images/csName.png" alt=""></span>
                  {{ item.name }}
                </li>

                <li style="color:#1296db" v-else>
                  <span><img src="../assets/images/csTel.png" alt=""></span>
                  {{ item.phone }}
                </li>

                <!-- <li class="posBxs">
                                  {{item.name}}
                                </li>

                                <li  class="posBxs">
                                   {{item.phone}}
                                </li>

                                <li  class="posBxs">
                                  {{item.adress}}
                                </li> -->

              </ul>

              <div class="imgPosBot">
                <img :src="iconLsRed" alt="">
              </div>
            </div>
          </el-amap-marker>

        </div>
      </el-amap>
    </div><!--mapLeft-->

    <div class="mapRight">
      <mapRight></mapRight>
    </div><!--//mapRight-->

    <el-dialog title="实时在线的督导员" :visible.sync="centerDialogVisible" width="30%" custom-class="zcLine" center>

      <div class="superintendent">
        <p> <span><img src="../assets/images/ssName.png" alt=""></span>{{ proupSs.name }}</p>
        <p> <span><img src="../assets/images/ssTel.png" alt=""></span>{{ proupSs.tel }}</p>
        <p> <span><img src="../assets/images/ssAdress.png" alt=""></span>{{ proupSs.adress }}</p>
        <div v-for='(item, indexZb) in getCoord' :key='indexZb'>
          {{ item }}
        </div>

      </div>
    </el-dialog>


    <el-dialog title="正常在线的督导员" :visible.sync="centerDialogVisible_Zc" width="30%" custom-class="zcLine" center>

      <div class="superintendent">
        <p> <span><img src="../assets/images/zcName.png" alt=""></span>{{ proupZc.name }}</p>
        <p> <span><img src="../assets/images/zcTel.png" alt=""></span>{{ proupZc.tel }}</p>
        <p> <span><img src="../assets/images/zcAdress.png" alt=""></span>{{ proupZc.adress }}</p>

      </div>
    </el-dialog>

    <el-dialog title="长时间未移动的督导员" :visible.sync="centerDialogVisible_Cs" width="30%" custom-class="zcLine" center>

      <div class="superintendent">
        <p> <span><img src="../assets/images/csName.png" alt=""></span>{{ proupCs.name }}</p>
        <p> <span><img src="../assets/images/csTel.png" alt=""></span>{{ proupCs.tel }}</p>
        <p> <span><img src="../assets/images/csAdress.png" alt=""></span>{{ proupCs.adress }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mapRight from '../views/mapRight.vue'
import { point, hxdlocationFindAll } from '@/api/api'
import Bus from '../utils/eventBus'
import today from '@/utils/today'
export default {
  components: {
    mapRight
  },
  data() {
    const _that = this
    return {

      bxs: false,
      zoom: 13,
      visible: true,
      postFd: { top: 100, left: 120 },
      center: [104.679127, 31.467673],
      position: [104.674063, 31.467161],
      center2: [],
      offset: [-80, -125],//左  上
      iconLs: require('../assets/images/lvs.png'),
      iconLsRed: require('../assets/images/wydBlue.png'),
      iconLsYellow: require('../assets/images/ssYellow.png'),
      realTime: [],//实时
      newVals: [],//正常
      newVals_wyd: [],//未移动
      timer: null,
      viewMode: '3D', // 开启3D视图,默认为关闭
      centerDialogVisible: false, //点击坐标上的 显示，出现弹出层
      centerDialogVisible_Zc: false,
      centerDialogVisible_Cs: false,
      proupSs: {}, //实时弹窗显示的数据
      proupZc: {},//正常弹窗显示的数据
      proupCs: {},//长时弹窗显示的数据
      events: {//地图控件  放大缩小显示
        init(o) {
          o.plugin(['AMap.ControlBar', 'AMap.ToolBar'], () => { // ControlBar插件，文档：https://lbs.amap.com/api/javascript-api/guide/abc/plugins
            const ControlBar = new AMap.ControlBar({
              position: { top: '20px', right: '10px' }
            })
            o.addControl(ControlBar)
          })
        }
      },
      //marker 点击事件
      eventsMarker: {
        ssMarker: {
          init(m) {
            m.on('click', (e) => {
              //  let marker = JSON.stringify(e.target.w.content.innerText)
              // marker = marker.split('\\n'); 
              // _that.proupSs={
              //     name:marker[1],
              //     tel:marker[2],
              //     adress:marker[3].split('"')[0]
              // }
              let marker = e.target.w.extData
              _that.proupSs = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress
              }
              //   console.log(_that.aaa)
              _that.centerDialogVisible = true
            })
          }
        },
        zcMarker: {
          init(m) {
            m.on('click', (e) => {
              //  let marker = JSON.stringify(e.target.w.content.innerText)
              // marker = marker.split('\\n'); 
              // _that.proupZc={
              //     name:marker[1],
              //     tel:marker[2],
              //     adress:marker[3].split('"')[0]
              // }
              let marker = e.target.w.extData
              _that.proupZc = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress
              }
              //   console.log(_that.aaa)
              _that.centerDialogVisible_Zc = true
            })
          }
        },

        csMarker: {
          init(m) {
            m.on('click', (e) => {
              //  let marker = JSON.stringify(e.target.w.content.innerText)
              // marker = marker.split('\\n'); 
              // _that.proupCs={
              //     name:marker[1],
              //     tel:marker[2],
              //     adress:marker[3].split('"')[0]
              // }

              let marker = e.target.w.extData
              _that.proupCs = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress
              }
              _that.centerDialogVisible_Cs = true
            })
          }
        }

      },
      //
      polygon: {
        strokeColor: '#f00',
        zIndex: 1,
        visible: true,
        path: [["104.725457", "31.457455"], ["104.72542", "31.457472"], ["104.7254", "31.457424"], ["104.725509", "31.457397"], ["104.725482", "31.457353"], ["104.725362", "31.457456"], ["104.72538", "31.457454"], ["104.725384", "31.457574"], ["104.725437", "31.457597"], ["104.725404", "31.457465"], ["104.725462", "31.45754"], ["104.725404", "31.457582"], ["104.725486", "31.4574"], ["104.725517", "31.457616"], ["104.725464", "31.45757"], ["104.725263", "31.457345"], ["104.724516", "31.456999"], ["104.721548", "31.456697"], ["104.720869", "31.457019"], ["104.720749", "31.456614"], ["104.720765", "31.456614"], ["104.72068", "31.456638"], ["104.720711", "31.456619"], ["104.720749", "31.456622"], ["104.720757", "31.456616"], ["104.720772", "31.456616"], ["104.720757", "31.456616"], ["104.720757", "31.456616"], ["104.720772", "31.456608"], ["104.720765", "31.456614"], ["104.720765", "31.456614"], ["104.720749", "31.456618"], ["104.720742", "31.456619"], ["104.720757", "31.45661"], ["104.720765", "31.456614"], ["104.720757", "31.456616"], ["104.720772", "31.456614"], ["104.720757", "31.456616"], ["104.720765", "31.456612"], ["104.720749", "31.456616"], ["104.720757", "31.45661"], ["104.720742", "31.456621"], ["104.720749", "31.456612"], ["104.720604", "31.456663"], ["104.720536", "31.456687"], ["104.720772", "31.456612"], ["104.720772", "31.456614"], ["104.720757", "31.456614"], ["104.720757", "31.456614"], ["104.720749", "31.456603"], ["104.720749", "31.45662"], ["104.720765", "31.456603"], ["104.720749", "31.45661"], ["104.720765", "31.456612"], ["104.720757", "31.456612"], ["104.72108", "31.456893"], ["104.720742", "31.456619"], ["104.721288", "31.456193"], ["104.720734", "31.456619"], ["104.723516", "31.456718"], ["104.72544", "31.457738"], ["104.725966", "31.457971"], ["104.725287", "31.457747"], ["104.72534", "31.45767"], ["104.72532", "31.457585"], ["104.725404", "31.457605"], ["104.725405", "31.457624"], ["104.725495", "31.457667"], ["104.725408", "31.457579"], ["104.725301", "31.457716"]]
        // path: [["104.725457", "31.457455"], ["104.72542","31.457472"], ["104.7254","31.457424"], ["104.725509", "31.457397"]],
      },
      toDayTime: today(),//当天的时间
      getCoord: [],
    }
  },
  created() {
    Bus.$on('zcLnglat', (data) => {//获取正常督导员经纬度
      // console.log('1获取正常督导员经纬度')
      // console.log(data)
      this.newVals = data
    })

    Bus.$on('wydLnglat', (data) => {//未移动导员经纬度
      // console.log('2未移动督导员经纬度')
      // console.log(data)
      this.newVals_wyd = data
    })
  },

  mounted() {
    this.pointMap()
    this.timer = setInterval(() => {//每隔5分鐘刷新一次接口
      this.pointMap();
    }, 300000)



  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.$bus.$off('zcLnglat');//避免兄弟传值 执行2次$on
    this.$bus.$off('wydLnglat');//避免兄弟传值 执行2次$on
  },
  methods: {
    async pointMap() {
      let res = await point()
      let vals = Object.values(res)//对象转数组
      if (axios.waresofeLocation !== '总公司') {
        console.log(111)
        console.log(vals)
        vals = vals.filter(item => item.indexOf(axios.waresofeLocation !== '涪城' && axios.waresofeLocation !== '安州' ? '四川省' + axios.waresofeLocation : axios.waresofeLocation) > -1)
      }
      console.log(vals)
      let newValss = vals.map((item, index) => {
        return {
          adress: item.split('&')[0].split('省')[1],
          lat: parseFloat(item.split('&')[1]),
          lng: parseFloat(item.split('&')[2]),
          name: item.split('&')[3] == undefined || item.split('&')[3] == null ? '暂未上传名字' : item.split('&')[3],
          phone: Object.keys(res)[index]//对象转数组
        }
      })

      this.realTime = newValss.filter(item => {
        if (item.adress != 'null') {
          return item
        }
      })
      //获取用户的轨迹
      let track = this.realTime
      let filterSz = [];
      track.map(item => {
        hxdlocationFindAll({ phone: item.phone, dats: today() }).then(res => {
          if (res.length != 0) {
            let c = res.map(item => {
              let locationinfo = item.locationinfo  //使用管理replace 就不需要使用JSON.stringify()
              let filterSz = locationinfo.replace(/\//g, '').split('&') //                            
              // return  {
              //         lng:filterSz[2],
              //         lat:filterSz[1]
              //       }

              return [
                filterSz[2],
                filterSz[1]
              ]
            })

            this.getCoord.push(c)
          }
        })

      })

      console.log(this.getCoord)

      //      console.log(JSON.stringify(filterSz))
      // setTimeout(()=>{
      //  
      //   console.log(  this.getCoord)
      //       // filterSz.map(item=>{
      //       //    console.log(item)
      //       // })
      // },1000)


    },


    initMap(map) {
      console.log('init map: ', map);
    },

    clickMarker(e) {
      alert('12312321321')
    }

  }

}
</script>
<style lang="scss">
.mapContent {
  position: relative;
  background: #fcf9f2;
}

.mapLeft {
  width: calc(100% - 300px);
}

#amapDemo {
  width: 100%;
  height: 100vh;
}

.mapMaker {
  width: 150px;
  padding: 5px;
  border-radius: 5px;
  background: #fff;

  &.mapMakerSs {
    animation: animated-border-yellow 1.5s infinite
  }

  &.mapMakerZc {
    animation: animated-border 1.5s infinite;
  }

  &.mapMakerLv {
    animation: animated-border-lv 1.5s infinite;
  }

  position: relative;

  .imgPosBot {
    position: absolute;
    bottom: -35px;
    left: 50%;
    margin: 0 0 0 -12.5px;
    animation: upDown 1.5s infinite;

    >img {
      width: 20px;
      height: 25px;
    }
  }

  ul {
    position: relative;

    li {
      font-size: 14px;
      text-align: left;
      padding: 2px 0;

      span {
        display: inline-block;
        width: 20px;
        text-align: right;

        >img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
      }

      &.posBxs {
        position: absolute;
        top: -100000px;
        opacity: 0;
      }
    }
  }
}

//mapMaker

.amap-icon>img {
  width: 20px;
  height: 25px;
  object-fit: fill;
}

.mapRight {
  width: 300px;
  position: absolute;
  top: 0;
  right: 0;
}

.superintendent {
  >p {
    padding: 5px 0;
    font-size: 18px;

    >span {
      vertical-align: middle;
      margin: 0 10px 0 0;

      >img {
        width: 25px;
        height: 25px;
      }
    }
  }
}

// .zcLine{ border:1px solid #f00; border-radius: 10px;}</style>