import axios from "@/utils/request";
import dayjs from "dayjs";
const DISPATCH_API = "http://125.67.190.126:51000/";
const DEVICE_API = "https://www.hxdqb.com/api/showData/";
export function filterTime(time) {
  return dayjs(time).format("YYYY-MM-DD");
}
export function point(data) {
  //hxdlocation/getRealLocation', //查询全部骑手目前坐标(时时信息)
  return axios.get(DISPATCH_API + "hxdlocation/getRealLocation", data);
  //   return axios.get('hxduser/findAll',data)
}

export async function getRealLocationList(data) {
  const res = await point(data);

  return Object.entries(res || {})
    .map(([phone, value]) => formatRealLocationItem(phone, value))
    .filter(Boolean);
}

function formatRealLocationItem(phone, value) {
  if (typeof value !== "string") {
    return null;
  }

  const [
    addressText = "",
    lat = "",
    lng = "",
    reportedName = "",
    ,
    realName = "",
  ] = value.split("&");
  const displayName =
    realName && realName !== "noname"
      ? realName
      : reportedName && reportedName !== "noname"
        ? reportedName
        : "暂未上传名字";

  return {
    raw: value,
    adress: addressText.split("省")[1] || addressText,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    name: displayName,
    phone,
  };
}

export async function workerstatusNormal(data) {
  //正常在线的人员
  return await axios.post(DISPATCH_API + "hxduser/workerstatus_normal", data);
}

export async function workerstatusDeny(data) {
  //未上线的人员
  return await axios.post(DISPATCH_API + "hxduser/workerstatus_deny", data);
}
export async function workerstatusStay(data) {
  //长时间未移动的人员
  return await axios.post(DISPATCH_API + "hxduser/workerstatus_stay", data);
}
export function hxdlocationFindAll(data) {
  //获取所指定员工的定位信息
  return axios.post(DISPATCH_API + "hxdlocation/findAll", data);
  //phone ：18380569831 用户电话
  //dats ：2023-02-13 查询时间
}

export async function getLocationTrackPoints(data) {
  const res = await hxdlocationFindAll(data);
  const list = Array.isArray(res) ? res : [];

  return list.map(formatTrackPoint).filter(Boolean);
}

function formatTrackPoint(item) {
  const locationInfo = item?.locationinfo;
  if (typeof locationInfo !== "string") {
    return null;
  }

  const pointInfo = locationInfo.split("&");
  if (!pointInfo[1] || !pointInfo[2]) {
    return null;
  }

  return [pointInfo[2], pointInfo[1]];
}

export function findAllTodayfault(data) {
  //查询今日异常用户信息（数据不正常 无名字
  return axios.post(DISPATCH_API + "hxduser/findAllToday_fault", data);
}

export function hxduserfindAll(data) {
  //查询所有用户信息（数据不正常 无姓名）
  return axios.post(DISPATCH_API + "hxduser/findAllByDisname", data);
}

export function findAllToday(data) {
  //查询所有用户信息（数据不正常 无姓名）
  return axios.post(DISPATCH_API + "hxduser/findAllToday", data);
}

export function botOnLine(data) {
  //查询所有用户信息（数据不正常 20230424新增）
  return axios.post(DISPATCH_API + "hxduser/botOnLine", data);
}

//20230505 新增
export function notInLoaction(data) {
  //当前不在点位人员
  return axios.get(
    DISPATCH_API + "hxduser/workerstatus_not_in_location2",
    data,
  );
}

export function workerstatusStaytime(data) {
  //长时间不移动人员
  return axios.get(DISPATCH_API + "hxduser/workerstatus_stay2", data);
}
//20230608 新增 数据异常人员
export function notNormalWorkers(data) {
  return axios.post(DISPATCH_API + "hxduser/not_normal_workers", data);
}

//20230613 新增 获取指定日期不在点位的人员信息
export function hxderrorFindAllByDate(data) {
  return axios.get(DISPATCH_API + "hxderror/findAllByDate2", data);
}
//20230614 新增 查询某天传点次数
export function hxderrorFindAllToday2(data) {
  return axios.post(DISPATCH_API + "hxdlocation/findAllToday2", data);
}

export function getDeviceInfo(data) {
  return axios.get(DEVICE_API + "getDeviceForDispatch", data);
}

export function getDeviceInfoByCoordinate(coordinate) {
  const coordinateText = Array.isArray(coordinate)
    ? coordinate.join(",")
    : coordinate;

  return getDeviceInfo({ coordinate: coordinateText });
}
