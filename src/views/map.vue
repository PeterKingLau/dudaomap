<template>
  <div class="mapContent">
    <!--头部-->
    <div class="headerTitle" :style="{ backgroundImage: `url(${bgImg})` }">
      <div>工作人员和督导员在线管理</div>
      <span class="timeAnim1"></span>
      <span class="timeAnim2"></span>
      <span class="timeAnim3"></span>
      <span class="timeAnim4"></span>
    </div>
    <div class="mapLeft mapLeftHeight">
      <div v-show="elAmap" class="mapLeftHeight" id="container"></div>
      <!--主页第一层地图-->
      <div v-show="superintendentMap" class="mapLeftHeight" id="superintendent"></div>
    </div>
    <!--/mapLeft-->

    <div class="mapRight">
      <mapRight ref="rightMapRef" :localtion.sync="localtion" :getCurrent="currenIndex"></mapRight>
    </div>
    <!--//mapRight-->

    <!--左边 当前不在点位督导员，长时间不移动督导员-->
    <div class="leftPos">
      <mapLeft @changeDisname="initRightTable" :getCurrent="currenIndex" :localtion.sync="localtion" ref="leftMethods">
      </mapLeft>
    </div>
    <!--leftPos-->

    <!--地图不在点位，长时间不移动，实时在线的督导员切换 -->
    <!-- <div class="fixedBottom">
      <ul>
        <li class="item" v-for="(item,index) in listFixBot" :key="index">
          <div @click="lookMap(index)" :class="index ==currenIndex?'active':''">{{item}}</div>
        </li>

      </ul>
    </div> -->

    <el-dialog title="实时在线的督导员" :visible.sync="centerDialogVisible" width="500px" custom-class="zcLine" center>
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/zcName.png" alt="" /></span>{{ proupSs.name }}
        </p>
        <p>
          <span><img src="../assets/images/zcTel.png" alt="" /></span>{{ proupSs.tel }}
        </p>
        <p>
          <span><img src="../assets/images/zcAdress.png" alt="" /></span>{{ proupSs.adress }}
        </p>
        <p>
          <span><img src="../assets/images/zcTrack.png" alt="" /> </span>
          <em class="history" style="color: #01ec0c" @click="lookHistory">查看历史轨迹线</em>
        </p>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="centerDialogVisible_Zc" width="30%" custom-class="zcLine" center>
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/zcName.png" alt="" /></span>{{ proupZc.name }}
        </p>
        <p>
          <span><img src="../assets/images/zcTel.png" alt="" /></span>{{ proupZc.tel }}
        </p>
        <p>
          <span><img src="../assets/images/zcAdress.png" alt="" /></span>{{ proupZc.adress }}
        </p>
        <p>
          <span><img src="../assets/images/zcTrack.png" alt="" /> </span>
          <em class="history" style="color: #01ec0c" @click="lookHistory">查看历史轨迹线</em>
        </p>
      </div>
    </el-dialog>

    <el-dialog title="长时间未移动的督导员" :visible.sync="centerDialogVisible_Cs" width="30%" custom-class="zcLine" center>
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/csName.png" alt="" /></span>{{ proupCs.name }}
        </p>
        <p>
          <span><img src="../assets/images/csTel.png" alt="" /></span>{{ proupCs.tel }}
        </p>
        <p>
          <span><img src="../assets/images/csAdress.png" alt="" /></span>{{ proupCs.adress }}
        </p>
        <p>
          <span><img src="../assets/images/csTrack.png" alt="" /> </span>
          <em class="history" style="color: #1296db" @click="lookHistory">查看历史轨迹线</em>
        </p>
      </div>
    </el-dialog>

    <!--查看轨迹弹窗显示-->
    <el-dialog title="请选择时间查询历史轨迹" :visible.sync="historyTrack" width="500px" custom-class="zcLine" center>
      <div class="superintendent">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="电话号码">
            <el-input v-model="proupSs.tel" readonly="readonly"></el-input>
          </el-form-item>

          <el-form-item label="选择日期" prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date" style="width: 100%"></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              v-loading.fullscreen.lock="fullscreenLoading">查找</el-button>
          </el-form-item>
        </el-form>
        <div class="trackLine" v-show="tsTrack">
          <i class="el-icon-warning-outline"></i> 暂无当前时间段督导员的轨迹线
        </div>
      </div>
      <!--/superintendent-->
    </el-dialog>
  </div>
</template>

<script>
import mapRight from "../views/mapRight.vue";
import mapLeft from "../views/mapLeft.vue";
import axios from "@/utils/request";
import { point, hxdlocationFindAll, findAllToday,getDeviceInfo } from "@/api/api";
import Bus from "../utils/eventBus";
import today from "@/utils/today";
import { filterTime } from "@/utils/today.js";
let mapObj = {
          涪城: [104.679127, 31.467673],
          总公司: [104.679127, 31.467673],
          广汉: [104.28249, 30.97706],
          安州: [104.56735, 31.45475],
          南充: [106.118889, 30.781529],
          射洪: [105.38836, 30.87113],
        };
export default {
  components: {
    mapRight,
    mapLeft,
  },
  data() {
    const _that = this;

    return {
      listFixBot: ["当前不在点位的督导员", "长时间不移动的督导员", "实时在线的督导员"],
      currenIndex: -1,
      bgImg: require("../assets/images/ddytitle.png"),
      trackElamap: false, //单个指定督导员显示
      zoom: 13,
      visible: true,
      postFd: { top: 100, left: 120 },
      center: [104.679127, 31.467673],
      position: [104.674063, 31.467161],
      center2: [],
      offset: [0, -40], //左  上
      iconLs: require("../assets/images/lvs.png"),

      iconLsYellow: require("../assets/images/lvs.png"),
      realTime: [], //实时
      newVals: [], //正常
      newVals_wyd: [], //未移动
      timer: null,
      viewMode: "3D", // 开启3D视图,默认为关闭
      centerDialogVisible: false, //点击坐标上的 显示，出现弹出层
      centerDialogVisible_Zc: false,
      centerDialogVisible_Cs: false,
      proupSs: {}, //实时弹窗显示的数据
      proupZc: {}, //正常弹窗显示的数据
      proupCs: {}, //长时弹窗显示的数据

      toDayTime: today(), //当天的时间
      getCoord: [], //轨迹线
      historyTrack: false, // 历史轨迹输入弹出层
      ruleForm: {
        date: "",
      },
      rules: {
        date: [{ required: true, message: "请输选择日期", trigger: "blur" }],
      },
      fullscreenLoading: false, //点击查找触发加载层

      assignTrack: [], //指定人员的轨迹线

      //实时在线 20230428改百度地图
      elAmap: true, //所有督导员显示的地图\
      superintendentMap: false, //指定督导员显示
      map: "", //地图页面全局
      duMap: "", //指定督导员显示的地图 页面全局
      point: "", //点页面全局
      duPoint: "", //指定督导员点
      realtimeIco: "", //创建实时坐标图片 实时在线督导
      localtion: axios.waresofeLocation,
      realOnLine: {
        nameIco: require("../assets/images/zcName.png"),
        telIco: require("../assets/images/zcTel.png"),
        adressIco: require("../assets/images/zcAdress.png"),
        trackIco: require("../assets/images/zcTrack.png"),
      },
      tsTrack: false, //没有轨迹线提示
    };
  },
  created() {
    Bus.$on("zcLnglat", (data) => {
      //获取正常督导员经纬度
      this.newVals = data;
    });

    Bus.$on("wydLnglat", (data) => {
      //未移动导员经纬度
      this.newVals_wyd = data;
    });
  },

  mounted() {
    //
    this.pointMap(this.localtion);
    //百度地图原生 全部
    if (this.elAmap) {
      this.map = new BMapGL.Map("container");
      // 绵阳 104.679127, 31.467673
      // 广汉 104.282490, 30.977060
      // let mapObj = {
      //   涪城: [104.679127, 31.467673],
      //   总公司: [104.679127, 31.467673],
      //   广汉: [104.28249, 30.97706],
      //   南充: [106.118889, 30.781529],
      //   安州: [104.56735, 31.45475],
      //   射洪: [105.38836, 30.87113],
      // };
      console.log(mapObj[axios.waresofeLocation]);
      this.point = new BMapGL.Point(...mapObj[axios.waresofeLocation]); //地图中心点
      this.map.centerAndZoom(this.point, axios.waresofeLocation === "总公司" ? 5 : 15);
      this.map.enableScrollWheelZoom(true); //鼠标滚轮缩放
      this.realtimeIco = new BMapGL.Icon(this.iconLs, new BMapGL.Size(18, 30)); //创建实时在线坐标图片

      // let navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
      // this.map.addControl(navi3DCtrl);
      // let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
      //  this.map.addControl(zoomCtrl);
    }

    //循环创建实时在线督导员的点
    this.timer = setInterval(() => {
      //每隔5分鐘刷新一次接口
      this.pointMap(this.localtion);
      this.map.clearOverlays();
    }, 300000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    }); //防止setInterval多次请求
  },
  // beforeDestroy() {
  //   // clearInterval(this.timer);
  //   this.$bus.$off("zcLnglat"); //避免兄弟传值 执行2次$on
  //   this.$bus.$off("wydLnglat"); //避免兄弟传值 执行2次$on
  // },
  methods: {
    initMapA(name) {
      name = name || axios.waresofeLocation;
      this.pointMap(name);
      //百度地图原生 全部
      console.log(this.elAmap);
      if (this.elAmap) {
        this.map = new BMapGL.Map("container");
        // 绵阳 104.679127, 31.467673
        // 广汉 104.282490, 30.977060
 
        console.log(mapObj[name]);
        this.point = new BMapGL.Point(...mapObj[name]); //地图中心点
        this.map.centerAndZoom(this.point, name === "总公司" ? 5 : 15);
        this.map.enableScrollWheelZoom(true); //鼠标滚轮缩放
        this.realtimeIco = new BMapGL.Icon(this.iconLs, new BMapGL.Size(18, 30)); //创建实时在线坐标图片

        // let navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
        // this.map.addControl(navi3DCtrl);
        // let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        //  this.map.addControl(zoomCtrl);
      }

      //循环创建实时在线督导员的点
      this.timer = setInterval(() => {
        //每隔5分鐘刷新一次接口
        this.pointMap(name);
        this.map.clearOverlays();
      }, 300000);
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.timer);
      }); //防止setInterval多次请求
    },
    lookMap(index) {
      /**
       * 0  当前不在点位的督导员
       * 1  常时间不移动的督导员
       * 2  实时在线的督导员
       */
      this.currenIndex = index;
      this.listFixBot.push("查看全部"); //添加查看全部
      const arr = new Set(this.listFixBot); //防止重复添加
      this.listFixBot = Array.from(arr);
      if (index == 2) {
        // 实时督导员坐标点显示
        this.map.clearOverlays();
        this.pointMap();
      }

      if (index == 3) {
        //全部点位显示
        this.listFixBot.pop();
        this.map.clearOverlays();
        this.pointMap();
        this.$refs.leftMethods.getNotInLoaction();
        this.$refs.leftMethods.getWorkerstatusStaytime();
      }
    },
    initRightTable(val) {
      this.localtion = val;
      this.initMapA(val);
      this.$refs.rightMapRef.pointMap(val);
      this.$refs.rightMapRef.getNotInLoaction(val);
      this.$refs.rightMapRef.getWorkerstatusStaytime(val);
    },
    pointDevice(name){
          let str = mapObj[name][0]+','+mapObj[name][1]
          let param = {'coordinate':str}
          getDeviceInfo(param).then((res) => {
            console.log(res);
          });
    },
    pointMap(name) {
      // 当天
      console.log(name);
      this.localtion = name ? name : axios.waresofeLocation;
      this.pointDevice(name)
      point({ disname: name }).then((res) => {
        let vals = Object.values(res); //对象转数组
        if (this.localtion !== "总公司") {
          console.log(this.localtion);
          vals = vals.filter(
            (item) =>
              item.indexOf(
                this.localtion !== "涪城" && this.localtion !== "安州"
                  ? "四川省" + this.localtion
                  : this.localtion
              ) > -1
          );
          console.log(vals);
        }
      //  console.log(vals);
        let newValss = vals.map((item, index) => {
          return {
            adress: item.split("&")[0].split("省")[1],
            lat: parseFloat(item.split("&")[1]),
            lng: parseFloat(item.split("&")[2]),
            name: item.split("&")[3] || "暂未上传名字",
            phone: Object.keys(res)[index], //对象转数组
          };
        });

        this.realTime = newValss.filter((item) => {
          if (item.adress != "null") {
            return item;
          }
        });

        //循环添加坐标点
        // let  marker=   new BMapGL.Marker(new BMapGL.Point(104.679127,  31.467673));
        // this.map.addOverlay(marker)
        let marker;
        this.realTime.map((item) => {
          //循环添加坐标点
          let pt = new BMapGL.Point(item.lng, item.lat); // 点标记添加点击事件 console.log(this.latLng);
          marker = new BMapGL.Marker(pt, { icon: this.realtimeIco });
          marker.addEventListener("click", function () {

            window.lookAdress(item);
          });
          this.map.addOverlay(marker);

          window.lookAdress = (info) => {
            this.proupSs = {
              name: info.name,
              tel: info.phone,
              adress: info.adress,
            };
            this.centerDialogVisible = true; //显示弹窗
          };
          // let content = "";
          // if (item.name != "暂未填写姓名") {
          //   content = `
          //                             <p  class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.nameIco}'/><span>${item.name}</span></p>
          //                           `;
          // } else {
          //   content = `
          //                             <p onclick='lookAdress(${JSON.stringify(
          //     item
          //   )})' class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.telIco
          //     }'/><span>${item.phone}</span></p>
          //                           `;
          // }

          // if (item.name == "noname") {
          //   content = `
          //                             <p onclick='lookAdress(${JSON.stringify(
          //     item
          //   )})' class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.telIco
          //     }'/><span>${item.phone}</span></p>
          //                             `;
          // }

          // let opts = {
          //   position: new BMapGL.Point(item.lng, item.lat), // 指定文本标注所在的地理位置
          //   offset: new BMapGL.Size(0, -60), // 设置文本偏移量
          // };
          // let label = new BMapGL.Label(content, opts);
          // label.setStyle({
          //   color: "#01ec0c",
          //   fontSize: "14px",
          //   height: "24px",
          //   padding: "5px 6px",
          //   borderRadius: "5px",
          //   border: "1px solid rgba(255,255,255)",
          //   background: "rgba(255,255,255)",
          //   fontWeight: "bold",
          //   transform: "translateX(-50%)",
          //   fontFamily: "微软雅黑",
          // });
          // this.map.addOverlay(label);

          // 点标记添加点击事件

        });
      });

      //获取用户的轨迹
      let track = this.realTime;
      return; //暂时隐藏20230419
    },
    hxdlocationFindAll(item) {
      return new Promise((resolve, reject) => {
        hxdlocationFindAll({ phone: item.phone, dats: today() }).then((res) => {
          if (res.length) {
            resolve(res);
          }
          // else{
          //   reject(res)
          // }
        });
      });
    },
    //查看历史轨迹线
    lookHistory() {
      this.ruleForm.date = "";
      this.tsTrack = false;
      this.historyTrack = true;
    },
    submitForm(formName) {
      //查找历史轨迹线按钮
      let data = {
        // phone:this.$store.getters.getmarkerMess.phone,
        phone: this.proupSs.tel,
        dats: filterTime(this.ruleForm.date),
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          hxdlocationFindAll(data).then((res) => {
            if (res.length) {
              let newAssignTrack = res.map((item) => {
                let newItem = item.locationinfo.split("&");
                // console.log(newItem)
                return [newItem[2], newItem[1]];
              });
              this.assignTrack = newAssignTrack;
              this.fullscreenLoading = true;
              setTimeout(() => {
                this.fullscreenLoading = false;
              }, 2000);
              setTimeout(() => {
                this.tsTrack = false;
                //关闭所有弹层
                this.historyTrack = false;
                this.centerDialogVisible = false;
                this.center = newAssignTrack[0];

                //////////////////////////////////
                //百度地图 指定督导员显示

                this.elAmap = false; //  全部督导员地图隐藏
                this.superintendentMap = true; //指定督导员显示
                //  console.log(this.assignTrack)
                this.duMap = new BMapGL.Map("superintendent");
                this.duMap.setDisplayOptions({
                  poiText: true, // 隐藏poi标注
                  poiIcon: true, // 隐藏poi图标
                  building: false, // 隐藏楼块
                });

                this.duMap.enableScrollWheelZoom(true); //鼠标滚轮缩放
                this.duPoint = new BMapGL.Point(
                  this.assignTrack[0][0],
                  this.assignTrack[0][1]
                ); //地图中心点
                this.duMap.clearOverlays();
                // console.log('this.duPoint',this.assignTrack[0][0],this.assignTrack[0][1])
                let pt = new BMapGL.Point(this.assignTrack[0][0], this.assignTrack[0][1]);
                let marker = new BMapGL.Marker(pt, { icon: this.realtimeIco });
                setTimeout(() => {
                  this.duMap.centerAndZoom(this.duPoint, 19);
                  this.duMap.addOverlay(marker);

                  let content = `
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.nameIco}'/><span>${this.proupSs.name}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.telIco}'/><span>${this.proupSs.tel}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.adressIco}'/><span>${this.proupSs.adress}</span></p>
                                        <div class='backMap'> <button onclick='backMapBig(${this.assignTrack[0][0]},${this.assignTrack[0][1]})'>返回</button></div>
                                    `;
                  //  onclick='backMapBig(${this.assignTrack[0][0]},${this.assignTrack[0][1]})'

                  let opts = {
                    position: new BMapGL.Point(
                      this.assignTrack[0][0],
                      this.assignTrack[0][1]
                    ), // 指定文本标注所在的地理位置
                    offset: new BMapGL.Size(0, -210), // 设置文本偏移量
                  };
                  let label = new BMapGL.Label(content, opts);

                  label.setStyle({
                    color: "#01ec0c",
                    fontSize: "14px",
                    height: "auto",
                    padding: "5px 6px",
                    borderRadius: "5px",
                    border: "1px solid rgba(255,255,255)",
                    background: "rgba(255,255,255)",
                    fontWeight: "bold",
                    transform: "translateX(-50%)",
                    fontFamily: "微软雅黑",
                  });
                  this.duMap.addOverlay(label);

                  //绘制 活动路线区域 多边形
                  //  console.log( this.duMap.getPanes())
                  let PolygonArr = newAssignTrack.map((item) => {
                    return new BMapGL.Point(item[0], item[1]);
                  });

                  // 正确代码段1
                  // var polygon = new BMapGL.Polygon(PolygonArr, {
                  //         strokeColor: '#f00',
                  //         fillColor: "rgba(226,124,124,0.5)",
                  //         strokeWeight: 2,
                  //         strokeOpacity:1
                  //     });
                  // this.duMap.addOverlay(polygon);

                  // 正确代码段2
                  var ps = [];
                  for (var i in PolygonArr) {
                    ps.push(new BMapGL.Point(PolygonArr[i].lng, PolygonArr[i].lat));
                  }
                  var ply = new BMapGL.Polygon(ps, {
                    zIndex: 1,
                    visible: true,
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#f00",
                    fillColor: "rgba(226,124,124,0.5)",
                    fillOpacity: 0.2,
                  }); // 建立多边形覆盖物
                  // this.duMap.getPanes().markerMouseTarget.style.zIndex=999;
                  this.duMap.addOverlay(ply);

                  window.backMapBig = (lng, lat) => {
                    this.elAmap = true; //  全部督导员地图隐藏
                    this.superintendentMap = false; //指定督导员显示
                    // this.point = new BMapGL.Point(lng,lat); //地图中心点
                    this.map.centerAndZoom(this.point, 15);
                  };

                  //  label.addEventListener('click',function(){

                  //  })

                  //  document.getElementById("backIdbtn").addEventListener('click',function(e){
                  //    console.log("点击了",e.target.nodeName)
                  //    this.elAmap=true//  全部督导员地图隐藏
                  //             this.superintendentMap=false//指定督导员显示
                  //             this.point = new BMapGL.Point(lng,lat); //地图中心点
                  //             this.map.centerAndZoom(this.point, 15);
                  // })
                }, 500);

                /////////////////////////////////////////////////
                // this.trackElamap=true//单个督导员显示
                // this.zoom=18
              }, 2500);
            } else {
              this.fullscreenLoading = true;
              setTimeout(() => {
                this.fullscreenLoading = false;
              }, 2000);
              setTimeout(() => {
                this.tsTrack = true;
              }, 2500);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //单人坐标返回
    backTrack() {
      this.elAmap = true; //  全部督导员地图显示
      this.trackElamap = false; //单个督导员隐藏
      this.zoom = 13;
      // location.reload()
    },
    initMap(map) {
      console.log("init map: ", map);
    },

    clickMarker(e) {
      alert("12312321321");
    },
  },
};
</script>
<style lang="scss">
.mapContent {
  position: relative;
  background: #fcf9f2;
}

.headerTitle {
  height: 90px;
  background-repeat: no-repeat;
  background-size: 100% 90px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 98;

  >div {
    height: 75px;
    display: inline-block;
    line-height: 85px;
    font-weight: bold;
    font-size: 30px;
    letter-spacing: 2px;
    background-image: -webkit-linear-gradient(left, #01ec0c, #fff 75%, #a8bbf0);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 4s infinite linear;
  }

  >span {
    position: absolute;
    display: inline-block;

    &.timeAnim1 {
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, transparent, #01ec0c);
      animation: animate1 5s linear infinite;
    }

    &.timeAnim2 {
      top: 0;
      right: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(270deg, transparent, #03e9f4);
      animation: animate2 3s linear infinite;
      animation-delay: 0.25s;
    }
  }

  //span
}

@keyframes animate1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

@keyframes animate2 {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

@-webkit-keyframes masked-animation {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: -180% 0;
  }
}

.mapLeft {
  width: 100%;
}

#amapDemo {
  width: 100%;
  height: 100vh;
}

.mapMaker {
  padding: 5px;
  border-radius: 5px;
  background: #fff;

  &.mapMakerBg {
    background: rgba(255, 255, 255, 0.8) !important;
  }

  &.mapMakerSs {
    animation: animated-border 1.5s infinite;
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
      position: relative;
      display: flex;
      align-items: center;

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

      >div {
        white-space: nowrap;
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
  right: 20px;
  z-index: 97;
}

.leftPos {
  width: 300px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 98;
}

.superintendent {
  position: relative;

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

    .history {
      font-size: 14px;
      font-style: normal;
    }

    &:hover {
      .history {
        font-size: 14px;
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }
}

.trackLine {
  text-align: center;
  color: #d81e06;
  font-size: 14px;

  >i {
    font-size: 16px;
  }
}

// .zcLine{ border:1px solid #f00; border-radius: 10px;}
</style>
