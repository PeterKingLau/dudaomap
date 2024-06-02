import axios from  '@/utils/request'
export function  filterTime(time) { //中国标准时间转化月日时分秒
    var date = new Date(time);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var s = date.getSeconds();
    s = s < 10 ? "0" + s : s;
    //return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + s;
    return y + "-" + m + "-" + d 
  }
export function point(data){
    //hxdlocation/getRealLocation', //查询全部骑手目前坐标(时时信息)
       return axios.get('hxdlocation/getRealLocation',data)
        //   return axios.get('hxduser/findAll',data)
        
}

export function workerstatusNormal(data){//正常在线的督导员
    return axios.post('hxduser/workerstatus_normal',data)
}


export function workerstatusDeny(data){//未上线的督导员
    return axios.post('hxduser/workerstatus_deny',data)
}
export function workerstatusStay(data){//长时间未移动的督导员
    return axios.post('hxduser/workerstatus_stay',data)
}
export function hxdlocationFindAll(data){//获取所指定员工的定位信息
    return axios.post('hxdlocation/findAll',data)
    //phone ：18380569831 用户电话
//dats ：2023-02-13 查询时间
}

export function findAllTodayfault(data){//查询今日异常用户信息（数据不正常 无名字
    return axios.post('hxduser/findAllToday_fault',data)
}

export function hxduserfindAll(data){//查询所有用户信息（数据不正常 无姓名）
    return axios.post('hxduser/findAllByDisname',data)
}

export function findAllToday(data){//查询所有用户信息（数据不正常 无姓名）
    return axios.post('hxduser/findAllToday',data)
}

export function botOnLine(data){//查询所有用户信息（数据不正常 20230424新增）
    return axios.post('hxduser/botOnLine',data)
}

//20230505 新增  
export function notInLoaction(data){//当前不在点位督导员
    return axios.get('hxduser/workerstatus_not_in_location2',data)
}


export function workerstatusStaytime(data){//长时间不移动督导员
    return axios.get('hxduser/workerstatus_stay2',data)
}
//20230608 新增 数据异常督导员
export function notNormalWorkers(data){
    return axios.post('hxduser/not_normal_workers',data)
}

//20230613 新增 获取指定日期不在点位的督导员信息
export function  hxderrorFindAllByDate(data){
    return axios.get('hxderror/findAllByDate2',data)
}
//20230614 新增 查询某天传点次数
export function  hxderrorFindAllToday2(data){
    return axios.post('hxdlocation/findAllToday2',data)
}


