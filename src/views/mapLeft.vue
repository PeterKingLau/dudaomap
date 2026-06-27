<template>
  <div class="mapHeight">
    <!---按日期查询超15分钟离岗人员-->
    <div class="styleCss normal">
      <div class="styleCssTitle lvs">
        <img
          src="../assets/images/icon-region-filter.svg"
          alt=""
          style="height: 20px; width: 20px"
        />
        <span>{{ "监控区域" }}</span>
      </div>
      <div class="searchDdy searchDdy--region">
        <div>
          <el-cascader
            v-model="disnameValue"
            :options="REGION_CASCADER_OPTIONS"
            :props="regionCascaderProps"
            @change="handleDisnameChange"
            @clear="handleDisnameClear"
            clearable
            size="small"
            placement="bottom-start"
            popper-class="map-filter-select-popper"
            :teleported="false"
            placeholder="请选择区域"
          />
        </div>
      </div>
      <div class="styleCssTitle lvs">
        <img
          src="../assets/images/icon-region-filter.svg"
          alt=""
          style="height: 20px; width: 20px"
        />
        <span>{{ selectType || "当前查询类型" }}</span>
      </div>

      <div class="searchDdy searchDdy--query">
        <el-select
          v-model="selectType"
          @change="dateSearch = ''"
          clearable
          size="small"
          placement="bottom-start"
          popper-class="map-filter-select-popper"
          :teleported="false"
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div v-if="selectType === '超15分钟离岗人员'">
          <el-date-picker
            v-model="dateSearch"
            type="date"
            size="small"
            :placeholder="'请选择日期'"
            :editable="false"
            @change="changeDate"
            :value-format="'YYYY-MM-DD'"
          >
          </el-date-picker>
        </div>
        <el-button
          size="small"
          type="primary"
          :icon="Search"
          @click="searchDdyBtn"
          >查询</el-button
        >
      </div>

      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/icon-attendance-time.svg" alt=""> <span>按日期查询正常在岗时间</span>
      </div> -->

      <!--/查询当日正常在岗时间-->

      <!--/当日不在点位人员-->
      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/icon-region-filter.svg" alt=""> <span>查询
          
          当日不在点位人员</span>
      </div>

      <div class="searchDdy">
        <div>
          <el-date-picker v-model="dateSearchPoint" type="datetimerange" size="small" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :value-format="'yyyy-MM-dd HH:mm:ss'" @change='changeDatePoint' :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" :icon="Search" @click="searchPoint">查询</el-button>
      </div> -->

      <!--/长时间不移动人员-->
      <!-- <div class="styleCssTitle lvs">
        <img src="../assets/images/icon-region-filter.svg" alt=""> <span>当日长时间不移动人员</span>
      </div>

      <div class="searchDdy">
        <div>
          <el-date-picker v-model="dateSearchPoint" type="datetimerange" size="small" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :value-format="'yyyy-MM-dd HH:mm:ss'" @change='changeDatePoint' :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" :icon="Search" @click="searchPoint">查询</el-button>
      </div> -->
    </div>
    <!--/styleCss-->

    <div
      class="styleCss normal"
      :style="{ backgroundImage: `url(${borderImg3})` }"
    >
      <div class="styleCssTitle">
        <img src="../assets/images/icon-status-normal.svg" alt="" />
        <span>总设备数量</span>
        <em class="onlineStyle"
          ><em style="color: #4d4d4d">{{ deviceCount }}</em
          >台</em
        >
      </div>
    </div>

    <div
      class="styleCss normal"
      :style="{ backgroundImage: `url(${borderImg})` }"
    >
      <div class="styleCssTitle">
        <img src="../assets/images/icon-status-normal.svg" alt="" />
        <span>正常运行设备</span>
        <em class="onlineStyle"
          ><em style="color: #4d4d4d">{{ deviceList.length }}</em
          >台</em
        >
      </div>
      <div class="zcNormal zcline">
        <div class="zcNormaltitle">
          <span>设备名称</span>
        </div>

        <AutoScroll
          :data="deviceList"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl1" v-if="deviceList.length">
            <li v-for="(item, index) in deviceList" :key="index * 0.1">
              <span>{{ item.name }}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
    </div>

    <div
      class="styleCss normal is-offline-device"
      :style="{ backgroundImage: `url(${borderImg3})` }"
    >
      <div class="styleCssTitle bzDcolor">
        <img src="../assets/images/icon-person-off-duty.svg" alt="" />
        <span>离线设备</span>
        <em class="onlineStyle"
          ><em style="color: #4d4d4d">{{ offlineDeviceList.length }}</em
          >台</em
        >
      </div>
      <div class="zcNormal offlineLine">
        <div class="zcNormaltitle">
          <span>离线设备名称</span>
        </div>

        <AutoScroll
          :data="offlineDeviceList"
          :class-option="classOption"
          class="seamless-warp"
        >
          <ul class="zcUl1" v-if="offlineDeviceList.length">
            <li v-for="(item, index) in offlineDeviceList" :key="index * 0.1">
              <span>{{ item.name }}</span>
            </li>
          </ul>

          <div v-else class="zwData">暂无</div>
        </AutoScroll>
      </div>
    </div>

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
          <span
            ><img src="../assets/images/icon-off-duty-phone.png" alt="" /></span
          >{{ noDataPoint.tel }}
        </p>
        <p>
          <span
            ><img
              src="../assets/images/icon-off-duty-address.png"
              alt="" /></span
          >{{ noDataPoint.adress }}
        </p>
        <p>
          距离定点位置距离:<em style="color: #ff0000; font-style: normal">
            {{ noDataPoint.distance }}</em
          >米
        </p>
      </div>
    </el-dialog>

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
          <span
            ><img
              src="../assets/images/icon-stationary-phone.png"
              alt="" /></span
          >{{ noDataPoint.tel }}
        </p>
        <!-- <p>
          <span><img src="../assets/images/icon-stationary-address.png" alt="" /></span>{{ noDataPoint.adress }}
        </p> -->
        <p v-if="noDataPoint.username">
          姓名:<em style="color: #f75d00; font-style: normal">
            {{ noDataPoint.username }}</em
          >
        </p>
        <p>
          回传数据次数:<em style="color: #f75d00; font-style: normal">
            {{ noDataPoint.infoflag }}</em
          >
        </p>
      </div>
    </el-dialog>

    <!--指定日期不在点位的人员-->
    <el-dialog
      title="查询结果"
      v-model="absentShow"
      width="800px"
      custom-class="queryResultDialog"
      class="queryResultDialog"
      center
      :modal-append-to-body="false"
      @close="beyondLists = []"
    >
      <div class="titleDate">
        <span>{{ dateSearch ? dateSearch : "" }}</span
        >{{ selectType }}<span>{{ beyondLists.length }}</span
        >位
      </div>
      <!-- <div style="margin: 0 0  20px 0">
                        <el-button :icon="Promotion" @click="excelBtn" type="success">导出Excel</el-button>
                        </div> -->
      <div class="dcExcel">
        <span @click="excelBtn(1)">
          <el-icon><Promotion /></el-icon> 导出Excel</span
        >
        <!-- <el-button :icon="Promotion" @click="excelBtn" type="success">导出Excel</el-button> -->
      </div>
      <el-table
        :data="beyondLists"
        height="400px"
        empty-text="暂无数据"
        :header-cell-style="headStyle"
        :cell-style="rowStyle"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column
          label="姓名"
          v-if="
            selectType !== '当日长时间不移动人员' &&
            selectType !== '查询当日正常在岗时间'
          "
        >
          <template #default="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span>{{
              scope.row.infoflag != null ? scope.row.infoflag : "暂未上传名字"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="selectType !== '查询当日正常在岗时间'"
          property="errormodel"
          label="电话号码"
        ></el-table-column>
        <!-- <el-table-column property="errordate" label="违规时间"></el-table-column> -->
        <!-- <el-table-column label="超出范围">
          <template #default="scope">
            <span style="color:#f00">{{ fun(scope.row.errorinfo) }} 米</span>
          </template>
        </el-table-column> -->
        <el-table-column
          label="超15分钟离岗次数"
          v-if="selectType === '超15分钟离岗人员'"
        >
          <template #default="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span style="color: #f00">{{ scope.row.errorinfo }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="当日长时间不移动人员"
          v-if="selectType === '当日长时间不移动人员'"
        >
          <template #default="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span style="color: #f00">{{ scope.row.errorinfo }} </span>
          </template>
        </el-table-column>
        <template v-if="selectType === '当日不在点位人员'">
          <el-table-column label="距离定点位置距离">
            <template #default="scope">
              <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
              <span style="color: #f00"
                >{{ fun(scope.row.distance) + "米" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="位置">
            <template #default="scope">
              <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
              <span style="color: #f00">{{ scope.row.address }} </span>
            </template>
          </el-table-column>
        </template>
        <template v-if="selectType === '查询当日正常在岗时间'">
          <el-table-column label="电话">
            <template #default="scope">
              <span>{{ scope.row.userphone }} </span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template #default="scope">
              <span
                >{{
                  scope.row.username === "noname" ? "-" : scope.row.username
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="在线时间">
            <template #default="scope">
              <span>{{ scope.row.usertime }} </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-dialog>

    <!--excel表弹层 超15分钟-->
    <el-dialog
      title="提示"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-model="excelShow"
      width="600px"
      custom-class="excelConfirmDialog"
      class="excelConfirmDialog"
    >
      <div class="excelTitle">
        是否要把<span>{{ dateSearch }}{{ selectType }}</span
        >导出为Excel表?
      </div>
      <div class="excelFooter">
        <el-button class="btnS_qx" @click="excelShow = false">取 消</el-button>
        <download-excel
          class="export-excel-wrapper"
          :data="excelpage"
          :header="excelName"
          :fields="json_fields"
          :name="excelName"
          :before-generate="startDownload"
        >
          <el-button type="success">导出</el-button>
        </download-excel>
      </div>
    </el-dialog>

    <!--按日期按日期查询正常在岗时间-->
    <el-dialog
      title="查询结果"
      v-model="noPointShow"
      width="800px"
      custom-class="queryResultDialog"
      class="queryResultDialog"
      center
      :modal-append-to-body="false"
    >
      <div class="titleDate">
        <span>{{ dateSearchPoint }}</span
        >日正常在岗时间
      </div>
      <div class="dcExcel">
        <span @click="excelBtn(2)">
          <el-icon><Promotion /></el-icon> 导出Excel</span
        >
      </div>
      <el-table
        :data="pointLists"
        height="400px"
        empty-text="暂无数据"
        :header-cell-style="headStyle"
        :cell-style="rowStyle"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column label="姓名">
          <template #default="scope">
            <!-- <span  style="color:#f00">{{scope.row.errorinfo || numFilter}}米</span> -->
            <span>{{
              scope.row.locationinfo != null
                ? scope.row.locationinfo
                : "暂未上传名字"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="userphone"
          label="电话号码"
        ></el-table-column>
        <el-table-column property="infoflag" label="正常在岗时间">
          <template #default="scope">
            <span v-if="scope.row.infoflag > 60"
              >{{ fun(scope.row.infoflag / 60) }}小时</span
            >
            <span v-else>{{ scope.row.infoflag }}分钟</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--excel表弹层 按日期查询传点次数-->
    <el-dialog
      title="提示"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      v-model="excelShow2"
      width="600px"
      custom-class="excelConfirmDialog"
      class="excelConfirmDialog"
    >
      <div class="excelTitle">
        是否要把<span>{{ dateSearchPoint }}</span
        >指定日期不在点位的人员导出为Excel表?
      </div>
      <div class="excelFooter">
        <el-button class="btnS_qx" @click="excelShow2 = false">取 消</el-button>
        <download-excel
          class="export-excel-wrapper"
          :data="excelpage"
          :header="excelName"
          :fields="json_fields"
          :name="excelName"
          :before-generate="startDownload2"
        >
          <el-button type="success">导出</el-button>
        </download-excel>
      </div>
    </el-dialog>

    <!--加载效果-->
    <el-dialog
      :modal-append-to-body="false"
      v-model="dataLoading"
      :close-on-click-modal="false"
      :show-close="false"
      width="340px"
      custom-class="bgColor"
    >
      <AnimCss :textLoad="textLoad"></AnimCss>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import { ElMessage, ElNotification } from "element-plus";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/notification/style/css";
import { Promotion, Search } from "@element-plus/icons-vue";
import {
  notInLoaction,
  workerstatusStaytime,
  getDeviceInfo,
  hxderrorFindAllByDate,
  filterTime,
  hxderrorFindAllToday2,
} from "@/api/api";
import axios from "@/utils/request";
import AnimCss from "../components/animCss/index.vue";
import { getBMapGL } from "@/utils/baiduMap";
import {
  getRegionKeyword,
  OVERVIEW_REGION,
  REGION_CASCADER_OPTIONS,
} from "@/utils/mapConfig";

const props = defineProps({
  getCurrent: {
    type: Number,
    default: -1,
  },
  localtion: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["changeDisname"]);
const parentMap = inject("baiduMapRef", ref(null));
const assetUrl = (name) =>
  new URL(`../assets/images/${name}`, import.meta.url).href;
const regionCascaderProps = {
  emitPath: false,
  checkStrictly: true,
};

const deviceList = ref([]);
const offlineDeviceList = ref([]);
const deviceCount = ref(0);
const axiosDom = axios;
const disnameValue = ref(props.localtion || axios.waresofeLocation);
const pickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      },
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      },
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      },
    },
  ],
  disabledDate(time) {
    return time.getTime() > Date.now();
  },
};

const textLoad = ref("正在加载数据请稍后！");
const dataLoading = ref(false);
const beyondLists = ref([]);
const absentShow = ref(false);
const dateSearch = ref("");
const dateSearchPoint = ref("");
const pointLists = ref([]);
const noPointShow = ref(false);
const borderImg = assetUrl("panel-border-green.png");
const borderImg2 = assetUrl("panel-border-blue-soft.png");
const borderImg3 = assetUrl("panel-border-blue.png");
const absent = ref([]);
const longTime = ref([]);
const timer = ref(null);
const absentpoint = ref(null);
const longtimepoint = ref(null);
const iconLsRed = assetUrl("marker-person-off-duty-label.png");
const iconLOrange = assetUrl("marker-person-stationary-label.png");
const zbLsRed = assetUrl("marker-person-off-duty.png");
const zbLsOrange = assetUrl("marker-person-stationary.png");
const bzdProup = ref(false);
const longtimeProup = ref(false);
const noDataPoint = ref({});
const longDatatime = ref({});
const mapShowIndex = ref(-1);
const excelShow = ref(false);
const excelShow2 = ref(false);
const excelName = ref("");
const excelpage = ref([]);
const json_fields = ref({});
const json_meta = ref([
  [
    {
      " key ": " charset ",
      " value ": " utf-8 ",
    },
  ],
]);
const selectType = ref("查询当日正常在岗时间");
const selectTypes = [
  {
    value: "查询当日正常在岗时间",
    label: "查询当日正常在岗时间",
  },
  {
    value: "当日长时间不移动人员",
    label: "当日长时间不移动人员",
  },
];
const startTime = ref(undefined);
const endTime = ref(undefined);

const classOption = computed(() => ({
  step: 0.25,
  limitMoveNum: 5,
  hoverStop: true,
  direction: 1,
  openWatch: true,
  singleHeight: 0,
  singleWidth: 0,
  waitTime: 2000,
  startTime: undefined,
  endTime: undefined,
  absentpoint: null,
  longtimepoint: null,
}));

function currentLocation(name) {
  return (
    name ||
    props.localtion ||
    disnameValue.value ||
    OVERVIEW_REGION ||
    axios.waresofeLocation
  );
}

function handleDisnameChange(value) {
  if (!value) {
    handleDisnameClear();
    return;
  }

  emit("changeDisname", value);
}

function handleDisnameClear() {
  disnameValue.value = OVERVIEW_REGION;
  emit("changeDisname", OVERVIEW_REGION);
}

function ensureMarkerIcons() {
  const BMap = getBMapGL();
  if (!BMap) {
    return;
  }

  if (!absentpoint.value) {
    absentpoint.value = new BMap.Icon(zbLsRed, new BMap.Size(18, 30));
  }

  if (!longtimepoint.value) {
    longtimepoint.value = new BMap.Icon(zbLsOrange, new BMap.Size(18, 30));
  }
}

function excelBtn(index) {
  switch (index) {
    case 1:
      prepareBeyondExcel();
      if (!excelpage.value.length) {
        ElMessage.warning("暂无可导出的数据");
        return;
      }
      excelShow.value = true;
      break;
    case 2:
      preparePointExcel();
      if (!excelpage.value.length) {
        ElMessage.warning("暂无可导出的数据");
        return;
      }
      excelShow2.value = true;
      break;
  }
}

function prepareBeyondExcel() {
  excelpage.value = beyondLists.value.map((item, index) => ({
    ...item,
    ID: index + 1,
    infoflag: item.infoflag != null ? item.infoflag : "暂未上传名字",
  }));
  excelName.value = `${dateSearch.value}${selectType.value}.xls`;
}

function preparePointExcel() {
  excelpage.value = pointLists.value.map((item, index) => ({
    ...item,
    ID: index + 1,
    locationinfo: item.locationinfo != null ? item.locationinfo : "暂未上传名字",
    infoflag:
      item.infoflag > 60
        ? Number(item.infoflag / 60).toFixed(2) + "小时"
        : item.infoflag + "分钟",
  }));
  excelName.value = `${dateSearchPoint.value}日正常在岗时间.xls`;
}

function getDevice() {
  const data = { coordinate: "104.679127, 31.467673" };
  getDeviceInfo(data).then((res) => {
    const list = Array.isArray(res.data) ? res.data : [];
    deviceList.value = list.filter((item) => item.style == 0);
    offlineDeviceList.value = list.filter((item) => item.style == 1);
    deviceCount.value = list.length;
  });
}

async function startDownload() {
  for (let i = 0; i < beyondLists.value.length; i++) {
    beyondLists.value[i].ID = i + 1;
    beyondLists.value[i].infoflag =
      beyondLists.value[i].infoflag != null
        ? beyondLists.value[i].infoflag
        : "暂未上传名字";
  }

  prepareBeyondExcel();
  excelShow.value = false;
  setTimeout(() => {
    ElNotification({
      title: "成功",
      message: `${dateSearch.value}${selectType.value}导出Excel成功,下载完成，请自行打开Excel表！`,
      type: "success",
      duration: 6000,
    });
  }, 2000);
}

async function startDownload2() {
  for (let i = 0; i < pointLists.value.length; i++) {
    pointLists.value[i].ID = i + 1;
    pointLists.value[i].locationinfo =
      pointLists.value[i].locationinfo != null
        ? pointLists.value[i].locationinfo
        : "暂未上传名字";
    pointLists.value[i].infoflag =
      pointLists.value[i].infoflag > 60
        ? Number(pointLists.value[i].infoflag / 60).toFixed(2) + "小时"
        : pointLists.value[i].infoflag + "分钟";
  }

  preparePointExcel();
  excelShow2.value = false;
  setTimeout(() => {
    ElNotification({
      title: "成功",
      message: `${dateSearchPoint.value}传点次数导出Excel成功,下载完成，请自行打开Excel表！`,
      type: "success",
      duration: 6000,
    });
  }, 2000);
}

function fun(val) {
  return Number(val).toFixed(2);
}

function headStyle() {
  return "text-align:center;background:#18c79c; font-size:16px;color:#fff";
}

function rowStyle() {
  return "text-align:center";
}

function tableRowClassName({ rowIndex }) {
  return rowIndex % 2 === 0 ? "warning-row" : "success-row";
}

function towNumber(val) {
  return val.toFixed(2);
}

function changeDate(e) {
  startTime.value = e;
}

function searchDdyBtn() {
  if (selectType.value === "超15分钟离岗人员" && !dateSearch.value) {
    ElMessage.warning("请选择查询类型，并选择查询日期");
    return;
  }

  if (!selectType.value) {
    ElMessage.warning("请选择查询类型");
    return;
  }

  beyondLists.value = [];

  if (selectType.value === "超15分钟离岗人员") {
    dataLoading.value = true;
    hxderrorFindAllByDate({
      start: startTime.value,
      disname: currentLocation(),
    }).then((res) => {
      dataLoading.value = false;
      if (!res) {
        ElMessage.warning("暂无数据");
        return;
      }

      for (const i in res) {
        beyondLists.value.push({
          errormodel: i,
          errorinfo: res[i].split("&")[0],
          errorname: res[i].split("&")[1],
        });
      }

      json_fields.value = {
        序号: "ID",
        姓名: "name",
        电话号码: "errormodel",
        超15分钟离岗次数: "errorinfo",
      };
      showResultDialog();
    });
  } else if (selectType.value === "查询当日正常在岗时间") {
    dataLoading.value = true;
    hxderrorFindAllToday2({
      start: dayjs().format("YYYY-MM-DD"),
      disname: currentLocation(),
    }).then((res) => {
      dataLoading.value = false;
      if (res?.length) {
        beyondLists.value = res;
        json_fields.value = {
          序号: "ID",
          姓名: "username",
          电话号码: "userphone",
          在线时长: "usertime",
        };
        showResultDialog();
      } else {
        ElMessage.warning("暂无数据");
      }
    });
  } else if (selectType.value === "当日不在点位人员") {
    dataLoading.value = true;
    const region = currentLocation();
    notInLoaction({
      start: dayjs().format("YYYY-MM-DD"),
      disname: region,
    }).then((res) => {
      dataLoading.value = false;
      if (!res) {
        ElMessage.warning("暂无数据");
        return;
      }

      let list = Object.values(res);
      const regionKeyword = getRegionKeyword(region);
      if (regionKeyword) {
        list = list.filter((item) => item.indexOf(regionKeyword) > -1);
      }

      for (const i in list) {
        beyondLists.value.push({
          errormodel: i,
          distance: list[i].split("&")[0],
          address: list[i].split("&")[1],
        });
      }

      json_fields.value = {
        序号: "ID",
        姓名: "name",
        电话号码: "errormodel",
        距离定点位置距离: "distance",
        地址: "address",
      };
      showResultDialog();
    });
  } else if (selectType.value === "当日长时间不移动人员") {
    dataLoading.value = true;
    workerstatusStaytime({
      start: dayjs().format("YYYY-MM-DD"),
      disname: currentLocation(),
    }).then((res) => {
      dataLoading.value = false;
      if (!res) {
        ElMessage.warning("暂无数据");
        return;
      }

      for (const i in res) {
        beyondLists.value.push({
          errormodel: res[i].userphone,
          errorinfo: res[i].infoflag,
          errorname: res[i].username,
        });
      }

      json_fields.value = {
        序号: "ID",
        姓名: "name",
        电话号码: "errormodel",
        当天移动总距离: "errorinfo",
      };
      showResultDialog();
    });
  }
}

function showResultDialog() {
  if (beyondLists.value.length > 0) {
    absentShow.value = true;
  } else {
    ElMessage.warning("暂无数据");
  }
}

function changeDatePoint() {}

function searchPoint() {
  if (
    dateSearchPoint.value != "" &&
    filterTime(dateSearchPoint.value) != "1970-01-01"
  ) {
    dataLoading.value = true;
    hxderrorFindAllToday2({ date: filterTime(dateSearchPoint.value) }).then(
      (res) => {
        if (res.length) {
          dataLoading.value = false;
          pointLists.value = res;
          noPointShow.value = true;
          json_fields.value = {
            序号: "ID",
            姓名: "locationinfo",
            电话号码: "userphone",
            正常在岗时间: "infoflag",
          };
        }
      },
    );
  } else {
    ElMessage.error("请选择日期查询正常在岗时间！");
  }
}

function getNotInLoaction(name) {
  ensureMarkerIcons();
  const region = currentLocation(name);
  notInLoaction({
    start: dayjs().format("YYYY-MM-DD"),
    disname: region,
  }).then((res) => {
    if (Object.keys(res || {}).length) {
      const phones = Object.keys(res);
      let vals = Object.values(res);
      const regionKeyword = getRegionKeyword(region);
      if (regionKeyword) {
        vals = vals.filter((item) => item.indexOf(regionKeyword) > -1);
      }

      absent.value = vals
        .map((item, index) => {
          const newarr = item.split("&");
          return {
            distance: parseFloat(newarr[0]).toFixed(2),
            adress: newarr[1],
            lat: newarr[2],
            lng: newarr[3],
            tel: phones[index],
          };
        })
        .filter(Boolean);

      absent.value.forEach((item) => {
        const BMap = getBMapGL();
        if (!parentMap.value || !absentpoint.value || !BMap) {
          return;
        }

        const pt = new BMap.Point(item.lng, item.lat);
        const marker = new BMap.Marker(pt, { icon: absentpoint.value });
        parentMap.value.addOverlay(marker);
        marker.addEventListener("click", function () {
          window.noAbsentPoint(item);
        });

        window.noAbsentPoint = (info) => {
          bzdProup.value = true;
          noDataPoint.value = {
            tel: info.tel,
            adress: info.adress,
            distance: info.distance,
          };
        };
      });
    } else {
      absent.value = [];
    }
  });
}

function getWorkerstatusStaytime(name) {
  ensureMarkerIcons();
  const region = currentLocation(name);
  workerstatusStaytime({
    start: dayjs().format("YYYY-MM-DD"),
    disname: region,
  }).then((res) => {
    if (!res?.length) {
      longTime.value = [];
      return;
    }

    longTime.value = res
      .map((item) => {
        if (!item.userrule) {
          return null;
        }

        return {
          lat: item.userrule.split("-")[0],
          lng: item.userrule.split("-")[1],
          tel: item.userphone,
          infoflag: item.infoflag,
          username: item.username,
        };
      })
      .filter(Boolean);

    longTime.value.forEach((item) => {
      const BMap = getBMapGL();
      if (!parentMap.value || !longtimepoint.value || !BMap) {
        return;
      }

      const pt = new BMap.Point(item.lng, item.lat);
      const marker = new BMap.Marker(pt, { icon: longtimepoint.value });
      parentMap.value.addOverlay(marker);
      marker.addEventListener("click", function () {
        window.longtimePoint(item);
      });

      window.longtimePoint = (info) => {
        longtimeProup.value = true;
        noDataPoint.value = {
          tel: info.tel,
          adress: info.adress,
          distance: info.distance,
          infoflag: info.infoflag,
          username: info.username,
        };
      };
    });
  });
}

watch(
  () => props.localtion,
  (newValue) => {
    disnameValue.value = newValue || OVERVIEW_REGION;
  },
  { immediate: true },
);

watch(
  () => props.getCurrent,
  (newValue) => {
    mapShowIndex.value = newValue;
    parentMap.value?.clearOverlays?.();

    switch (newValue) {
      case 0:
        getNotInLoaction();
        break;
      case 1:
        getWorkerstatusStaytime();
        break;
      case 2:
        break;
    }
  },
);

watch(parentMap, (mapInstance) => {
  if (mapInstance) {
    getNotInLoaction(props.localtion);
  }
});

onMounted(() => {
  ensureMarkerIcons();
  getDevice();
  timer.value = setInterval(() => {
    if (document.hidden) {
      return;
    }

    getNotInLoaction(props.localtion);
    getWorkerstatusStaytime(props.localtion);
  }, 300000);
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

defineExpose({
  getNotInLoaction,
  getWorkerstatusStaytime,
});
</script>

<style lang="scss">
.leftPos {
  .mapHeight {
    gap: 18px;
  }

  .styleCss:first-child {
    min-height: 160px;
    padding-top: 6px;
  }

  .searchDdy {
    margin: 2px 8px 10px;
  }

  .styleCss:nth-child(2) {
    min-height: 52px;
  }

  .styleCss:nth-child(3),
  .styleCss:nth-child(4) {
    min-height: 150px;
  }

  .offlineLine {
    .zcNormaltitle {
      border-bottom: 1px solid #ff0000;
      background: #ff0000;
    }

    li > span {
      color: #ff0000;
    }
  }

  .is-offline-device {
    .styleCssTitle > span,
    .onlineStyle > em {
      color: #ff0000 !important;
    }
  }

  .seamless-warp {
    max-height: 84px;
  }
}

.queryResultDialog.el-dialog,
.queryResultDialog .el-dialog {
  border: 1px solid rgba(43, 151, 255, 0.28);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 46%);
  box-shadow: 0 16px 40px rgba(15, 44, 80, 0.28);
}

.queryResultDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 54px 12px;
    border-bottom: 1px solid rgba(43, 151, 255, 0.16);
  }

  .el-dialog__title {
    color: #1f5f96;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .el-dialog__headerbtn {
    top: 15px;
    right: 18px;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    &:hover {
      background: rgba(43, 151, 255, 0.1);
    }
  }

  .el-dialog__body {
    padding: 18px 24px 24px;
  }

  .titleDate {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 52px;
    margin-bottom: 14px;
    border: 1px solid rgba(54, 161, 255, 0.18);
    border-radius: 6px;
    color: #183a5a;
    background: linear-gradient(
      90deg,
      rgba(43, 151, 255, 0.1),
      rgba(1, 236, 12, 0.06)
    );
    font-size: 17px;
    font-weight: 700;
  }

  .titleDate span {
    color: #03a91c;
    font-size: 20px;
    font-weight: 800;
  }

  .dcExcel {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .dcExcel span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 14px;
    border: 1px solid rgba(1, 236, 12, 0.32);
    border-radius: 6px;
    color: #03a91c;
    background: rgba(1, 236, 12, 0.08);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      background: rgba(1, 236, 12, 0.16);
      box-shadow: 0 8px 18px rgba(1, 180, 35, 0.14);
    }
  }

  .el-table {
    border: 1px solid rgba(54, 161, 255, 0.14);
    border-radius: 6px;
    overflow: hidden;
    color: #263747;
    font-size: 14px;
  }

  .el-table th.el-table__cell {
    background: #03d822 !important;
    color: #ffffff !important;
    font-weight: 700;
  }

  .el-table td.el-table__cell {
    color: #263747;
    border-bottom-color: rgba(54, 161, 255, 0.1);
  }

  .el-table__body tr:hover > td.el-table__cell {
    background: rgba(43, 151, 255, 0.08) !important;
  }

  .el-table__empty-text {
    color: #7b8b9b;
    font-size: 15px;
    font-weight: 600;
  }

  .el-table .el-scrollbar__bar.is-horizontal {
    display: none;
  }

  .el-table .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.excelConfirmDialog.el-dialog,
.excelConfirmDialog .el-dialog {
  border: 1px solid rgba(43, 151, 255, 0.24);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 48%);
  box-shadow: 0 16px 40px rgba(15, 44, 80, 0.26);
}

.excelConfirmDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 54px 12px;
    border-bottom: 1px solid rgba(43, 151, 255, 0.16);
  }

  .el-dialog__title {
    color: #1f5f96;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .el-dialog__headerbtn {
    top: 15px;
    right: 18px;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    &:hover {
      background: rgba(43, 151, 255, 0.1);
    }
  }

  .el-dialog__body {
    padding: 22px 32px 26px;
  }

  .excelTitle {
    display: block;
    min-height: 72px;
    padding: 14px 18px;
    border: 1px solid rgba(54, 161, 255, 0.16);
    border-radius: 6px;
    color: #263747;
    background: linear-gradient(
      90deg,
      rgba(43, 151, 255, 0.08),
      rgba(1, 236, 12, 0.06)
    );
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    text-align: center;
  }

  .excelTitle span {
    margin: 0 6px;
    color: #03a91c;
    font-size: inherit;
    font-weight: 800;
    line-height: inherit;
    vertical-align: baseline;
  }

  .excelFooter {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 22px;
  }

  .el-button {
    min-width: 76px;
    height: 36px;
    border-radius: 6px;
    font-weight: 700;
  }

  .btnS_qx {
    border-color: rgba(123, 139, 155, 0.28);
    color: #526273;
    background: #ffffff;

    &:hover {
      border-color: rgba(43, 151, 255, 0.38);
      color: #1f5f96;
      background: rgba(43, 151, 255, 0.08);
    }
  }

  .export-excel-wrapper .el-button {
    border-color: #11c46a;
    background: #11c46a;

    &:hover {
      border-color: #0ead5c;
      background: #0ead5c;
    }
  }
}

.zcUl1 {
  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    border-top: 1px solid #efefef;

    > span {
      font-size: 0.8rem;
      display: inline-block;
      width: 100%;
      text-align: left;
    }
  }
}
</style>
