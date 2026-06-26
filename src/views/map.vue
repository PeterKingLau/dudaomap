<template>
  <div class="mapContent">
    <!--头部-->
    <div class="headerTitle" :style="{ backgroundImage: `url(${bgImg})` }">
      <div>调度指挥中心</div>
      <span class="timeAnim1"></span>
      <span class="timeAnim2"></span>
      <span class="timeAnim3"></span>
      <span class="timeAnim4"></span>
    </div>
    <div class="mapLeft mapLeftHeight">
      <div v-show="elAmap" class="mapLeftHeight" id="container"></div>
      <!--主页第一层地图-->
      <div
        v-show="superintendentMap"
        class="mapLeftHeight"
        id="superintendent"
      ></div>
    </div>
    <!--/mapLeft-->

    <div class="mapRight">
      <MapRight
        ref="rightMapRef"
        :localtion="localtion"
        :getCurrent="currenIndex"
      ></MapRight>
    </div>
    <!--//mapRight-->

    <!--左边 当前不在点位人员，长时间不移动人员-->
    <div class="leftPos">
      <MapLeft
        @changeDisname="initRightTable"
        :getCurrent="currenIndex"
        :localtion="localtion"
        ref="leftMethods"
      >
      </MapLeft>
    </div>
    <!--leftPos-->

    <!--地图不在点位，长时间不移动，实时在线的人员切换 -->
    <!-- <div class="fixedBottom">
      <ul>
        <li class="item" v-for="(item,index) in listFixBot" :key="index">
          <div @click="lookMap(index)" :class="index ==currenIndex?'active':''">{{item}}</div>
        </li>

      </ul>
    </div> -->

    <el-dialog
      title="实时在线的人员"
      v-model="centerDialogVisible"
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
          <span><img src="../assets/images/zcTrack.png" alt="" /> </span>
          <em class="history" style="color: #01ec0c" @click="lookHistory"
            >查看历史轨迹线</em
          >
        </p>
      </div>
    </el-dialog>

    <el-dialog
      title="设备状态"
      v-model="centerDeviceVisible"
      width="520px"
      custom-class="zcLine deviceStatusDialog"
      class="deviceStatusDialog"
      center
    >
      <div class="deviceStatusCard">
        <div class="deviceStatusCard__header">
          <span class="deviceStatusCard__dot" :class="deviceStatusClass"></span>
          <div>
            <strong>{{ proupDe.name || "未知设备" }}</strong>
            <p>设备运行状态</p>
          </div>
          <em class="deviceStatusCard__tag" :class="deviceStatusClass">
            {{ proupDe.stat || "--" }}
          </em>
        </div>

        <div class="deviceStatusCard__list">
          <div class="deviceStatusCard__item">
            <span><img src="../assets/images/zcName.png" alt="" /></span>
            <div>
              <label>设备名称</label>
              <p>{{ proupDe.name || "--" }}</p>
            </div>
          </div>
          <div class="deviceStatusCard__item">
            <span><img src="../assets/images/zcAdress.png" alt="" /></span>
            <div>
              <label>所在位置</label>
              <p>{{ proupDe.add || "--" }}</p>
            </div>
          </div>
          <div class="deviceStatusCard__item">
            <span><img src="../assets/images/zcTel.png" alt="" /></span>
            <div>
              <label>当前状态</label>
              <p>{{ proupDe.stat || "--" }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="centerDialogVisible_Zc"
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
          <span><img src="../assets/images/zcTrack.png" alt="" /> </span>
          <em class="history" style="color: #01ec0c" @click="lookHistory"
            >查看历史轨迹线</em
          >
        </p>
      </div>
    </el-dialog>

    <el-dialog
      title="长时间未移动的人员"
      v-model="centerDialogVisible_Cs"
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
          <span><img src="../assets/images/csTrack.png" alt="" /> </span>
          <em class="history" style="color: #1296db" @click="lookHistory"
            >查看历史轨迹线</em
          >
        </p>
      </div>
    </el-dialog>

    <!--查看轨迹弹窗显示-->
    <el-dialog
      title="请选择时间查询历史轨迹"
      v-model="historyTrack"
      width="500px"
      custom-class="zcLine"
      center
    >
      <div class="superintendent">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
          label-width="100px"
        >
          <el-form-item label="电话号码">
            <el-input v-model="proupSs.tel" readonly="readonly"></el-input>
          </el-form-item>

          <el-form-item label="选择日期" prop="date">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              v-loading.fullscreen.lock="fullscreenLoading"
              >查找</el-button
            >
          </el-form-item>
        </el-form>
        <div class="trackLine" v-show="tsTrack">
          <el-icon><Warning /></el-icon> 暂无当前时间段人员的轨迹线
        </div>
      </div>
      <!--/superintendent-->
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref } from "vue";
import MapRight from "../views/mapRight.vue";
import MapLeft from "../views/mapLeft.vue";
import { Warning } from "@element-plus/icons-vue";
import axios from "@/utils/request";
import {
  point as pointApi,
  hxdlocationFindAll as hxdlocationFindAllApi,
  getDeviceInfo,
} from "@/api/api";
import Bus from "../utils/eventBus";
import today from "@/utils/today";
import { filterTime } from "@/utils/today.js";

const assetUrl = (name) =>
  new URL(`../assets/images/${name}`, import.meta.url).href;

const mapObj = {
  涪城: [104.679127, 31.467673],
  总公司: [104.679127, 31.467673],
  广汉: [104.28249, 30.97706],
  安州: [104.56735, 31.45475],
  南充: [106.118889, 30.781529],
  射洪: [105.38836, 30.87113],
  成华: [104.10194, 30.65984],
};

const rightMapRef = ref(null);
const leftMethods = ref(null);
const ruleFormRef = ref(null);

const listFixBot = ref([
  "当前不在点位的人员",
  "长时间不移动的人员",
  "实时在线的人员",
]);
const currenIndex = ref(-1);
const bgImg = assetUrl("ddytitle.png");
const trackElamap = ref(false);
const zoom = ref(13);
const visible = ref(true);
const postFd = reactive({ top: 100, left: 120 });
const center = ref([104.679127, 31.467673]);
const position = ref([104.674063, 31.467161]);
const center2 = ref([]);
const offset = ref([0, -40]);
const iconLs = assetUrl("lvs.png");
const iconLsYellow = assetUrl("lvs.png");
const iconDevB = assetUrl("s_blue.png");
const iconDevR = assetUrl("s_red.png");
const iconDevG = assetUrl("s_grey.png");

const realTime = ref([]);
const newVals = ref([]);
const newVals_wyd = ref([]);
const timer = ref(null);
const mapRefreshDebounceTimer = ref(null);
const pointMapRequestId = ref(0);
const pointDeviceRequestId = ref(0);
const deviceCache = reactive({});
const viewMode = ref("3D");
const centerDialogVisible = ref(false);
const centerDialogVisible_Zc = ref(false);
const centerDialogVisible_Cs = ref(false);
const centerDeviceVisible = ref(false);
const proupSs = ref({});
const proupZc = ref({});
const proupCs = ref({});
const proupDe = ref({});
const toDayTime = today();
const getCoord = ref([]);
const historyTrack = ref(false);
const ruleForm = reactive({ date: "" });
const rules = {
  date: [{ required: true, message: "请输选择日期", trigger: "blur" }],
};
const fullscreenLoading = ref(false);
const assignTrack = ref([]);
const elAmap = ref(true);
const superintendentMap = ref(false);
const map = ref("");
provide("baiduMapRef", map);
const duMap = ref("");
const mapPoint = ref("");
const duPoint = ref("");
const realtimeIco = ref("");
const localtion = ref(axios.waresofeLocation);
const realOnLine = {
  nameIco: assetUrl("zcName.png"),
  telIco: assetUrl("zcTel.png"),
  adressIco: assetUrl("zcAdress.png"),
  trackIco: assetUrl("zcTrack.png"),
};
const tsTrack = ref(false);

const deviceStatusClass = computed(() => {
  if (proupDe.value.stat === "故障") {
    return "is-error";
  }

  if (proupDe.value.stat === "离线") {
    return "is-offline";
  }

  return "is-normal";
});

function handleZcLnglat(data) {
  newVals.value = data;
}

function handleWydLnglat(data) {
  newVals_wyd.value = data;
}

Bus.on("zcLnglat", handleZcLnglat);
Bus.on("wydLnglat", handleWydLnglat);

onMounted(() => {
  if (elAmap.value) {
    map.value = new BMapGL.Map("container");
    mapPoint.value = new BMapGL.Point(...mapObj[axios.waresofeLocation]);
    map.value.centerAndZoom(
      mapPoint.value,
      axios.waresofeLocation === "总公司" ? 5 : 15,
    );
    map.value.enableScrollWheelZoom(true);
    realtimeIco.value = new BMapGL.Icon(iconLs, new BMapGL.Size(18, 30));
  }

  bindMapLazyRefresh();
  refreshMapData(localtion.value);
  startMapRefreshTimer(localtion.value);
});

onBeforeUnmount(() => {
  stopMapRefreshTimer();
  clearTimeout(mapRefreshDebounceTimer.value);
  Bus.off("zcLnglat", handleZcLnglat);
  Bus.off("wydLnglat", handleWydLnglat);
});

function startMapRefreshTimer(name) {
  stopMapRefreshTimer();
  timer.value = setInterval(() => {
    if (document.hidden) {
      return;
    }

    refreshMapData(name || localtion.value);
  }, 300000);
}

function stopMapRefreshTimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

function refreshMapData(name) {
  if (!map.value) {
    return;
  }

  map.value.clearOverlays();
  pointMap(name || localtion.value);
}

function lazyRefreshMapData(name) {
  clearTimeout(mapRefreshDebounceTimer.value);
  mapRefreshDebounceTimer.value = setTimeout(() => {
    refreshMapData(name || localtion.value);
  }, 500);
}

function bindMapLazyRefresh() {
  if (!map.value || map.value.__lazyRefreshBound) {
    return;
  }

  map.value.__lazyRefreshBound = true;
  map.value.addEventListener("dragend", () => {
    lazyRefreshMapData(localtion.value);
  });
  map.value.addEventListener("zoomend", () => {
    lazyRefreshMapData(localtion.value);
  });
}

function initMapA(name) {
  const region = name || axios.waresofeLocation;
  stopMapRefreshTimer();

  if (elAmap.value) {
    map.value = new BMapGL.Map("container");
    mapPoint.value = new BMapGL.Point(...mapObj[region]);
    map.value.centerAndZoom(mapPoint.value, 14);
    map.value.enableScrollWheelZoom(true);
    realtimeIco.value = new BMapGL.Icon(iconLs, new BMapGL.Size(18, 30));
    map.value.addEventListener("tilesloaded", function () {});
  }

  bindMapLazyRefresh();
  refreshMapData(region);
  startMapRefreshTimer(region);
}

function lookMap(index) {
  currenIndex.value = index;
  listFixBot.value.push("查看全部");
  listFixBot.value = Array.from(new Set(listFixBot.value));

  if (index == 2) {
    map.value.clearOverlays();
    pointMap();
  }

  if (index == 3) {
    listFixBot.value.pop();
    map.value.clearOverlays();
    pointMap();
    leftMethods.value?.getNotInLoaction?.();
    leftMethods.value?.getWorkerstatusStaytime?.();
  }
}

function initRightTable(val) {
  localtion.value = val;
  initMapA(val);
  rightMapRef.value?.pointMap?.(val);
  rightMapRef.value?.getNotInLoaction?.(val);
  rightMapRef.value?.getWorkerstatusStaytime?.(val);
}

function pointDevice(name) {
  const region = name || localtion.value || axios.waresofeLocation;

  if (!map.value || !mapObj[region]) {
    return;
  }

  const cached = deviceCache[region];
  if (cached && Date.now() - cached.time < 60000) {
    renderDeviceMarkers(cached.data);
    return;
  }

  const requestId = ++pointDeviceRequestId.value;
  const str = mapObj[region][0] + "," + mapObj[region][1];
  const param = { coordinate: str };
  getDeviceInfo(param).then((res) => {
    if (
      requestId !== pointDeviceRequestId.value ||
      region !== localtion.value ||
      res.code != 200
    ) {
      return;
    }

    deviceCache[region] = {
      time: Date.now(),
      data: res.data,
    };
    renderDeviceMarkers(res.data);
  });
}

function renderDeviceMarkers(list = []) {
  if (!map.value) {
    return;
  }

  list.forEach((item) => {
    if (!item.lnglat || item.lnglat[0] == 0 || item.lnglat[1] == 0) {
      return;
    }

    const point = new BMapGL.Point(item.lnglat[0], item.lnglat[1]);
    let icon = iconDevB;
    if (item.style == 2) {
      icon = iconDevR;
    }
    if (item.style == 1) {
      icon = iconDevG;
    }

    const myIcon = new BMapGL.Icon(icon, new BMapGL.Size(23, 23));
    const marker = new BMapGL.Marker(point, { icon: myIcon });
    marker.dd = item;
    marker.addEventListener("click", deleteMarker);
    map.value.addOverlay(marker);
  });
}

function deleteMarker(e) {
  const item = e.target.dd;
  proupDe.value.add = item.address;
  proupDe.value.name = item.name;

  let stat = "";
  switch (item.style) {
    case 0:
      stat = "正常";
      break;
    case 2:
      stat = "故障";
      break;
    case 1:
      stat = "离线";
      break;
  }

  proupDe.value.stat = stat;
  centerDeviceVisible.value = true;
}

function pointMap(name) {
  const region = name || localtion.value || axios.waresofeLocation;

  if (!map.value || !realtimeIco.value) {
    return;
  }

  localtion.value = region;
  pointDevice(region);
  const requestId = ++pointMapRequestId.value;
  pointApi({ disname: region }).then((res) => {
    if (requestId !== pointMapRequestId.value || region !== localtion.value) {
      return;
    }

    let vals = Object.values(res);
    if (localtion.value !== "总公司") {
      vals = vals.filter(
        (item) =>
          item.indexOf(
            localtion.value !== "涪城" &&
              localtion.value !== "安州" &&
              localtion.value !== "成华"
              ? "四川省" + localtion.value
              : localtion.value,
          ) > -1,
      );
    }

    const phones = Object.keys(res);
    const newValss = vals.map((item, index) => ({
      adress: item.split("&")[0].split("省")[1],
      lat: parseFloat(item.split("&")[1]),
      lng: parseFloat(item.split("&")[2]),
      name: item.split("&")[3] || "暂未上传名字",
      phone: phones[index],
    }));

    realTime.value = newValss.filter((item) => item.adress != "null");

    requestAnimationFrame(() => {
      if (requestId !== pointMapRequestId.value || !map.value) {
        return;
      }

      realTime.value.forEach((item) => {
        const pt = new BMapGL.Point(item.lng, item.lat);
        const marker = new BMapGL.Marker(pt, { icon: realtimeIco.value });
        marker.addEventListener("click", function () {
          window.lookAdress(item);
        });
        map.value.addOverlay(marker);

        window.lookAdress = (info) => {
          proupSs.value = {
            name: info.name,
            tel: info.phone,
            adress: info.adress,
          };
          centerDialogVisible.value = true;
        };
      });
    });
  });
}

function removeMarker() {
  map.value?.clearOverlays?.();
}

function hxdlocationFindAll(item) {
  return new Promise((resolve) => {
    hxdlocationFindAllApi({ phone: item.phone, dats: today() }).then((res) => {
      if (res.length) {
        resolve(res);
      }
    });
  });
}

function lookHistory() {
  ruleForm.date = "";
  tsTrack.value = false;
  historyTrack.value = true;
}

function submitForm() {
  const data = {
    phone: proupSs.value.tel,
    dats: filterTime(ruleForm.date),
  };

  ruleFormRef.value?.validate((valid) => {
    if (!valid) {
      return false;
    }

    hxdlocationFindAllApi(data).then((res) => {
      if (res.length) {
        const newAssignTrack = res.map((item) => {
          const newItem = item.locationinfo.split("&");
          return [newItem[2], newItem[1]];
        });
        assignTrack.value = newAssignTrack;
        fullscreenLoading.value = true;
        setTimeout(() => {
          fullscreenLoading.value = false;
        }, 2000);
        setTimeout(() => {
          tsTrack.value = false;
          historyTrack.value = false;
          centerDialogVisible.value = false;
          center.value = newAssignTrack[0];
          elAmap.value = false;
          superintendentMap.value = true;
          duMap.value = new BMapGL.Map("superintendent");
          duMap.value.setDisplayOptions({
            poiText: true,
            poiIcon: true,
            building: false,
          });

          duMap.value.enableScrollWheelZoom(true);
          duPoint.value = new BMapGL.Point(
            assignTrack.value[0][0],
            assignTrack.value[0][1],
          );
          duMap.value.clearOverlays();
          const pt = new BMapGL.Point(
            assignTrack.value[0][0],
            assignTrack.value[0][1],
          );
          const marker = new BMapGL.Marker(pt, { icon: realtimeIco.value });
          setTimeout(() => {
            duMap.value.centerAndZoom(duPoint.value, 19);
            duMap.value.addOverlay(marker);

            const content = `
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${realOnLine.nameIco}'/><span>${proupSs.value.name}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${realOnLine.telIco}'/><span>${proupSs.value.tel}</span></p>
                                        <p  class='labelW xxMes'><img style='width:25px; height:25px' src='${realOnLine.adressIco}'/><span>${proupSs.value.adress}</span></p>
                                        <div class='backMap'> <button onclick='backMapBig(${assignTrack.value[0][0]},${assignTrack.value[0][1]})'>返回</button></div>
                                    `;

            const opts = {
              position: new BMapGL.Point(
                assignTrack.value[0][0],
                assignTrack.value[0][1],
              ),
              offset: new BMapGL.Size(0, -210),
            };
            const label = new BMapGL.Label(content, opts);

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
            duMap.value.addOverlay(label);

            const polygonArr = newAssignTrack.map(
              (item) => new BMapGL.Point(item[0], item[1]),
            );
            const ps = [];
            for (const i in polygonArr) {
              ps.push(new BMapGL.Point(polygonArr[i].lng, polygonArr[i].lat));
            }
            const ply = new BMapGL.Polygon(ps, {
              zIndex: 1,
              visible: true,
              strokeOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#f00",
              fillColor: "rgba(226,124,124,0.5)",
              fillOpacity: 0.2,
            });
            duMap.value.addOverlay(ply);

            window.backMapBig = () => {
              elAmap.value = true;
              superintendentMap.value = false;
              map.value.centerAndZoom(mapPoint.value, 15);
            };
          }, 500);
        }, 2500);
      } else {
        fullscreenLoading.value = true;
        setTimeout(() => {
          fullscreenLoading.value = false;
        }, 2000);
        setTimeout(() => {
          tsTrack.value = true;
        }, 2500);
      }
    });
  });
}

function backTrack() {
  elAmap.value = true;
  trackElamap.value = false;
  zoom.value = 13;
}

function initMap(mapInstance) {
  console.log("init map: ", mapInstance);
}

function clickMarker() {
  alert("12312321321");
}
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

  > div {
    height: 75px;
    display: inline-block;
    line-height: 85px;
    font-weight: bold;
    font-size: 30px;
    letter-spacing: 2px;
    background-image: -webkit-linear-gradient(left, #01ec0c, #fff 75%, #a8bbf0);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-background-size: 200% 100%;
    background-size: 200% 100%;
    -webkit-animation: masked-animation 4s infinite linear;
    animation: masked-animation 4s infinite linear;
  }

  > span {
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

@keyframes masked-animation {
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

      > div {
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

.amap-icon > img {
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

.deviceStatusDialog.el-dialog,
.deviceStatusDialog .el-dialog {
  border: 1px solid rgba(30, 144, 255, 0.28);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 44%);
  box-shadow: 0 16px 40px rgba(15, 44, 80, 0.28);
}

.deviceStatusDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 52px 12px;
    border-bottom: 1px solid rgba(41, 151, 255, 0.16);
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
}

.deviceStatusCard {
  color: #273849;
}

.deviceStatusCard__header {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid rgba(54, 161, 255, 0.18);
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(43, 151, 255, 0.1),
    rgba(1, 236, 12, 0.06)
  );

  strong {
    display: block;
    color: #183a5a;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
  }

  p {
    margin: 3px 0 0;
    color: #7a8b9a;
    font-size: 13px;
    line-height: 18px;
  }
}

.deviceStatusCard__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #03d822;
  box-shadow: 0 0 0 5px rgba(3, 216, 34, 0.12);

  &.is-error {
    background: #f04747;
    box-shadow: 0 0 0 5px rgba(240, 71, 71, 0.12);
  }

  &.is-offline {
    background: #8b98a8;
    box-shadow: 0 0 0 5px rgba(139, 152, 168, 0.14);
  }
}

.deviceStatusCard__tag {
  min-width: 58px;
  padding: 5px 12px;
  border-radius: 4px;
  color: #03a91c;
  background: rgba(3, 216, 34, 0.12);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  text-align: center;

  &.is-error {
    color: #d93636;
    background: rgba(240, 71, 71, 0.12);
  }

  &.is-offline {
    color: #6f7d8e;
    background: rgba(139, 152, 168, 0.14);
  }
}

.deviceStatusCard__list {
  margin-top: 14px;
  border: 1px solid rgba(54, 161, 255, 0.14);
  border-radius: 6px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.86);
}

.deviceStatusCard__item {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 64px;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(54, 161, 255, 0.12);

  &:last-child {
    border-bottom: 0;
  }

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 6px;
    background: rgba(1, 236, 12, 0.1);

    > img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
  }

  label {
    display: block;
    color: #7b8b9b;
    font-size: 13px;
    line-height: 18px;
  }

  p {
    margin: 3px 0 0;
    color: #263747;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    word-break: break-all;
  }
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

  > i {
    font-size: 16px;
  }
}

// .zcLine{ border:1px solid #f00; border-radius: 10px;}
</style>
