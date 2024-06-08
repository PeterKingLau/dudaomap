<template>
  <div class="mapHeight">
    <!---按日期查询超15分钟离岗人员-->
    <div class="styleCss normal">
      <div class="styleCssTitle lvs" >
        <img src="../assets/images/ligang.svg" alt="" style=" height:20px; width:20px"> <span>{{
          '监控区域' }}</span>
      </div>
      <div class="searchDdy">
        <div>
          <el-select v-model="disnameValue" @change="$emit('changeDisname', disnameValue)" clearable size="small"
            placeholder="请选择区域">
            <el-option v-for="item in ['总公司', '涪城', '安州', '广汉', '射洪', '南充']" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="styleCssTitle lvs">
        <img src="../assets/images/ligang.svg" alt="" style=" height:20px; width:20px"> <span>{{ selectType ||
          '当前查询类型' }}</span>
      </div>



      <div class="searchDdy">
        <el-select v-model="selectType" @change="dateSearch = ''" clearable size="small" placeholder="请选择">
          <el-option v-for="item in selectTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div v-if="selectType === '超15分钟离岗人员'">
          <el-date-picker v-model="dateSearch" type="date" size="small" :placeholder="'请选择日期'" :editable='false'
            @change='changeDate' :value-format="'yyyy-MM-dd'">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchDdyBtn">查询</el-button>
      </div>

      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/poinDw.svg" alt=""> <span>按日期查询正常在岗时间</span>
      </div> -->


      <!--/查询当日正常在岗时间-->

      <!--/当日不在点位督导员-->
      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/ligang.svg" alt=""> <span>查询
          
          当日不在点位督导员</span>
      </div>

      <div class="searchDdy">
        <div>
          <el-date-picker v-model="dateSearchPoint" type="datetimerange" size="small" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :value-format="'yyyy-MM-dd HH:mm:ss'" @change='changeDatePoint' :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchPoint">查询</el-button>
      </div> -->

      <!--/长时间不移动督导员-->
      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/ligang.svg" alt=""> <span>当日长时间不移动督导员</span>
      </div>

      <div class="searchDdy">
        <div>
          <el-date-picker v-model="dateSearchPoint" type="datetimerange" size="small" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :value-format="'yyyy-MM-dd HH:mm:ss'" @change='changeDatePoint' :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchPoint">查询</el-button>
      </div> -->

    </div><!--/styleCss-->

    <div class="styleCss normal" :style="{ backgroundImage: `url(${borderImg3})` }">
      <div class="styleCssTitle">
         <img src="../assets/images/zc.svg" alt=""> <span>总设备数量</span>
         <em class="onlineStyle"><em style="color: #4d4d4d;">{{deviceCount}}</em>台</em>
       
        
      </div>
    </div>


    <div class="styleCss normal" :style="{ backgroundImage: `url(${borderImg})` }">
      <div class="styleCssTitle">
         <img src="../assets/images/zc.svg" alt=""> <span>正常运行设备</span>
         <em class="onlineStyle"><em style="color: #4d4d4d;">{{deviceList.length}}</em>台</em>
       
        
      </div>
      <div class="zcNormal zcline ">
        <div class="zcNormaltitle">
          <span>设备名称</span>
         
        </div>

        <vue-seamless-scroll :data="deviceList" :class-option="classOption" class="seamless-warp">
          <ul class="zcUl1" v-if="deviceList.length">
            <li v-for="(item, index) in deviceList" :key="index * 0.1">
              <span>{{  item.name }}</span>
             
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </vue-seamless-scroll>

      </div>  

    </div>



    
    <div class="styleCss normal" :style="{ backgroundImage: `url(${borderImg})` }">
      <div class="styleCssTitle">
         <img src="../assets/images/zc.svg" alt=""> <span>离线设备</span>
         <em class="onlineStyle"><em style="color: #4d4d4d;">{{offlineDeviceList.length}}</em>台</em>
      </div>
      <div class="zcNormal zcline ">
        <div class="zcNormaltitle">
          <span>离线设备名称</span>
         
        </div>

        <vue-seamless-scroll :data="offlineDeviceList" :class-option="classOption" class="seamless-warp">
          <ul class="zcUl1" v-if="offlineDeviceList.length">
            <li v-for="(item, index) in offlineDeviceList" :key="index * 0.1">
              <span>{{  item.name }}</span>
             
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </vue-seamless-scroll>

      </div>  

    </div>



    <!--当前不在点位督导员-->
    <el-dialog title="当前不在点位督导员" :visible.sync="bzdProup" width="500px" center :modal-append-to-body='false'>
      <div class="superintendent">
        <!-- <p>
                            <span><img src="../assets/images/zcName.png" alt="" /></span
                            >{{ proupSs.name }}
                            </p>-->
        <p>
          <span><img src="../assets/images/redTel.png" alt="" /></span>{{ noDataPoint.tel }}
        </p>
        <p>
          <span><img src="../assets/images/redAdress.png" alt="" /></span>{{ noDataPoint.adress }}
        </p>
        <p>
          距离定点位置距离:<em style="color:#ff0000; font-style:normal"> {{ noDataPoint.distance }}</em>米

        </p>
      </div>
    </el-dialog>

    <!--长时间不移动督导员-->
    <el-dialog title="长时间不移动督导员" :visible.sync="longtimeProup" width="500px" center :modal-append-to-body='false'>
      <div class="superintendent">
        <!-- <p>
                            <span><img src="../assets/images/zcName.png" alt="" /></span
                            >{{ proupSs.name }}
                            </p>-->
        <p>
          <span><img src="../assets/images/orangeTel.png" alt="" /></span>{{ noDataPoint.tel }}
        </p>
        <!-- <p>
          <span><img src="../assets/images/orangeAdress.png" alt="" /></span>{{ noDataPoint.adress }}
        </p> -->
        <p v-if="noDataPoint.username">
          姓名:<em style="color:#f75d00; font-style:normal"> {{ noDataPoint.username }}</em>

        </p>
        <p>
          回传数据次数:<em style="color:#f75d00; font-style:normal"> {{ noDataPoint.infoflag }}</em>

        </p>
      </div>
    </el-dialog>

    <!--指定日期不在点位的督导员-->
    <el-dialog :visible.sync="absentShow" width="800px" center :modal-append-to-body='false' @close="beyondLists = []">

      <div class="titleDate"><span>{{ dateSearch ? dateSearch : '' }}</span>{{ selectType }}<span>{{ beyondLists.length
      }}</span>位
      </div>
      <!-- <div style="margin: 0 0  20px 0">
                        <el-button icon="el-icon-s-promotion" @click="excelBtn" type="success">导出Excel</el-button>
                        </div> -->
      <div class="dcExcel">
        <span @click="excelBtn(1)"> <i class="el-icon-s-promotion"></i> 导出Excel</span>
        <!-- <el-button icon="el-icon-s-promotion" @click="excelBtn" type="success">导出Excel</el-button> -->
      </div>
      <el-table :data="beyondLists" height='400px' :header-cell-style="headStyle" :cell-style="rowStyle"
        :row-class-name="tableRowClassName">
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column label="姓名" v-if="selectType !== '当日长时间不移动督导员' && selectType !== '查询当日正常在岗时间'">
          <template slot-scope="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span>{{ scope.row.infoflag != null ? scope.row.infoflag : '暂未上传名字' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="selectType !== '查询当日正常在岗时间'" property="errormodel" label="电话号码"></el-table-column>
        <!-- <el-table-column property="errordate" label="违规时间"></el-table-column> -->
        <!-- <el-table-column label="超出范围">
          <template slot-scope="scope">
            <span style="color:#f00">{{ fun(scope.row.errorinfo) }} 米</span>
          </template>
        </el-table-column> -->
        <el-table-column label="超15分钟离岗次数" v-if="selectType === '超15分钟离岗人员'">
          <template slot-scope="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span style="color:#f00">{{ scope.row.errorinfo }} </span>
          </template>
        </el-table-column>
        <el-table-column label="当日长时间不移动督导员" v-if="selectType === '当日长时间不移动督导员'">
          <template slot-scope="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span style="color:#f00">{{ scope.row.errorinfo }} </span>
          </template>
        </el-table-column>
        <template v-if="selectType === '当日不在点位督导员'">
          <el-table-column label="距离定点位置距离">
            <template slot-scope="scope">
              <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
              <span style="color:#f00">{{ fun(scope.row.distance) + '米' }} </span>

            </template>
          </el-table-column>
          <el-table-column label="位置">
            <template slot-scope="scope">
              <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
              <span style="color:#f00">{{ scope.row.address }} </span>

            </template>
          </el-table-column>
        </template>
        <template v-if="selectType === '查询当日正常在岗时间'">
          <el-table-column label="电话">
            <template slot-scope="scope">
              <span>{{ scope.row.userphone }} </span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <span>{{ scope.row.username === 'noname' ? '-' : scope.row.username }} </span>
            </template>
          </el-table-column>
          <el-table-column label="在线时间">
            <template slot-scope="scope">
              <span>{{ scope.row.usertime }} </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>

    <!--excel表弹层 超15分钟-->
    <el-dialog title="提示" :modal-append-to-body="false" :close-on-click-modal='false' :visible.sync="excelShow"
      width="600px">
      <div class="excelTitle">
        是否要把<span>{{ dateSearch }}{{ selectType }}</span>导出为Excel表?
      </div>
      <div class="excelFooter">
        <el-button class="btnS_qx" @click="excelShow = false">取 消</el-button>
        <download-excel class="export-excel-wrapper" :data="excelpage" :header="excelName" :fields="json_fields"
          :name='excelName' :before-generate="startDownload">
          <el-button type="success">导出</el-button>
        </download-excel>
      </div>
    </el-dialog>

    <!--按日期按日期查询正常在岗时间-->
    <el-dialog :visible.sync="noPointShow" width="800px" center :modal-append-to-body='false'>
      <div class="titleDate"><span>{{ dateSearchPoint }}</span>日正常在岗时间</div>
      <div class="dcExcel">
        <span @click="excelBtn(2)"> <i class="el-icon-s-promotion"></i> 导出Excel</span>
      </div>
      <el-table :data="pointLists" height='600px' :header-cell-style="headStyle" :cell-style="rowStyle"
        :row-class-name="tableRowClassName">
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span>{{ scope.row.locationinfo != null ? scope.row.locationinfo : '暂未上传名字' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="userphone" label="电话号码"></el-table-column>
        <el-table-column property="infoflag" label="正常在岗时间">
          <template slot-scope="scope">
            <span v-if="scope.row.infoflag > 60">{{ fun(scope.row.infoflag / 60) }}小时</span>
            <span v-else>{{ scope.row.infoflag }}分钟</span>
          </template>

        </el-table-column>
      </el-table>
    </el-dialog>

    <!--excel表弹层 按日期查询传点次数-->
    <el-dialog title="提示" :modal-append-to-body="false" :close-on-click-modal='false' :visible.sync="excelShow2"
      width="600px">
      <div class="excelTitle">
        是否要把<span>{{ dateSearchPoint }}</span>指定日期不在点位的督导员导出为Excel表?
      </div>
      <div class="excelFooter">
        <el-button class="btnS_qx" @click="excelShow2 = false">取 消</el-button>
        <download-excel class="export-excel-wrapper" :data="excelpage" :header="excelName" :fields="json_fields"
          :name='excelName' :before-generate="startDownload2">
          <el-button type="success">导出</el-button>
        </download-excel>
      </div>
    </el-dialog>

    <!--加载效果-->
    <el-dialog :modal-append-to-body="false" :visible.sync="dataLoading" :close-on-click-modal='false' :show-close='false'
      width="30%" custom-class='bgColor'>
      <animCss :textLoad='textLoad'></animCss>

    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { notInLoaction, workerstatusStaytime, hxduserfindAll,getDeviceInfo, hxderrorFindAllByDate, filterTime, hxderrorFindAllToday2 } from '@/api/api'
import axios from '@/utils/request'
import vueSeamlessScroll from "vue-seamless-scroll";
import animCss from '../components/animCss/index.vue'
export default {
  props: ['getCurrent', 'localtion'],
  components: {
    vueSeamlessScroll, animCss
  },
  data() {
    return {
     
      deviceList: [],
      offlineDeviceList:[],
      deviceCount:0,
      axiosDom: axios,
      disnameValue: undefined,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      textLoad: '正在加载数据请稍后！',
      dataLoading: false, //加载弹层
      beyondLists: [],//超出15分钟的督导员
      absentShow: false,
      dateSearch: '',//选择日期进行查询督导员
      dateSearchPoint: '',//按日期查询传点次数
      pointLists: [],//按日期查询传点次数列表
      noPointShow: false,//不在点位弹出层显示
      borderImg: require('../assets/images/border4.png'),
      borderImg2: require('../assets/images/border5.png'),
      borderImg3: require('../assets/images/border2.png'),
      absent: [],//不在点位
      longTime: [],//长时间不一移动的
      timer: null,
      absentpoint: '',//当前不在点位的督导员显示
      iconLsRed: require("../assets/images/red.png"),
      iconLOrange: require("../assets/images/orange.png"),
      zbLsRed: require("../assets/images/wsxRed.png"),
      zbLsOrange: require("../assets/images/zborange.png"),
      bzdProup: false,
      longtimeProup: false,//长时间不移动督导员弹层
      noDataPoint: {},//当前不在点位督导员弹层信息显示
      longDatatime: {},//长时间不移动督导员弹层信息显示

      mapShowIndex: -1,//地图显示判断
      //导出Excel
      excelShow: false, //按日期查询超15分钟的excel弹层
      excelShow2: false,//按日期查询传点次数
      excelName: '',//导出excel的名字
      excelpage: [],    // 存放用于导出excel的数据
      // json_fields:{
      //             序号:'ID',
      //             电话号码:'errormodel',
      //             违规时间:'errordate',
      //             超出范围米数:'errorinfo',
      // },
      json_fields: {},
      json_meta: [
        [
          {
            " key ": " charset ",
            " value ": " utf- 8 "
          }
        ]
      ],
      selectType: undefined,
      selectTypes: [
        // {
        //   value: '超15分钟离岗人员',
        //   label: '超15分钟离岗人员'
        // },
        {
          value: '查询当日正常在岗时间',
          label: '查询当日正常在岗时间'
        },
        // {
        //   value: '当日不在点位督导员',
        //   label: '当日不在点位督导员'
        // },
        {
          value: '当日长时间不移动督导员',
          label: '当日长时间不移动督导员'
        },
      ],
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.7, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
        startTime: undefined,
        endTime: undefined,
        absentpoint: null,
        longtimepoint: null,
      };
    },
  },
  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  created() {
    this.absentpoint = new BMapGL.Icon(this.zbLsRed, new BMapGL.Size(18, 30));// 创建不在点位的督导员
    this.longtimepoint = new BMapGL.Icon(this.zbLsOrange, new BMapGL.Size(18, 30));// 创建长时间不移动督导员
  },
  mounted() {
    this.getNotInLoaction(this.localtion)
    this.getDevice()
    // this.getWorkerstatusStaytime(this.localtion)
    this.timer = setInterval(() => {//每隔5分鐘刷新一次接口
      this.getNotInLoaction(this.localtion)
      this.getWorkerstatusStaytime(this.localtion)
    }, 300000)
    this.$once('hook:beforeDestroy', () => { clearInterval(this.timer); })//防止setInterval多次请求

    //    console.log('getCurrent',this.getCurrent)
  },

  watch: {
    getCurrent: {
      handler(newValue, oldValue) {
        /**
       * 0  当前不在点位的督导员
       * 1  常时间不移动的督导员
       * 2  实时在线的督导员
       * map.removeOverlay(iMarker);
       */
        this.mapShowIndex = newValue
        this.$parent.map.clearOverlays()
        switch (newValue) {
          case 0:
            this.getNotInLoaction()
            break;
          case 1:
            this.getWorkerstatusStaytime()
            break;
          case 2:

            break;

        }
      },
      deep: true
    }
  },
  methods: {

    excelBtn(index) {//导出excel表弹层
      switch (index) {
        case 1:
          this.excelShow = true
          break;
        case 2:
          this.excelShow2 = true
          break;
      }

    },

    getDevice(){
          
          let data = {coordinate:"104.679127, 31.467673"}
         getDeviceInfo(data).then((res) =>{
              this.deviceList = res.data.filter(item=>{
                  return item.style == 0
              })
              this.offlineDeviceList = res.data.filter(item=>{
                  return item.style == 1
              })
              this.deviceCount = res.data.length

          })
   
    },


    async startDownload() { // 导出excel按钮 超出15分钟离岗人员
      for (var i = 0; i < this.beyondLists.length; i++) {//添加序号
        this.beyondLists[i].ID = i + 1;
        this.beyondLists[i].infoflag = this.beyondLists[i].infoflag != null ? this.beyondLists[i].infoflag : '暂未上传名字'
      }
      this.excelpage = this.beyondLists
      this.excelName = `${this.dateSearch}${this.selectType}`

      this.excelShow = false
      setTimeout(() => {
        this.$notify({
          title: '成功',
          message: `${this.dateSearch}${this.selectType}导出Excel成功,下载完成，请自行打开Excel表！`,
          type: 'success',
          duration: 6000
        });
      }, 2000)
    },

    async startDownload2() { // 导出excel按钮 查询点数
      for (var i = 0; i < this.pointLists.length; i++) {//添加序号
        this.pointLists[i].ID = i + 1;
        this.pointLists[i].locationinfo = this.pointLists[i].locationinfo != null ? this.pointLists[i].locationinfo : '暂未上传名字'
        this.pointLists[i].infoflag = this.pointLists[i].infoflag > 60 ? Number(this.pointLists[i].infoflag / 60).toFixed(2) + '小时' : this.pointLists[i].infoflag + '分钟'
      }
      this.excelpage = this.pointLists
      this.excelName = `${this.dateSearchPoint}日正常在岗时间`

      this.excelShow2 = false
      setTimeout(() => {
        this.$notify({
          title: '成功',
          message: `${this.dateSearchPoint}传点次数导出Excel成功,下载完成，请自行打开Excel表！`,
          type: 'success',
          duration: 6000
        });
      }, 2000)
    },



    fun(val) {//保留2位小数
      return Number(val).toFixed(2);
    },

    headStyle() {
      return "text-align:center;background:#18c79c; font-size:16px;color:#fff"
    },
    rowStyle() {
      return "text-align:center"
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }

    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }

    },
    towNumber(val) {//保留2位小数
      return val.toFixed(2)
    },
    changeDate(e) {//选择日期 超15分钟离岗人员
      this.startTime = e

    },

    searchDdyBtn() {//更根据日期查询督导员
      if (this.selectType === '超15分钟离岗人员' && !this.dateSearch) {
        this.$message.warning('请选择查询类型，并选择查询日期');
      } else if (!this.selectType) {
        this.$message.warning('请选择查询类型')
      } else {
        if (this.selectType === '超15分钟离岗人员') {
          this.dataLoading = true

          hxderrorFindAllByDate({ start: this.startTime, disname: this.localtion }).then(res => {
            if (res) {
              this.dataLoading = false
              for (let i in res) {
                this.beyondLists.push({
                  errormodel: i,
                  errorinfo: res[i].split('&')[0],
                  errorname: res[i].split('&')[1]
                })
              }

              this.json_fields = {//excel
                序号: 'ID',
                姓名: 'name',
                电话号码: 'errormodel',
                // 违规时间: 'errordate',
                超15分钟离岗次数: 'errorinfo',
              }
              if (this.beyondLists.length > 0) {
                this.absentShow = true
              } else {
                this.$message.warning('暂无数据');
              }
            } else {

              this.dataLoading = false
              this.$message.warning('暂无数据');

            }
          })
        } else if (this.selectType === '查询当日正常在岗时间') {
          this.dataLoading = true
          hxderrorFindAllToday2({ start: moment(new Date()).format('YYYY-MM-DD'), disname: this.localtion }).then(res => {
            console.log(res)
            if (res.length) {
              this.dataLoading = false
              this.beyondLists = res
              this.json_fields = {//excel
                序号: 'ID',
                姓名: 'username',
                电话号码: 'userphone',
                在线时长: 'usertime',
              }
              if (this.beyondLists.length > 0) {
                this.absentShow = true
              } else {
                this.$message.warning('暂无数据');
              }
            } else {
              this.dataLoading = false
              this.$message.warning('暂无数据');
            }
          })
        } else if (this.selectType === '当日不在点位督导员') {

          this.dataLoading = true

          notInLoaction({ start: moment(new Date()).format('YYYY-MM-DD'), disname: this.localtion }).then(res => {
            // console.log(res)
            if (res) {
              res = Object.values(res); //对象转数组
              res = res.filter(item => item.indexOf(axios.waresofeLocation !== '涪城' && axios.waresofeLocation !== '安州' ? '四川省' + axios.waresofeLocation : axios.waresofeLocation) > -1)
              // if (Object.keys(res).length) {
              //   let vals = Object.values(res); //对象转数组
              //   this.absent = vals.map((item, index) => {
              //     let newarr = item.split('&')
              //     return {
              //       distance: parseFloat(newarr[0]).toFixed(2),
              //       adress: newarr[1],
              //       lat: newarr[2],
              //       lng: newarr[3],
              //       tel: Object.keys(res)[index]
              //     }

              //   }).filter(item2 => item2)
              //   this.absentShow = true
              // }
              this.dataLoading = false
              for (let i in res) {
                this.beyondLists.push({
                  errormodel: i,
                  distance: res[i].split('&')[0],
                  address: res[i].split('&')[1]
                })
              }

              this.json_fields = {//excel
                序号: 'ID',
                姓名: 'name',
                电话号码: 'errormodel',
                // 违规时间: 'errordate',
                距离定点位置距离: 'distance',
                地址: 'address'
              }

              if (this.beyondLists.length > 0) {
                this.absentShow = true
              } else {
                this.$message.warning('暂无数据');
              }
            } else {
              this.dataLoading = false
              this.$message.warning('暂无数据');
            }
          })

        } else if (this.selectType === '当日长时间不移动督导员') {
          this.dataLoading = true
          workerstatusStaytime({ start: moment(new Date()).format('YYYY-MM-DD'), disname: this.localtion }).then(res => {
            console.log(res)
            if (res) {
              this.dataLoading = false
              for (let i in res) {
                this.beyondLists.push({
                  errormodel: res[i].userphone,
                  errorinfo: res[i].infoflag,
                  errorname: res[i].username
                })
              }

              this.json_fields = {//excel
                序号: 'ID',
                姓名: 'name',
                电话号码: 'errormodel',
                // 违规时间: 'errordate',
                当天移动总距离: 'errorinfo',
              }
              this.absentShow = true
              if (this.beyondLists.length > 0) {
                this.absentShow = true
              } else {
                this.$message.warning('暂无数据');
              }

            } else {
              this.dataLoading = false
              this.$message.warning('暂无数据');
            }
          })
        }
      }
    },
    changeDatePoint(e) {//按日期查询传点次数
      //   this.dateSearchPoint = filterTime(e)
      console.log(e)
      //    console.log('dateSearchPoint',this.dateSearchPoint)
    },
    searchPoint() {

      if (this.dateSearchPoint != '' && filterTime(this.dateSearchPoint) != '1970-01-01') {
        this.dataLoading = true
        hxderrorFindAllToday2({ date: filterTime(this.dateSearchPoint) }).then(res => {
          if (res.length) {
            this.dataLoading = false
            this.pointLists = res
            this.noPointShow = true
            this.json_fields = {//excel
              序号: 'ID',
              姓名: 'locationinfo',
              电话号码: 'userphone',
              正常在岗时间: 'infoflag',
            }

          }

        })
      } else {
        this.$message.error('请选择日期查询正常在岗时间！');
      }
    },
    getNotInLoaction(name) {//红色
      name = name ? name : axios.waresofeLocation
      notInLoaction({ start: moment(new Date()).format('YYYY-MM-DD'), disname: this.localtion }).then(res => {

        if (Object.keys(res).length) {
          let vals = Object.values(res); //对象转数组
          if (name !== '总公司') {
            vals = vals.filter(item => item.indexOf(name !== '涪城' && name !== '安州' ? '四川省' + name : name) > -1)
          }
          this.absent = vals.map((item, index) => {
            let newarr = item.split('&')
            return {
              distance: parseFloat(newarr[0]).toFixed(2),
              adress: newarr[1],
              lat: newarr[2],
              lng: newarr[3],
              tel: Object.keys(res)[index]
            }

          }).filter(item2 => item2)
          this.absent.map(item => {
            //创建当前不在点位督导员的坐标点
            let pt = new BMapGL.Point(item.lng, item.lat),
              marker = new BMapGL.Marker(pt, { icon: this.absentpoint });
            this.$parent.map.addOverlay(marker)
            // let content = "";//创建坐标点上的 浮层
            // content = `<p class='labelW' onclick='noAbsentPoint(${JSON.stringify(item)})'><img style='width:25px; height:25px' src='${this.iconLsRed}'/><span>${item.tel}</span></p>`
            let opts = {
              position: new BMapGL.Point(item.lng, item.lat), // 指定文本标注所在的地理位置
              offset: new BMapGL.Size(0, -60) // 设置文本偏移量
            };

            marker.addEventListener("click", function () {

              window.noAbsentPoint(item);
            });
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
            // this.$parent.map.addOverlay(label1)

            window.noAbsentPoint = (info) => {
              this.bzdProup = true
              this.noDataPoint = {
                tel: info.tel,
                adress: info.adress,
                distance: info.distance
              }
            }
          })



        } else {
          this.absent = []
        }

        // console.log('newsArr', res)     
      })
    },


    getWorkerstatusStaytime(name) {//长时间不移动督导员  橙色
      console.log(name)
      workerstatusStaytime({ start: moment(new Date()).format('YYYY-MM-DD'), disname: name }).then(res => {
        if (res.length) {

          this.longTime = res.map((item, index) => {
            console.log(item.userrule)
            if (item.userrule) {
              return {
                lat: item.userrule.split('-')[0],
                lng: item.userrule.split('-')[1],
                tel: item.userphone,
                infoflag: item.infoflag,
                username: item.username
              }
            }
          })

          this.longTime.map(item => {
            console.log(item)
            if (item) {
              //创建长时间不移动督导员的坐标点
              let pt = new BMapGL.Point(item.lng, item.lat),
                marker = new BMapGL.Marker(pt, { icon: this.longtimepoint });
              this.$parent.map.addOverlay(marker)
              // let content2 = "";//创建坐标点上的 浮层
              // content2 = `<p class='labelW' onclick='longtimePoint(${JSON.stringify(item)})'><img style='width:25px; height:25px' src='${this.iconLOrange}'/><span>${item.tel}</span></p>`
              let opts2 = {
                position: new BMapGL.Point(item.lng, item.lat), // 指定文本标注所在的地理位置
                offset: new BMapGL.Size(0, -60) // 设置文本偏移量
              };
              marker.addEventListener("click", function () {

                window.longtimePoint(item);
              });
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
              // this.$parent.map.addOverlay(label2)

              window.longtimePoint = (info) => {
                this.longtimeProup = true
                this.noDataPoint = {
                  tel: info.tel,
                  adress: info.adress,
                  distance: info.distance,
                  infoflag: info.infoflag,
                  username: info.username
                }
              }
            }
          })
        }





      })
    }
  }
}
</script>

<style  lang='scss'>
  .zcUl1 {
      >li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 1.8rem;
        border-top: 1px solid #efefef;

        >span {
          font-size: 0.8rem;
          display: inline-block;
          width: 100%;
          text-align: left;
        }
      }
    }

</style>