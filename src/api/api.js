import axios from "@/utils/request";
import dayjs from "dayjs";
const url = "http://125.67.190.126:51000/";
const url2 = "https://www.hxdqb.com/api/showData/";
export function filterTime(time) {
  return dayjs(time).format("YYYY-MM-DD");
}
export function point(data) {
  //hxdlocation/getRealLocation', //查询全部骑手目前坐标(时时信息)
  return axios.get(url + "hxdlocation/getRealLocation", data);
  //   return axios.get('hxduser/findAll',data)
}

export async function workerstatusNormal(data) {
  //正常在线的督导员
  return await axios.post(url + "hxduser/workerstatus_normal", data);
}

export async function workerstatusDeny(data) {
  //未上线的督导员
  return await axios.post(url + "hxduser/workerstatus_deny", data);
}
export async function workerstatusStay(data) {
  //长时间未移动的督导员
  return await axios.post(url + "hxduser/workerstatus_stay", data);
}
export function hxdlocationFindAll(data) {
  //获取所指定员工的定位信息
  return axios.post(url + "hxdlocation/findAll", data);
  //phone ：18380569831 用户电话
  //dats ：2023-02-13 查询时间
}

export function findAllTodayfault(data) {
  //查询今日异常用户信息（数据不正常 无名字
  return axios.post(url + "hxduser/findAllToday_fault", data);
}

export function hxduserfindAll(data) {
  //查询所有用户信息（数据不正常 无姓名）
  return axios.post(url + "hxduser/findAllByDisname", data);
}

export function findAllToday(data) {
  //查询所有用户信息（数据不正常 无姓名）
  return axios.post(url + "hxduser/findAllToday", data);
}

export function botOnLine(data) {
  //查询所有用户信息（数据不正常 20230424新增）
  return axios.post(url + "hxduser/botOnLine", data);
}

//20230505 新增
export function notInLoaction(data) {
  //当前不在点位督导员
  return axios.get(url + "hxduser/workerstatus_not_in_location2", data);
}

export function workerstatusStaytime(data) {
  //长时间不移动督导员
  return axios.get(url + "hxduser/workerstatus_stay2", data);
}
//20230608 新增 数据异常督导员
export function notNormalWorkers(data) {
  return axios.post(url + "hxduser/not_normal_workers", data);
}

//20230613 新增 获取指定日期不在点位的督导员信息
export function hxderrorFindAllByDate(data) {
  return axios.get(url + "hxderror/findAllByDate2", data);
}
//20230614 新增 查询某天传点次数
export function hxderrorFindAllToday2(data) {
  return axios.post(url + "hxdlocation/findAllToday2", data);
}

export function getDeviceInfo(data) {
  return axios.get(url2 + "getDeviceForDispatch", data);
}
