<template>
  <div class="mapContent">
    <div class="mapLeft mapLeftHeight" >
             <div v-show="elAmap"  class="mapLeftHeight" id="container"></div> <!--主页第一层地图-->
             <div v-show="superintendentMap"  class="mapLeftHeight" id="superintendent"></div> 主页点击坐标点查询指定督导员显示的地图
    </div><!--/mapLeft-->
    <div class="mapLeft" v-if="aaa">
      <el-amap
        vid="amapDemo"
        :zoom="zoom"
        :center="center"
        :viewMode="viewMode"
        :events="events"
        v-if="elAmap"
      >
        <!--实时-->
        <div v-for="(item, index) in realTime" :key="index*0.6">
          <!--点-->
          <!-- <el-amap-marker v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :icon='iconLs'  @init="initMap"  reEventWhenUpdate='true' @click='clickMarker'></el-amap-marker> -->
          <!-- <el-amap-marker  v-if="item.lng && item.lat" :position='[item.lng,item.lat]' :offset='offset' reEventWhenUpdate='true'    >显示名字。电话。位置-->
          <el-amap-marker
            v-if="item.lng && item.lat"
            :position="[item.lng, item.lat]"
            reEventWhenUpdate="true"
            :topWhenClick="visible"
            :bubble="visible"
            :clickable="visible"
            animation="AMAP_ANIMATION_DROP"
            :extData="item"
     
            :events="eventsMarker.ssMarker"
          >
            <div class="mapMaker mapMakerSs" ref="mapMakerHeight">
              <ul>
                <li style="color: #01ec0c;" v-if="item.name != '暂未上传名字'">
                   <span><img src="../assets/images/zcName.png" alt="" /></span>
                   <div> {{ item.name }}</div>
                </li>

                <li style="color:  #01ec0c" v-else>
                  <span><img src="../assets/images/zcTel.png" alt="" /></span>
                  <div>{{ item.phone }}</div>
                </li>
              </ul>

              <div class="imgPosBot">
                <img :src="iconLsYellow" alt="" />
              </div>
            </div>
          </el-amap-marker>
          <!--轨迹线20230419隐藏-->
          <!-- <div v-for='(itemZb,indecZb) in getCoord' :key="indecZb*11">
            <el-amap-polygon
              :path="itemZb"
              :visible="polygon.visible"
              :strokeColor="polygon.strokeColor"
              :zIndex="polygon.zIndex"
            />
          </div> -->

        </div>
   
        <!--长时间未移动-->
        <div v-for="item in newVals_wyd" :key="item.phone">
          <el-amap-marker
            v-if="item.lng && item.lat"
            :position="[item.lng, item.lat]"
            reEventWhenUpdate="true"
            :topWhenClick="visible"
            :bubble="visible"
            :clickable="visible"
            animation="AMAP_ANIMATION_DROP"
            :extData="item"
            :events="eventsMarker.csMarker"
          >
            <div class="mapMaker mapMakerLv" ref="mapMakerHeight">
              <ul>
                <li style="color: #1296db" v-if="item.name != '暂未上传名字'">
                  <span><img src="../assets/images/csName.png" alt="" /></span>
                  {{ item.name }}
                </li>

                <li style="color: #1296db" v-else>
                  <span><img src="../assets/images/csTel.png" alt="" /></span>
                  {{ item.phone }}
                </li>
              </ul>

              <div class="imgPosBot">
                <img :src="iconLsRed" alt="" />
              </div>
            </div>
          </el-amap-marker>
        </div>
      </el-amap>
   
   
       <el-amap   vid="amapDemo" v-if='trackElamap'
        :zoom="zoom"
        :center="center"
        :viewMode="viewMode"
        :events="events"
         >
           <el-amap-info-window
                 v-model:visible="visible"
                     :position="center"
                     :offset='offset'
                     :event='eventsMarker.closeWindow'
                     :isCustom='true'
                      >
                     <div class="mapMaker" ref="mapMakerHeight" style="padding:5%">
                      <ul>
                          <li>
                            <span><img src="../assets/images/ssName.png" alt="" /></span>
                            {{ $store.getters.getmarkerMess.name }}
                          </li>

                          <li>
                            <span><img src="../assets/images/ssTel.png" alt="" /></span>
                            {{ $store.getters.getmarkerMess.phone }}
                          </li>

                          <li>
                            <span><img src="../assets/images/ssAdress.png" alt="" /></span>
                            {{$store.getters.getmarkerMess.adress}}
                          </li>
                          <li style="text-align:center; padding:5% 0 0 0 ">
                             <el-button type="primary" size="mini" @click="backTrack">返回</el-button>
                          </li>
                        </ul>
                      </div>
           </el-amap-info-window>

         <el-amap-marker
            :position="center"
            reEventWhenUpdate="true"
            :topWhenClick="visible"
            :bubble="visible"
            :clickable="visible"
            animation="AMAP_ANIMATION_DROP"
          >
            
          </el-amap-marker>

           <!--单个指定人员的的路径显示-->
           <el-amap-polygon
              :path="assignTrack"
              :visible="polygon.visible"
              :strokeColor="polygon.strokeColorDg"
              :zIndex="polygon.zIndex"
            />

        </el-amap> 
    </div>
    <!--mapLeft-->

    <div class="mapRight">
      <mapRight></mapRight>
    </div>
    <!--//mapRight-->

    <el-dialog
      title="实时在线的督导员"
      :visible.sync="centerDialogVisible"
      width="500px"
      custom-class="zcLine"
      center
    >
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/zcName.png" alt="" /></span
          >{{ proupSs.name }}
        </p>
        <p>
          <span><img src="../assets/images/zcTel.png" alt="" /></span
          >{{ proupSs.tel }}
        </p>
        <p>
          <span><img src="../assets/images/zcAdress.png" alt="" /></span
          >{{ proupSs.adress }}
        </p>
        <p> 
           <span><img src="../assets/images/zcTrack.png" alt="">  </span>
           <em class="history" style="color:#01ec0c" @click="lookHistory">查看历史轨迹线</em>
        </p>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialogVisible_Zc"
      width="30%"
      custom-class="zcLine"
      center
    >
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/zcName.png" alt="" /></span
          >{{ proupZc.name }}
        </p>
        <p>
          <span><img src="../assets/images/zcTel.png" alt="" /></span
          >{{ proupZc.tel }}
        </p>
        <p>
          <span><img src="../assets/images/zcAdress.png" alt="" /></span
          >{{ proupZc.adress }}
        </p>
        <p>
           <span><img src="../assets/images/zcTrack.png" alt="">  </span>
           <em class="history" style="color:#01ec0c" @click="lookHistory">查看历史轨迹线</em>
        </p>
      </div>
    </el-dialog>

    <el-dialog
      title="长时间未移动的督导员"
      :visible.sync="centerDialogVisible_Cs"
      width="30%"
      custom-class="zcLine"
      center
    >
      <div class="superintendent">
        <p>
          <span><img src="../assets/images/csName.png" alt="" /></span
          >{{ proupCs.name }}
        </p>
        <p>
          <span><img src="../assets/images/csTel.png" alt="" /></span
          >{{ proupCs.tel }}
        </p>
        <p>
          <span><img src="../assets/images/csAdress.png" alt="" /></span
          >{{ proupCs.adress }}
        </p>
        <p>
           <span><img src="../assets/images/csTrack.png" alt="">  </span>
           <em class="history" style="color:#1296db" @click="lookHistory">查看历史轨迹线</em>
        </p>
  
      </div>
    </el-dialog>


     <!--查看轨迹弹窗显示-->
    <el-dialog
      title="请选择时间查询历史轨迹"
      :visible.sync="historyTrack"
      width="500px"
      custom-class="zcLine"
      center
    >
      <div class="superintendent">
            <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="100px">
               <el-form-item label="电话号码">
                  <el-input v-model="proupSs.tel" readonly="readonly"></el-input>
                </el-form-item>


              <el-form-item label="选择日期" prop="date">
                     <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date" style="width: 100%;"></el-date-picker>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')"   v-loading.fullscreen.lock="fullscreenLoading">查找</el-button>
              </el-form-item>
            </el-form>   
            <div class="trackLine" v-show="tsTrack"> <el-icon><Warning /></el-icon> 暂无当前时间段督导员的轨迹线</div>  
      </div><!--/superintendent-->
    </el-dialog>


  </div>
</template>

<script>
import mapRight from "../views/mapRight.vue";
import { Warning } from "@element-plus/icons-vue";
import { point, hxdlocationFindAll,findAllToday } from "@/api/api";
import Bus from "../utils/eventBus";
import today from "@/utils/today";
import {filterTime} from '@/utils/today.js'
export default {
  components: {
    mapRight,
    Warning,
  },
  data() {
    const _that = this;
    
    return {
      aaa:false,
     
      a: [
  [
    "104.753766",
    "31.454759"
  ],
  [
    "104.753873",
    "31.454471"
  ]
],
    
      trackElamap: false,//单个指定督导员显示
      zoom: 13,
      visible: true,
      postFd: { top: 100, left: 120 },
      center: [104.679127, 31.467673],
      position: [104.674063, 31.467161],
      center2: [],
      offset: [0, -40], //左  上
      iconLs: require("../assets/images/lvs.png"),
      iconLsRed: require("../assets/images/ssYellow.png"),
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
      events: {
        //地图控件  放大缩小显示
        init(o) {
          o.plugin(["AMap.ControlBar", "AMap.ToolBar"], () => {
            // ControlBar插件，文档：https://lbs.amap.com/api/javascript-api/guide/abc/plugins
            const ControlBar = new AMap.ControlBar({
              position: { top: "20px", right: "10px" },
            });
            o.addControl(ControlBar);
          });
        },
      },
      //marker 点击事件
      eventsMarker: {
        ssMarker: {
          init(m) {
            m.on("click", (e) => {
              //  let marker = JSON.stringify(e.target.w.content.innerText)
              // marker = marker.split('\\n');
              // _that.proupSs={
              //     name:marker[1],
              //     tel:marker[2],
              //     adress:marker[3].split('"')[0]
              // }
              let marker = e.target.w.extData;
              _that.proupSs = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress,
              };
               _that.$store.commit('updatemarkerMess',marker)

              _that.centerDialogVisible = true;
            });
          },
        },
        zcMarker: {
          init(m) {
            m.on("click", (e) => {
              let marker = e.target.w.extData;
              _that.proupZc = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress,
              };
               _that.$store.commit('updatemarkerMess',marker)
              _that.centerDialogVisible_Zc = true;
            });
          },
        },

        csMarker: {
          init(m) {
            m.on("click", (e) => {
              let marker = e.target.w.extData;
              _that.proupCs = {
                name: marker.name,
                tel: marker.phone,
                adress: marker.adress,
              };
               _that.$store.commit('updatemarkerMess',marker)
              _that.centerDialogVisible_Cs = true;
            });
          },
        },

        
      },
      //
      polygon: {
        strokeColor: "#f00",
        strokeColorDg: "#f00",
        zIndex: 1,
        visible: true,
        path: [
          ["104.725457", "31.457455"],
          ["104.72542", "31.457472"],
          ["104.7254", "31.457424"],
          ["104.725509", "31.457397"],
          ["104.725482", "31.457353"],
          ["104.725362", "31.457456"],
          ["104.72538", "31.457454"],
          ["104.725384", "31.457574"],
          ["104.725437", "31.457597"],
          ["104.725404", "31.457465"],
          ["104.725462", "31.45754"],
          ["104.725404", "31.457582"],
          ["104.725486", "31.4574"],
          ["104.725517", "31.457616"],
          ["104.725464", "31.45757"],
          ["104.725263", "31.457345"],
          ["104.724516", "31.456999"],
          ["104.721548", "31.456697"],
          ["104.720869", "31.457019"],
          ["104.720749", "31.456614"],
          ["104.720765", "31.456614"],
          ["104.72068", "31.456638"],
          ["104.720711", "31.456619"],
          ["104.720749", "31.456622"],
          ["104.720757", "31.456616"],
          ["104.720772", "31.456616"],
          ["104.720757", "31.456616"],
          ["104.720757", "31.456616"],
          ["104.720772", "31.456608"],
          ["104.720765", "31.456614"],
          ["104.720765", "31.456614"],
          ["104.720749", "31.456618"],
          ["104.720742", "31.456619"],
          ["104.720757", "31.45661"],
          ["104.720765", "31.456614"],
          ["104.720757", "31.456616"],
          ["104.720772", "31.456614"],
          ["104.720757", "31.456616"],
          ["104.720765", "31.456612"],
          ["104.720749", "31.456616"],
          ["104.720757", "31.45661"],
          ["104.720742", "31.456621"],
          ["104.720749", "31.456612"],
          ["104.720604", "31.456663"],
          ["104.720536", "31.456687"],
          ["104.720772", "31.456612"],
          ["104.720772", "31.456614"],
          ["104.720757", "31.456614"],
          ["104.720757", "31.456614"],
          ["104.720749", "31.456603"],
          ["104.720749", "31.45662"],
          ["104.720765", "31.456603"],
          ["104.720749", "31.45661"],
          ["104.720765", "31.456612"],
          ["104.720757", "31.456612"],
          ["104.72108", "31.456893"],
          ["104.720742", "31.456619"],
          ["104.721288", "31.456193"],
          ["104.720734", "31.456619"],
          ["104.723516", "31.456718"],
          ["104.72544", "31.457738"],
          ["104.725966", "31.457971"],
          ["104.725287", "31.457747"],
          ["104.72534", "31.45767"],
          ["104.72532", "31.457585"],
          ["104.725404", "31.457605"],
          ["104.725405", "31.457624"],
          ["104.725495", "31.457667"],
          ["104.725408", "31.457579"],
          ["104.725301", "31.457716"],
        ],
        // path: [["104.725457", "31.457455"], ["104.72542","31.457472"], ["104.7254","31.457424"], ["104.725509", "31.457397"]],
      },
      toDayTime: today(), //当天的时间
      getCoord: [],//轨迹线
      historyTrack:false,// 历史轨迹输入弹出层
      ruleForm:{
        date:''
      },
      rules:{
         date:[
            { required: true, message: '请输选择日期', trigger: 'blur' },
         ]
      },
      fullscreenLoading: false,//点击查找触发加载层
   
      assignTrack:[],//指定人员的轨迹线

       //实时在线 20230428改百度地图
         elAmap:true, //所有督导员显示的地图\
         superintendentMap:false,//指定督导员显示
        map:'',//地图页面全局
        duMap:'',//指定督导员显示的地图 页面全局
        point:'',//点页面全局
        duPoint:'',//指定督导员点
        realtimeIco:'',//创建实时坐标图片 实时在线督导
        realOnLine:{
         nameIco: require("../assets/images/zcName.png"),
         telIco: require("../assets/images/zcTel.png"),
         adressIco: require("../assets/images/zcAdress.png"),
         trackIco: require("../assets/images/zcTrack.png"),
      },
         tsTrack:false,//没有轨迹线提示
    };
  },
  created() {
    Bus.$on("zcLnglat", (data) => {
      //获取正常督导员经纬度
    //   console.log('1获取正常督导员经纬度')
    //  console.log(data)
       this.newVals = data;
      // data.map(item=>{
      //      return {
      //         name:item.username,
      //         adress:newLis[1],
      //         lat:item.userrule.split('-')[0],
      //         lng:item.userrule.split('-')[1],
      //         phone:item.userphone,
      //      }
      // })
    });

    Bus.$on("wydLnglat", (data) => {
      //未移动导员经纬度
      // console.log('2未移动督导员经纬度')
      // console.log(data)
      this.newVals_wyd = data;
    });
  },

  mounted() {
    //
    this.pointMap();
      //百度地图原生 全部
        if(this.elAmap){
            this.map =new BMapGL.Map("container")
            this.point = new BMapGL.Point(104.679127,31.467673); //地图中心点
            this.map.centerAndZoom(this.point, 15); 
            this.map.enableScrollWheelZoom(true)//鼠标滚轮缩放
            this.realtimeIco = new BMapGL.Icon(this.iconLs,new BMapGL.Size(18,30)); //创建实时在线坐标图片
            let navi3DCtrl = new BMapGL.NavigationControl3D();  // 添加3D控件
            this.map.addControl(navi3DCtrl);
            let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
             this.map.addControl(zoomCtrl);
        }
      
    

    // let  marker=   new BMapGL.Marker(new BMapGL.Point(104.679127,  31.467673));
    //  this.map.addOverlay(marker)
 
     
     //循环创建实时在线督导员的点
    this.timer = setInterval(() => {
      //每隔5分鐘刷新一次接口
      this.pointMap();
      this.map.clearOverlays()
    }, 300000);
   this.$once('hook:beforeDestroy', () => { clearInterval(this.timer); })//防止setInterval多次请求
  },
  // beforeDestroy() {
  //   // clearInterval(this.timer);
  //   this.$bus.$off("zcLnglat"); //避免兄弟传值 执行2次$on
  //   this.$bus.$off("wydLnglat"); //避免兄弟传值 执行2次$on
  // },
  methods: {

  pointMap() {
      // 当天
      
       findAllToday().then(res=>{
                            let vals = Object.values(res); //对象转数组
                            let newValss = vals.map((item, index) => {
                                return {
                                adress: item.split("&")[1].split("省")[1],
                                lat: parseFloat(item.split("&")[2]),
                                lng: parseFloat(item.split("&")[3]),
                                name:
                                    item.split("&")[0] == 'noname' || item.split("&")[0] == null
                                    ? "暂未上传名字"
                                    : item.split("&")[0],
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
                             this.realTime.map(item=>{ //循环添加坐标点
                                let pt =new BMapGL.Point(item.lng,item.lat)
                                marker=   new BMapGL.Marker(pt,{icon:this.realtimeIco});
                                this.map.addOverlay(marker)
                                  let content="";
                                  if(item.name!='暂未填写姓名' ){
                                    content = `
                                      <p onclick='lookAdress(${JSON.stringify(item)})' class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.nameIco}'/><span>${item.name}</span></p>
                                    `
                                  }else{
                                    content = `
                                      <p onclick='lookAdress(${JSON.stringify(item)})' class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.telIco}'/><span>${item.phone}</span></p>
                                    `
                                  }

                                   if(item.name=="null"){
                                     content = `
                                      <p onclick='lookAdress(${JSON.stringify(item)})' class='labelW'><img style='width:25px; height:25px' src='${this.realOnLine.telIco}'/><span>${item.phone}</span></p>
                                      `
                                 }
                            

                                 let opts = {
                                      position: new BMapGL.Point(item.lng,item.lat), // 指定文本标注所在的地理位置
                                      offset: new BMapGL.Size(0, -60) // 设置文本偏移量
                                  };
                                 let label = new BMapGL.Label(content,opts)
                                 label.setStyle({
                                        color: "#01ec0c",
                                        fontSize: "14px",
                                        height: "24px",
                                        padding: '5px 6px',
                                        borderRadius:'5px',
                                        border: "1px solid rgba(255,255,255)",
                                        background: "rgba(255,255,255)",
                                        fontWeight: "bold",
                                        transform: 'translateX(-50%)',
                                        fontFamily: "微软雅黑"
                                    });
                                 this.map.addOverlay(label)
                       
                                    
                                 // 点标记添加点击事件
                                  window.lookAdress=(info)=>{
                                    //  console.log('123321313221',info)
                                      this.centerDialogVisible=true //显示弹窗
                                       this.proupSs = {
                                          name: info.name,
                                          tel: info.phone,
                                          adress: info.adress,
                                        };
                                       
                                  }

                             })
                             
                            
                          
                })
               
      //获取用户的轨迹
      let track = this.realTime;
      return //暂时隐藏20230419
      track.map((item) => {
        this.hxdlocationFindAll(item).then(res=>{
          if (res.length != 0) {
            let c = res.map((item) => {
              let locationinfo = item.locationinfo; //使用管理replace 就不需要使用JSON.stringify()
              let filterSz = locationinfo.replace(/\//g, "").split("&"); //
              // return  {
              //         lng:filterSz[2],
              //         lat:filterSz[1]
              //       }

              return [filterSz[2], filterSz[1]];
            }).filter(i=>i[0]&&i[1]);
            // console.log(22222)
            // console.log(c)
            this.getCoord.push(c);
          }
        })
      });
    },
    hxdlocationFindAll(item) {
      return new Promise((resolve, reject) => {
        hxdlocationFindAll({ phone: item.phone, dats: today() }).then((res) => {
          if (res.length) {
            resolve(res)
          }
          // else{
          //   reject(res)
          // }
        });
      });
    },
   //查看历史轨迹线
   lookHistory(){
         this.ruleForm.date='';
         this.tsTrack = false
         this.historyTrack=true
   },
   submitForm(formName){//查找历史轨迹线按钮
          let data ={
              // phone:this.$store.getters.getmarkerMess.phone,
              phone:this.proupSs.tel,
              dats: filterTime(this.ruleForm.date)
          }
        this.$refs[formName].validate((valid) => {
          if (valid) {
              hxdlocationFindAll(data).then(res=>{
                 
                  if(res.length){
                    let newAssignTrack =  res.map(item=>{
                            let  newItem  = item.locationinfo.split('&')
                            // console.log(newItem)
                            return [newItem[2],newItem[1]]
                       })
                      this.assignTrack =newAssignTrack
                       this.fullscreenLoading = true;
                        setTimeout(() => {
                          this.fullscreenLoading = false;
                        }, 2000);
                         setTimeout(()=>{
                          this.tsTrack = false
                          //关闭所有弹层
                          this.historyTrack=false
                          this.centerDialogVisible=false
                          this.center=newAssignTrack[0]

 //////////////////////////////////
                          //百度地图 指定督导员显示
                         
                          this.elAmap=false//  全部督导员地图隐藏
                          this.superintendentMap=true//指定督导员显示
                          //  console.log(this.assignTrack)
                          this.duMap=new BMapGL.Map("superintendent")
                           this.duMap.setDisplayOptions({
                              poiText: true,  // 隐藏poi标注
                              poiIcon: true,  // 隐藏poi图标
                              building: false  // 隐藏楼块
                          });

                          this.duMap.enableScrollWheelZoom(true)//鼠标滚轮缩放
                          this.duPoint = new BMapGL.Point(this.assignTrack[0][0],this.assignTrack[0][1]); //地图中心点
                             this.duMap.clearOverlays()
                          // console.log('this.duPoint',this.assignTrack[0][0],this.assignTrack[0][1])
                           let pt =new BMapGL.Point(this.assignTrack[0][0],this.assignTrack[0][1])
                           let marker= new BMapGL.Marker(pt,{icon:this.realtimeIco});
                         setTimeout(()=>{
                             this.duMap.centerAndZoom(this.duPoint,19)
                             this.duMap.addOverlay(marker)

                                  let content=`
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.nameIco}'/><span>${this.proupSs.name}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.telIco}'/><span>${this.proupSs.tel}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${this.realOnLine.adressIco}'/><span>${this.proupSs.adress}</span></p>
                                        <div class='backMap'> <button onclick='backMapBig(${this.assignTrack[0][0]},${this.assignTrack[0][1]})'>返回</button></div>
                                    `;
                              //  onclick='backMapBig(${this.assignTrack[0][0]},${this.assignTrack[0][1]})'
                            

                                 let opts = {
                                      position: new BMapGL.Point(this.assignTrack[0][0],this.assignTrack[0][1]), // 指定文本标注所在的地理位置
                                      offset: new BMapGL.Size(0, -210) // 设置文本偏移量
                                  };
                                 let label = new BMapGL.Label(content,opts)
                         
                                 label.setStyle({
                                        color: "#01ec0c",
                                        fontSize: "14px",
                                        height: "auto",
                                        padding: '5px 6px',
                                        borderRadius:'5px',
                                        border: "1px solid rgba(255,255,255)",
                                        background: "rgba(255,255,255)",
                                        fontWeight: "bold",
                                        transform: 'translateX(-50%)',
                                        fontFamily: "微软雅黑"
                                    });
                                 this.duMap.addOverlay(label)
       
                                  //绘制 活动路线区域 多边形
                                //  console.log( this.duMap.getPanes())
                                  let PolygonArr =newAssignTrack.map(item=>{
                                     return  new BMapGL.Point(item[0],item[1])
                                  })

                                  // 正确代码段1
                                  // var polygon = new BMapGL.Polygon(PolygonArr, {
                                  //         strokeColor: '#f00',
                                  //         fillColor: "rgba(226,124,124,0.5)",
                                  //         strokeWeight: 2,
                                  //         strokeOpacity:1
                                  //     });
                                  // this.duMap.addOverlay(polygon);
                               
                              // 正确代码段2
                                 var ps = []
                                  for (var i in PolygonArr) {
                                      ps.push(new BMapGL.Point(PolygonArr[i].lng,PolygonArr[i].lat));
                                  }
                                  var ply = new BMapGL.Polygon(ps, {zIndex:1,visible:true,strokeOpacity:1, strokeWeight: 2,strokeColor: '#f00',fillColor: "rgba(226,124,124,0.5)", fillOpacity: 0.2}); // 建立多边形覆盖物
                                 // this.duMap.getPanes().markerMouseTarget.style.zIndex=999;
                                 this.duMap.addOverlay(ply);
                                
                   


                               window.backMapBig=(lng,lat)=>{
                                    this.elAmap=true//  全部督导员地图隐藏
                                    this.superintendentMap=false//指定督导员显示
                                    // this.point = new BMapGL.Point(lng,lat); //地图中心点
                                    this.map.centerAndZoom(this.point, 15); 
                             
                                 }

                        //  label.addEventListener('click',function(){
                                
                        //  })

                        //  document.getElementById("backIdbtn").addEventListener('click',function(e){
                        //    console.log("点击了",e.target.nodeName)
                        //    this.elAmap=true//  全部督导员地图隐藏
                        //             this.superintendentMap=false//指定督导员显示
                        //             this.point = new BMapGL.Point(lng,lat); //地图中心点
                        //             this.map.centerAndZoom(this.point, 15); 
                        // })  
                       },500)

/////////////////////////////////////////////////
                          // this.trackElamap=true//单个督导员显示
                          // this.zoom=18
                        },2500)

                      
                  }else{
                    this.fullscreenLoading = true;
                      setTimeout(() => {
                        this.fullscreenLoading = false;
                      }, 2000);
                      setTimeout(()=>{
                        this.tsTrack = true
                      },2500)
                  }
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
   },
         //单人坐标返回
   backTrack(){
         this.elAmap=true//  全部督导员地图显示
        this.trackElamap=false//单个督导员隐藏
        this.zoom=13
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
.mapLeft {
  width: calc(100% - 300px);
}
#amapDemo {
  width: 100%;
  height: 100vh;
}
.mapMaker {
  padding: 5px;
  border-radius: 5px;
  background: #fff;

  &.mapMakerBg{ background: rgba(255,255,255,0.8)!important;}
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
    > img {
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
        > img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
      }
      >div{ white-space:nowrap}
      &.posBxs {
        position: absolute;
        top: -100000px;
        opacity: 0;
      }
    }
  }
} //mapMaker

.amap-icon > img {
  width: 20px;
  height: 25px;
  object-fit: fill;
}

.mapRight {
  width: 300px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 97;
}

.superintendent {
   position: relative;
   
  > p {
    padding: 5px 0;
    font-size: 18px;
    > span {
      vertical-align: middle;
      margin: 0 10px 0 0;
      > img {
        width: 25px;
        height: 25px;
      }
    }
    .history{ font-size: 14px; font-style: normal;}
    &:hover{
      .history{ font-size: 14px; cursor: pointer; opacity: 0.8;}
    }
  }
}
.trackLine{ text-align: center; color: #d81e06; font-size: 14px;
   >i{ font-size: 16px;}
}
// .zcLine{ border:1px solid #f00; border-radius: 10px;}
</style>
