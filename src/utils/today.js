/**
* 获取当前时间
*/
export default function currentTime() {
    var date = new Date();
    var year = date.getFullYear(); //月份从0~11，所以加一
    let month = date.getMonth();
    // console.log("month",month);
    var dateArr = [
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    //如果格式是MM则需要此步骤，如果是M格式则此循环注释掉
    for (var i = 0; i < dateArr.length; i++) {
        if (dateArr[i] >= 1 && dateArr[i] <= 9) {
            dateArr[i] = "0" + dateArr[i];
        }
    }
    var strDate =
        year +
        "-" +
        dateArr[0] +
        "-" +
        dateArr[1] +
        " " ;
        // dateArr[2] +
        // ":" +
        // dateArr[3] +
        // ":" +
        // dateArr[4];
        //此处可以拿外部的变量接收，也可直接返回  strDate:2022-05-01 13:25:30
       	//this.date = strDate;
    // console.log("strDate",strDate);
    return strDate
}


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

