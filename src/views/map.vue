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

    <OnlinePersonDialog
      v-model="centerDialogVisible"
      :person="proupSs"
      :person-name="onlinePersonName"
      @history="lookHistory"
    />

    <DeviceStatusDialog
      v-model="centerDeviceVisible"
      :device="proupDe"
    />

    <!--查看轨迹弹窗显示-->
    <el-dialog
      title="请选择时间查询历史轨迹"
      v-model="historyTrack"
      width="520px"
      custom-class="zcLine trackQueryDialog"
      class="trackQueryDialog"
      center
    >
      <div class="trackQueryCard">
        <div class="trackQueryCard__loading" v-if="fullscreenLoading">
          <span></span>
          <p>正在查询轨迹，请稍后</p>
        </div>

        <div class="trackQueryCard__header">
          <span class="trackQueryCard__dot"></span>
          <div>
            <strong>{{ onlinePersonName }}</strong>
            <p>查询指定日期的历史轨迹</p>
          </div>
        </div>

        <el-form
          class="trackQueryCard__form"
          :model="ruleForm"
          :rules="rules"
          ref="ruleFormRef"
          label-width="82px"
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
              class="trackQueryCard__button"
              @click="submitForm('ruleForm')"
              :loading="fullscreenLoading"
              :disabled="fullscreenLoading"
              >{{ fullscreenLoading ? "查询中" : "查找" }}</el-button
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
import DeviceStatusDialog from "@/components/map/DeviceStatusDialog.vue";
import OnlinePersonDialog from "@/components/map/OnlinePersonDialog.vue";
import { Warning } from "@element-plus/icons-vue";
import axios from "@/utils/request";
import {
  getRealLocationList,
  getLocationTrackPoints,
  getDeviceInfoByCoordinate,
} from "@/api/api";
import {
  getDeviceStatusText,
  getMapCenter,
  getMapZoom,
  getRegionKeyword,
} from "@/utils/mapConfig";
import { getBMapGL, waitForBMapGL } from "@/utils/baiduMap";
import { filterTime } from "@/utils/today.js";

const assetUrl = (name) =>
  new URL(`../assets/images/${name}`, import.meta.url).href;

const rightMapRef = ref(null);
const leftMethods = ref(null);
const ruleFormRef = ref(null);

const currenIndex = ref(-1);
const bgImg = assetUrl("header-dispatch-title.png");
const iconLs = assetUrl("marker-person-online.png");
const iconDevB = assetUrl("marker-device-normal.png");
const iconDevR = assetUrl("marker-device-fault.png");
const iconDevG = assetUrl("marker-device-offline.png");

const realTime = ref([]);
const timer = ref(null);
const mapRefreshDebounceTimer = ref(null);
const pointMapRequestId = ref(0);
const pointDeviceRequestId = ref(0);
const deviceCache = reactive({});
const centerDialogVisible = ref(false);
const centerDeviceVisible = ref(false);
const proupSs = ref({});
const proupDe = ref({});
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
const bMapGL = ref(null);
const duMap = ref("");
const mapPoint = ref("");
const duPoint = ref("");
const realtimeIco = ref("");
const localtion = ref(axios.waresofeLocation);
const realOnLine = {
  nameIco: assetUrl("icon-online-name.png"),
  telIco: assetUrl("icon-online-phone.png"),
  adressIco: assetUrl("icon-online-address.png"),
};
const tsTrack = ref(false);

const onlinePersonName = computed(() => {
  if (!proupSs.value.name || proupSs.value.name === "noname") {
    return "未上传姓名";
  }

  return proupSs.value.name;
});

onMounted(async () => {
  const initialRegion = axios.waresofeLocation;
  await initMapA(initialRegion, getMapZoom(initialRegion));
});

onBeforeUnmount(() => {
  stopMapRefreshTimer();
  clearTimeout(mapRefreshDebounceTimer.value);
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

async function initMapA(name, zoomLevel = 14) {
  const region = name || axios.waresofeLocation;
  stopMapRefreshTimer();

  try {
    bMapGL.value = await waitForBMapGL();
  } catch (error) {
    console.error(error);
    return false;
  }

  if (elAmap.value) {
    const BMap = bMapGL.value;
    map.value = new BMap.Map("container");
    mapPoint.value = new BMap.Point(...getMapCenter(region));
    map.value.centerAndZoom(mapPoint.value, zoomLevel);
    map.value.enableScrollWheelZoom(true);
    realtimeIco.value = new BMap.Icon(iconLs, new BMap.Size(18, 30));
    map.value.addEventListener("tilesloaded", function () {});
    setTimeout(() => {
      map.value?.resize?.();
      map.value?.centerAndZoom?.(mapPoint.value, zoomLevel);
    }, 0);
  }

  bindMapLazyRefresh();
  refreshMapData(region);
  startMapRefreshTimer(region);
  return true;
}

async function initRightTable(val) {
  localtion.value = val;
  const ready = await initMapA(val, getMapZoom(val));
  if (!ready || !map.value) {
    return;
  }

  rightMapRef.value?.pointMap?.(val);
  rightMapRef.value?.getNotInLoaction?.(val);
  rightMapRef.value?.getWorkerstatusStaytime?.(val);
}

function pointDevice(name) {
  const region = name || localtion.value || axios.waresofeLocation;

  if (!map.value) {
    return;
  }

  const cached = deviceCache[region];
  if (cached && Date.now() - cached.time < 60000) {
    renderDeviceMarkers(cached.data);
    return;
  }

  const requestId = ++pointDeviceRequestId.value;
  getDeviceInfoByCoordinate(getMapCenter(region)).then((res) => {
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
  const BMap = bMapGL.value || getBMapGL();
  if (!map.value || !BMap) {
    return;
  }

  list.forEach((item) => {
    if (!item.lnglat || item.lnglat[0] == 0 || item.lnglat[1] == 0) {
      return;
    }

    const point = new BMap.Point(item.lnglat[0], item.lnglat[1]);
    let icon = iconDevB;
    if (item.style == 2) {
      icon = iconDevR;
    }
    if (item.style == 1) {
      icon = iconDevG;
    }

    const myIcon = new BMap.Icon(icon, new BMap.Size(23, 23));
    const marker = new BMap.Marker(point, { icon: myIcon });
    marker.dd = item;
    marker.addEventListener("click", deleteMarker);
    map.value.addOverlay(marker);
  });
}

function deleteMarker(e) {
  const item = e.target.dd;
  proupDe.value.add = item.address;
  proupDe.value.name = item.name;
  proupDe.value.stat = getDeviceStatusText(item.style);
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
  getRealLocationList({ disname: region }).then((list) => {
    if (requestId !== pointMapRequestId.value || region !== localtion.value) {
      return;
    }

    let realLocationList = list;
    const regionKeyword = getRegionKeyword(localtion.value);
    if (regionKeyword) {
      realLocationList = realLocationList.filter((item) =>
        item.raw.includes(regionKeyword),
      );
    }

    realTime.value = realLocationList.filter(
      (item) =>
        item.adress != "null" && !Number.isNaN(item.lat) && !Number.isNaN(item.lng),
    );

    requestAnimationFrame(() => {
      const BMap = bMapGL.value || getBMapGL();
      if (requestId !== pointMapRequestId.value || !map.value || !BMap) {
        return;
      }

      realTime.value.forEach((item) => {
        const pt = new BMap.Point(item.lng, item.lat);
        const marker = new BMap.Marker(pt, { icon: realtimeIco.value });
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

    fullscreenLoading.value = true;
    tsTrack.value = false;
    getLocationTrackPoints(data).then((newAssignTrack) => {
      fullscreenLoading.value = false;
      if (newAssignTrack.length) {
        const BMap = bMapGL.value || getBMapGL();
        if (!BMap) {
          return;
        }

        assignTrack.value = newAssignTrack;
        historyTrack.value = false;
        centerDialogVisible.value = false;
        elAmap.value = false;
        superintendentMap.value = true;
        duMap.value = new BMap.Map("superintendent");
        duMap.value.setDisplayOptions({
          poiText: true,
          poiIcon: true,
          building: false,
        });

        duMap.value.enableScrollWheelZoom(true);
        duPoint.value = new BMap.Point(
          assignTrack.value[0][0],
          assignTrack.value[0][1],
        );
        duMap.value.clearOverlays();
        const pt = new BMap.Point(
          assignTrack.value[0][0],
          assignTrack.value[0][1],
        );
        const marker = new BMap.Marker(pt, { icon: realtimeIco.value });
        setTimeout(() => {
          duMap.value.centerAndZoom(duPoint.value, 19);
          duMap.value.addOverlay(marker);

          const content = `
              <div class="trackResultCard">
                <div class="trackResultCard__status"></div>
                <div class="trackResultCard__item">
                  <span><img src="${realOnLine.nameIco}" /></span>
                  <strong>${onlinePersonName.value}</strong>
                </div>
                <div class="trackResultCard__item">
                  <span><img src="${realOnLine.telIco}" /></span>
                  <strong>${proupSs.value.tel || "--"}</strong>
                </div>
                <div class="trackResultCard__item">
                  <span><img src="${realOnLine.adressIco}" /></span>
                  <strong>${proupSs.value.adress || "--"}</strong>
                </div>
                <button class="trackResultCard__button" onclick="backMapBig(${assignTrack.value[0][0]},${assignTrack.value[0][1]})">返回</button>
              </div>
            `;

          const opts = {
            position: new BMap.Point(
              assignTrack.value[0][0],
              assignTrack.value[0][1],
            ),
            offset: new BMap.Size(0, -210),
          };
          const label = new BMap.Label(content, opts);

          label.setStyle({
            color: "#273849",
            fontSize: "14px",
            height: "auto",
            padding: "0",
            borderRadius: "6px",
            border: "0",
            background: "transparent",
            boxShadow: "none",
            fontWeight: "normal",
            transform: "translateX(-50%)",
            fontFamily: "微软雅黑",
          });
          duMap.value.addOverlay(label);

          const polygonArr = newAssignTrack.map(
            (item) => new BMap.Point(item[0], item[1]),
          );
          const ps = [];
          for (const i in polygonArr) {
            ps.push(new BMap.Point(polygonArr[i].lng, polygonArr[i].lat));
          }
          const ply = new BMap.Polygon(ps, {
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
            const returnRegion = localtion.value || axios.waresofeLocation;
            const returnPoint = new BMap.Point(...getMapCenter(returnRegion));
            mapPoint.value = returnPoint;

            setTimeout(() => {
              map.value?.centerAndZoom?.(returnPoint, getMapZoom(returnRegion));
              refreshMapData(returnRegion);
            }, 0);
          };
        }, 500);
      } else {
        tsTrack.value = true;
      }
    }).catch(() => {
      fullscreenLoading.value = false;
      tsTrack.value = true;
    });
  });
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
  width: 320px;
  position: absolute;
  top: 78px;
  right: 20px;
  z-index: 97;
}

.leftPos {
  width: 320px;
  position: absolute;
  top: 78px;
  left: 0;
  z-index: 98;
}

.trackQueryDialog.el-dialog,
.trackQueryDialog .el-dialog {
  border: 1px solid rgba(1, 236, 12, 0.24);
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fff9 0%, #ffffff 48%);
  box-shadow: 0 16px 40px rgba(15, 80, 44, 0.24);
}

.trackQueryDialog {
  .el-dialog__header {
    position: relative;
    margin: 0;
    padding: 18px 52px 12px;
    border-bottom: 1px solid rgba(1, 236, 12, 0.16);
  }

  .el-dialog__title {
    color: #137a2b;
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
      background: rgba(1, 236, 12, 0.1);
    }
  }

  .el-dialog__body {
    padding: 18px 24px 24px;
  }
}

.trackQueryCard {
  position: relative;
  color: #273849;
}

.trackQueryCard__loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 6px;
  background: rgba(248, 255, 249, 0.86);
  backdrop-filter: blur(2px);

  span {
    width: 34px;
    height: 34px;
    border: 3px solid rgba(3, 216, 34, 0.18);
    border-top-color: #03d822;
    border-radius: 50%;
    animation: track-query-spin 0.9s linear infinite;
  }

  p {
    margin: 0;
    color: #137a2b;
    font-size: 14px;
    font-weight: 700;
  }
}

.trackQueryCard__header {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid rgba(1, 236, 12, 0.18);
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(1, 236, 12, 0.12),
    rgba(43, 151, 255, 0.08)
  );

  strong {
    display: block;
    color: #16492b;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
  }

  p {
    margin: 3px 0 0;
    color: #78908a;
    font-size: 13px;
    line-height: 18px;
  }
}

.trackQueryCard__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #03d822;
  box-shadow: 0 0 0 5px rgba(3, 216, 34, 0.12);
}

.trackQueryCard__form {
  margin-top: 14px;
  padding: 18px 18px 4px;
  border: 1px solid rgba(1, 236, 12, 0.14);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);

  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item__label {
    color: #60776f;
    font-weight: 600;
  }

  .el-input__wrapper {
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba(1, 236, 12, 0.16) inset;

    &.is-focus {
      box-shadow: 0 0 0 1px rgba(1, 180, 35, 0.45) inset;
    }
  }
}

@keyframes track-query-spin {
  to {
    transform: rotate(360deg);
  }
}

.trackQueryCard__button.el-button {
  min-width: 112px;
  height: 38px;
  border: 1px solid rgba(1, 200, 30, 0.6);
  border-radius: 6px;
  color: #fff;
  background: linear-gradient(90deg, #04c927, #18b778);
  font-size: 15px;
  font-weight: 700;

  &:hover,
  &:focus {
    color: #fff;
    border-color: rgba(1, 180, 35, 0.75);
    background: linear-gradient(90deg, #05d72d, #20c785);
    box-shadow: 0 8px 18px rgba(1, 180, 35, 0.16);
  }
}

.trackResultCard {
  position: relative;
  width: 260px;
  padding: 14px 14px 16px;
  border: 1px solid rgba(1, 236, 12, 0.22);
  border-radius: 6px;
  background: linear-gradient(180deg, #f8fff9 0%, #ffffff 58%);
  box-shadow: 0 12px 28px rgba(15, 80, 44, 0.22);
  color: #263747;
  box-sizing: border-box;
}

.trackResultCard__status {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #03d822;
  box-shadow: 0 0 0 5px rgba(3, 216, 34, 0.12);
}

.trackResultCard__item {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 34px;
  margin-bottom: 8px;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: rgba(1, 236, 12, 0.1);
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  strong {
    display: block;
    color: #16492b;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
    word-break: break-all;
    overflow-wrap: anywhere;
  }
}

.trackResultCard__button {
  display: block;
  width: 118px;
  height: 36px;
  margin: 10px auto 0;
  border: 1px solid rgba(1, 200, 30, 0.6);
  border-radius: 6px;
  color: #fff;
  background: linear-gradient(90deg, #04c927, #18b778);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: linear-gradient(90deg, #05d72d, #20c785);
    box-shadow: 0 8px 18px rgba(1, 180, 35, 0.16);
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
