<template>
  <div class="mapHeight">
    <!--实时在线的人员-->
    <div
      class="styleCss normal"
      :style="{ backgroundImage: `url(${borderImg})` }"
    >
      <div class="styleCssTitle">
        <img src="../assets/images/icon-status-normal.svg" alt="" /> <span>实时在线的人员</span>
        <em v-if="realTime.length" class="onlineStyle"
          ><em style="color: #01ec0c">{{ realTime.length }}</em
          >人</em
        >
      </div>
      <div class="zcNormal zcline">
        <div class="zcNormaltitle">
          <span>姓名</span>
          <span>电话号码</span>
        </div>
        <AutoScroll
          :data="realTime"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl" v-if="realTime.length">
            <li v-for="(item, index) in realTime" :key="index * 0.1">
              <span>{{ item.name === "noname" ? "-" : item.name }}</span>
              <span>{{ item.phone }}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
      <!--/zcNormal-->
    </div>
    <!--/styleCss-->

    <div
      class="styleCss normal"
      :style="{ backgroundImage: `url(${borderImg2})` }"
    >
      <div class="styleCssTitle bzDcolor">
        <img src="../assets/images/icon-person-off-duty.svg" alt="" /> <span>离岗人员</span>
        <em v-if="absent.length" class="onlineStyle"
          ><em style="color: #ff0000">{{ absent.length }}</em
          >人</em
        >
      </div>

      <div class="zcNormal bzdTimeline">
        <div class="zcNormaltitle">
          <span>电话</span>
          <span>姓名</span>
          <span>距定点</span>
        </div>
        <AutoScroll
          :data="absent"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl" v-if="absent.length">
            {{
              item
            }}
            <li v-for="(item, index) in absent" :key="index * 0.1">
              <span>{{ item.tel }}</span>
              <span>{{ item.name }}</span>
              <span>{{ item.distance }}米</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
    </div>

    <!--长时间不移动人员-->
    <div
      v-show="false"
      class="styleCss normal"
      :style="{ backgroundImage: `url(${borderImg})` }"
    >
      <div class="styleCssTitle longTimecolor">
        <img src="../assets/images/icon-person-stationary.svg" alt="" />
        <span>长时间不移动人员</span>
        <em v-if="longTime.length" class="onlineStyle"
          ><em style="color: #f75d00">{{ longTime.length }}</em
          >人</em
        >
      </div>

      <div class="zcNormal longTimeline">
        <div class="zcNormaltitle">
          <span>电话号码</span>
          <span>姓名</span>
          <span>回传数据次数</span>
        </div>

        <AutoScroll
          :data="longTime"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl" v-if="longTime.length">
            <li v-for="(item, index) in longTime" :key="index * 0.1">
              <span>{{ item.tel }}</span>
              <span>{{ item.name }}</span>

              <span>{{ item.infoflag }}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
    </div>

    <!--总注册人员人数-->
    <!-- <div class="styleCss normal "  :style="{backgroundImage:`url(${borderImg2})`}">
                <div class="styleCssTitle ss" >
                    <img src="../assets/images/icon-person-registered.svg" alt=""> <span>总注册人员人数</span>
                    <em v-if="normalLis.length" class="onlineStyle"><em style="color:#0000f2">{{normalLis.length}}</em>人</em>
                </div>
               <div class="zcNormal ssline ">
                      <div class="zcNormaltitle">
                         <span>姓名</span>
                         <span>电话号码</span>
                      </div>
                       <AutoScroll :data="normalLis" :class-option="classOption" class="seamless-warp">  
                        <ul class="zcUl" v-if="normalLis.length">
                            <li  v-for="(item,index) in normalLis" :key="index*0.3">
                                <span v-if="item.username!=null">{{item.username}}</span>
                               <span v-else>暂未填写名字</span>
                                <span>{{item.userphone}}</span>
                            </li>
                        </ul>

                        <div v-else class="zwData">暂无</div>
                        </AutoScroll>
                        
               </div>
          </div> -->

    <!-- <div class="styleCss normal" :style="{backgroundImage:`url(${borderImg3})`}">
      <div class="styleCssTitle wsx">
        <img src="../assets/images/icon-person-abnormal.svg" alt=""> <span>数据异常人员</span>
        <em v-if="workerstatusDeny.length" class="onlineStyle"><em style="color:#d81e06">{{workerstatusDeny.length}}</em>人</em>
      </div>
      <div class="zcNormal wsxLine">
        <div class="zcNormaltitle">
          <span>姓名</span>
          <span>电话号码</span>
        </div>

        <AutoScroll :data="workerstatusDeny" :class-option="classOption" class="seamless-warp">
          <ul class="zcUl" v-if="workerstatusDeny.length">
            <li v-for="(item,index) in workerstatusDeny" :key="index*0.4">
              <span>{{item.username}}</span>
              <span>{{item.userphone}}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
    </div> -->

    <div class="styleCss normal" v-show="yc">
      <div class="styleCssTitle wyd">
        <img src="../assets/images/icon-person-not-moving.svg" alt="" />
        <span>超过15分钟未移动人员</span>
        <em v-if="workerstatusStay.length" class="onlineStyle"
          ><em style="color: #1296db">{{ workerstatusStay.length }}</em
          >人</em
        >
      </div>
      <div class="zcNormal wydline">
        <div class="zcNormaltitle">
          <span>姓名</span>
          <span>电话号码</span>
        </div>
        <AutoScroll
          :data="workerstatusStay"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl" v-if="workerstatusStay.length">
            <li v-for="(item, index) in workerstatusStay" :key="index * 0.5">
              <span>{{ item.name }}</span>
              <span>{{ item.phone }}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无长时间未移动的人员</div>
        </AutoScroll>
      </div>
      <!--/zcNormal-->
    </div>
    <!--/styleCss-->

    <!--长时间不移动人员-->
    <el-dialog
      title="长时间不移动人员"
      v-model="longtimeProup"
      width="500px"
      center
      :modal-append-to-body="false"
    >
      <div class="superintendent">
        <!-- <p>
                            <span><img src="../assets/images/icon-online-name.png" alt="" /></span
                            >{{ proupSs.name }}
                            </p>-->
        <p>
          <span><img src="../assets/images/icon-stationary-phone.png" alt="" /></span
          >{{ noDataPoint.tel }}
        </p>
        <!-- <p>
          <span><img src="../assets/images/icon-stationary-address.png" alt="" /></span>{{ noDataPoint.adress }}
        </p> -->

        <p v-if="noDataPoint.username">
          姓名:<em style="color: #f75d00; font-style: normal">
            {{ noDataPoint.username || "-" }}</em
          >
        </p>
        <p>
          回传数据次数:<em style="color: #f75d00; font-style: normal">
            {{ noDataPoint.infoflag }}</em
          >
        </p>
      </div>
    </el-dialog>

    <!--当前不在点位人员-->
    <el-dialog
      title="当前不在点位人员"
      v-model="bzdProup"
      width="500px"
      center
      :modal-append-to-body="false"
    >
      <div class="superintendent">
        <!-- <p>
                            <span><img src="../assets/images/icon-online-name.png" alt="" /></span
                            >{{ proupSs.name }}
                            </p>-->
        <p>
          <span><img src="../assets/images/icon-off-duty-phone.png" alt="" /></span
          >{{ noDataPoint.tel }}
        </p>
        <p>
          <span><img src="../assets/images/icon-off-duty-address.png" alt="" /></span
          >{{ noDataPoint.adress }}
        </p>
        <p>
          距离定点位置距离:<em style="color: #ff0000; font-style: normal">
            {{ noDataPoint.distance }}</em
          >米
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  notInLoaction,
  workerstatusStaytime,
  workerstatusNormal,
  workerstatusDeny,
  workerstatusStay,
  getRealLocationList,
  findAllTodayfault,
  notNormalWorkers,
  botOnLine,
  hxduserfindAll,
  findAllToday,
} from "@/api/api";
import dayjs from "dayjs";
import axios from "@/utils/request";
import { getBMapGL } from "@/utils/baiduMap";
import { getRegionKeyword } from "@/utils/mapConfig";
const assetUrl = (name) =>
  new URL(`../assets/images/${name}`, import.meta.url).href;
export default {
  props: ["getCurrent", "localtion"],
  inject: {
    baiduMapRef: {
      default: null,
    },
  },
  data() {
    return {
      bzdProup: false,
      longtimeProup: false,
      noDataPoint: {},
      absent: [], //不在点位
      longTime: [], // 长时间不移动
      yc: false,
      realTime: [], //实时
      normalLis: [],
      workerstatusDeny: [],
      workerstatusStay: [],
      timer: null,
      requestSeq: {
        absent: 0,
        staytime: 0,
        point: 0,
      },
      absentpoint: null,
      longtimepoint: null,
      borderImg: assetUrl("panel-border-green.png"),
      borderImg2: assetUrl("panel-border-blue.png"),
      borderImg3: assetUrl("panel-border-red.png"),
      iconLOrange: assetUrl("marker-person-stationary-label.png"),
      zbLsRed: assetUrl("marker-person-off-duty.png"),
      zbLsOrange: assetUrl("marker-person-stationary.png"),
      iconLsRed: assetUrl("marker-person-off-duty-label.png"),
    };
  },
  computed: {
    classOption() {
      return {
        step: 0.25, // 数值越大速度滚动越快
        limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
        absentpoint: null,
        longtimepoint: null,
      };
    },
  },
  mounted() {
    this.refreshPanelData(this.localtion);
    this.startRefreshTimer();
  },
  beforeUnmount() {
    this.stopRefreshTimer();
  },
  methods: {
    getMap() {
      return this.baiduMapRef?.value || this.baiduMapRef || this.$parent?.map;
    },
    ensureMarkerIcons() {
      const BMap = getBMapGL();
      if (!BMap) {
        return false;
      }

      if (!this.absentpoint) {
        this.absentpoint = new BMap.Icon(this.zbLsRed, new BMap.Size(18, 30));
      }

      if (!this.longtimepoint) {
        this.longtimepoint = new BMap.Icon(
          this.zbLsOrange,
          new BMap.Size(18, 30),
        );
      }

      return true;
    },
    startRefreshTimer() {
      this.stopRefreshTimer();
      this.timer = setInterval(() => {
        if (document.hidden) {
          return;
        }

        this.refreshPanelData(this.localtion);
      }, 300000);
    },
    stopRefreshTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    refreshPanelData(name) {
      this.getWorkerstatusDeny();
      this.getNotInLoaction(name || this.localtion);
      this.getWorkerstatusStaytime(name || this.localtion);
      this.pointMap(name || this.localtion);
    },
    getWorkerstatusStaytime(name) {
      //长时间不移动人员  橙色
      const region = name || this.localtion || axios.waresofeLocation;
      const requestId = ++this.requestSeq.staytime;

      workerstatusStaytime({
        start: dayjs().format("YYYY-MM-DD"),
        disname: region,
      }).then((res) => {
        if (requestId !== this.requestSeq.staytime) {
          return;
        }

        this.longTime = res
          .map((item, index) => {
            console.log(item);
            if (item.userrule) {
              return {
                lat: item.userrule.split("-")[0],
                lng: item.userrule.split("-")[1],
                tel: item.userphone,
                name: item.username,
                infoflag: item.infoflag,
                username: item.username,
              };
            }
          })
          .filter((item) => item);

        this.longTime.map((item) => {
          //创建长时间不移动人员的坐标点
          const map = this.getMap();
          if (!map || !this.ensureMarkerIcons()) {
            return;
          }
          const BMap = getBMapGL();
          let pt = new BMap.Point(item.lng, item.lat),
            marker = new BMap.Marker(pt, { icon: this.longtimepoint });
          map.addOverlay(marker);
          // let content2 = "";//创建坐标点上的 浮层
          // content2 = `<p class='labelW' onclick='longtimePoint(${JSON.stringify(item)})'><img style='width:25px; height:25px' src='${this.iconLOrange}'/><span>${item.username ?item.username :item.tel}</span></p>`
          let opts2 = {
            position: new BMap.Point(item.lng, item.lat), // 指定文本标注所在的地理位置
            offset: new BMap.Size(0, -60), // 设置文本偏移量
          };
          // let label2 = new BMapGL.Label(content2, opts2)
          // label2.setStyle({
          //   color: "#f75d00",
          //   fontSize: "14px",
          //   height: "24px",
          //   padding: '5px 6px',
          //   borderRadius: '5px',
          //   border: "1px solid rgba(255,255,255)",
          //   background: "rgba(255,255,255)",
          //   fontWeight: "bold",
          //   transform: 'translateX(-50%)',
          //   fontFamily: "微软雅黑",
          // });
          marker.addEventListener("click", function () {
            window.longtimePoint(item);
          });
          window.longtimePoint = (info) => {
            console.log(info);
            this.longtimeProup = true;
            this.noDataPoint = {
              tel: info.tel,
              infoflag: info.infoflag,
              name: info.name,
            };
          };
        });
      });
    },
    getNotInLoaction(name) {
      //红色
      const region = name || this.localtion || axios.waresofeLocation;
      const requestId = ++this.requestSeq.absent;

      notInLoaction({
        start: dayjs().format("YYYY-MM-DD"),
        disname: region,
      }).then((res) => {
        if (requestId !== this.requestSeq.absent) {
          return;
        }

        console.log("gtNO", res);
        if (Object.keys(res).length) {
          let vals = Object.values(res); //对象转数组
          const regionKeyword = getRegionKeyword(region);
          if (regionKeyword) {
            vals = vals.filter((item) => item.indexOf(regionKeyword) > -1);
          }
          this.absent = vals
            .map((item, index) => {
              let newarr = item.split("&");
              //  console.log('newarr' + newarr)
              return {
                distance: parseFloat(newarr[0]).toFixed(2),
                adress: newarr[1],
                name: newarr[4],
                lat: newarr[2],
                lng: newarr[3],
                tel: Object.keys(res)[index],
              };
            })
            .filter((item2) => item2);
          //   console.log(this.absent)
          this.absent.map((item) => {
            //创建当前不在点位人员的坐标点
            console.log(item);
            const map = this.getMap();
            if (!map || !this.ensureMarkerIcons()) {
              return;
            }
            const BMap = getBMapGL();
            let pt = new BMap.Point(item.lng, item.lat),
              marker = new BMap.Marker(pt, { icon: this.absentpoint });
            map.addOverlay(marker);

            // let content = "";//创建坐标点上的 浮层
            // content = `<p class='labelW' onclick='noAbsentPoint(${JSON.stringify(item)})'><img style='width:25px; height:25px' src='${this.iconLsRed}'/><span>${item.name ? item.name : item.tel}</span></p>`
            // let opts = {
            //   position: new BMapGL.Point(item.lng, item.lat), // 指定文本标注所在的地理位置
            //   offset: new BMapGL.Size(0, -60) // 设置文本偏移量
            // };
            // let label1 = new BMapGL.Label(content, opts)
            // label1.setStyle({
            //   color: "#f00",
            //   fontSize: "14px",
            //   height: "24px",
            //   padding: '5px 6px',
            //   borderRadius: '5px',
            //   border: "1px solid rgba(255,255,255)",
            //   background: "rgba(255,255,255)",
            //   fontWeight: "bold",
            //   transform: 'translateX(-50%)',
            //   fontFamily: "微软雅黑"
            // });

            window.noAbsentPoint = (info) => {
              this.bzdProup = true;
              this.noDataPoint = {
                tel: info.tel,
                adress: info.adress,
                distance: info.distance,
                name: info.name,
              };
            };
          });
        } else {
          this.absent = [];
        }

        // console.log('newsArr', res)
      });
    },
    async pointMap(name) {
      //实时的暂时隐藏

      const region = name || this.localtion || axios.waresofeLocation;
      const requestId = ++this.requestSeq.point;
      let list = await getRealLocationList({ disname: region });
      if (requestId !== this.requestSeq.point) {
        return;
      }

      const regionKeyword = getRegionKeyword(region);
      if (regionKeyword) {
        list = list.filter((item) => item.raw.includes(regionKeyword));
      }

      this.realTime = list.filter((item) => {
        if (item.adress != "null") {
          return item;
        }
      });

      //   console.log(this.realTime, 'this.realTime')
    },

    // getToDay() {//查看当天的的。实时的暂时隐藏
    //   findAllToday().then(res => {
    //     let vals = Object.values(res); //对象转数组
    //     let newValss = vals.map((item, index) => {
    //       return {
    //         adress: item.split("&")[1].split("省")[1],
    //         lat: parseFloat(item.split("&")[2]),
    //         lng: parseFloat(item.split("&")[3]),
    //         name:
    //           item.split("&")[0] == 'noname' || item.split("&")[0] == null
    //             ? "暂未上传名字"
    //             : item.split("&")[0],
    //         phone: Object.keys(res)[index], //对象转数组
    //       };
    //     });

    //     this.realTime = newValss.filter((item) => {
    //       if (item.adress != "null") {
    //         return item;
    //       }
    //     });
    //   })
    // },
    getWorkerstatusNormal() {
      //注册的人员
      workerstatusNormal().then((res) => {
        let vals = Object.values(res); //获取key
        this.normalLis = vals.map((item, index) => {
          //正常在线
          let newLis = item.split("&");
          //  console.log(newLis)
          return {
            name: newLis[0],
            adress: newLis[1],
            lat: parseFloat(newLis[2]),
            lng: parseFloat(newLis[3]),
            phone: Object.keys(res)[index],
          };
        });

        hxduserfindAll().then((res) => {
          //  if(res.length){
          //      let a =  res.map(item=>{
          //            if(item.username!=null){
          //               return  item
          //            }
          //        }).filter(item2=>item2)
          //        this.normalLis=a
          //    }

          if (res.length) {
            this.normalLis = res;
          }
        });
      });
    },
    getWorkerstatusDeny() {
      //异常人员
      notNormalWorkers({ disname: this.localtion }).then((res) => {
        //   let tels =Object.values(res);//获取key
        //   let telsLis=  tels.map((item,index)=>{
        //       return {
        //           userphone:item,
        //           username:Object.keys(res)[index]
        //       }
        //   })
        let telsLis = res.map((item, index) => {
          return {
            userphone: item.userphone,
            username: item.username,
          };
        });
        this.workerstatusDeny = telsLis;
      });
      //   findAllTodayfault().then(res=>{
      //    console.log(res)
      //        if(res.length){
      //          let a =  res.map(item=>{
      //                if(item.username!=null){
      //                   return  item
      //                }
      //            }).filter(item2=>item2)
      //            this.workerstatusDeny=a

      //        }
      //   })
    },
    getWorkerstatusStay() {
      //长时间未移动的人员
      workerstatusStay({ disname: this.localtion }).then((res) => {
        // console.log('123',res)
        let vals = Object.values(res); //获取key
        this.workerstatusStay = vals.map((item, index) => {
          let newLis = item.split("&");
          // console.log(newLis)
          return {
            name: newLis[0],
            adress: newLis[1],
            lat: parseFloat(newLis[2]),
            lng: parseFloat(newLis[3]),
            phone: Object.keys(res)[index],
          };
        });
      });
    },
  },
};
</script>

<style lang="scss">
// .mapHeight{  height:calc( 100vh - 70px); display: flex ;  justify-content: center; align-items: center; flex-flow: wrap; margin: 70px 0 0 0;}
.mapHeight {
  display: flex;
  flex-direction: column;
  gap: 22px;
  height: calc(100vh - 104px);
  margin: 0;
  padding: 0 4px;
  overflow: hidden;
}

.seamless-warp {
  max-height: 112px;
  overflow: hidden;
}

.styleCss {
  box-sizing: border-box;
  flex: 0 0 auto;
  width: 100%;
  min-height: 132px;
  margin: 0;
  padding: 4px 3px 8px;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .styleCssTitle {
    text-align: left;
    display: flex;
    align-items: center;
    min-height: 30px;
    padding: 8px 12px 0;
    margin: 0 0 4px;
    position: relative;

    > img {
      width: 1.5rem;
      height: 1.5rem;
    }

    > span {
      font-size: 14px;
      color: #01ec0c;
      margin: 0 0 0 0.4rem;
      font-weight: 800;
      text-shadow: 0 1px 4px #fff;
    }

    > em {
      position: absolute;
      top: 8px;
      right: 14px;
    }

    &.wsx {
      > span {
        color: #d81e06;
      }
    }

    &.wyd {
      > span {
        color: #1296db;
      }
    }

    &.ss {
      > span {
        color: #0000f2;
      }
    }

    &.longTimecolor {
      > span {
        color: #f75d00;
      }
    }

    &.bzDcolor {
      > span {
        color: #ff0000;
      }
    }

    &.lvs {
      > span {
        color: #409eff;
      }
    }
  }

  .zcNormal {
    box-shadow: 0 2px 15px #e2e2e2;
    background: rgba(255, 255, 255, 0.6);
    min-height: 84px;
    overflow: hidden;

    &.zcline {
      .zcNormaltitle {
        border-bottom: 1px solid #01ec0c;
        background: #01ec0c;
      }

      li {
        & > span {
          color: #01ec0c;
        }
      }
    }

    &.ssline {
      .zcNormaltitle {
        background: #0000f2;
      }

      li {
        & > span {
          color: #0000f2;
        }
      }
    }

    &.wsxLine {
      .zcNormaltitle {
        background: #d81e06;
      }

      li {
        & > span {
          color: #d81e06;
        }
      }
    }

    &.wydline {
      .zcNormaltitle {
        background: #1296db;
      }

      li {
        & > span {
          color: #1296db;
        }
      }
    }

    &.longTimeline {
      .zcNormaltitle {
        background: #f75d00;
      }

      li {
        & > span {
          color: #f75d00;
        }
      }
    }

    &.bzdTimeline {
      .zcNormaltitle {
        background: #ff0000;
      }

      li {
        & > span {
          color: #ff0000;
        }
      }
    }

    .zcNormaltitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 27px;
      padding: 0;

      span {
        font-size: 0.8rem;
        display: inline-block;
        width: 50%;
        text-align: center;
        color: #fff;
        white-space: nowrap;
      }
    }

    .zcUl {
      > li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 28px;
        border-top: 1px solid #efefef;

        > span {
          font-size: 0.8rem;
          display: inline-block;
          width: 50%;
          text-align: center;
          white-space: nowrap;
        }
      }
    }
  }

  //zcNormal
}

.mapRight {
  .mapHeight {
    box-sizing: border-box;
    gap: 18px;
    padding: 248px 4px 0;
  }

  .styleCss {
    min-height: 150px;
  }

  .zcNormal {
    min-height: 96px;
  }

  .seamless-warp {
    max-height: 96px;
  }
}

.bzdTimeline {
  .zcNormaltitle span,
  .zcUl > li > span {
    width: 28%;

    &:last-child {
      width: 44%;
    }
  }
}

.zwData {
  padding: 34px 0;
  text-align: center;
}

.onlineStyle {
  font-style: normal;
  margin: 0 0 0 1rem;

  > em {
    font-size: 20px;
    font-weight: 800;
    margin: 0 5px;
  }
}
</style>
