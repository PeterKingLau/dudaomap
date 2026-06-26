<template>
    <div class="mapHeight">

        <!--实时在线的督导员-->
        <div class="styleCss normal">
            <div class="styleCssTitle ss">
                <img src="../assets/images/ss.svg" alt=""> <span>实时在线的督导员</span>
                <em v-if="realTime.length" class="onlineStyle"><em style="color:#ffc520">{{ realTime.length }}</em>人</em>
            </div>
            <div class="zcNormal ssline ">
                <div class="zcNormaltitle">
                    <span>姓名</span>
                    <span>电话号码</span>
                </div>
                <AutoScroll :data="realTime" :class-option="classOption" class="seamless-warp">
                    <ul class="zcUl" v-if="realTime.length">
                        <li v-for="(item, index) in realTime" :key="index * 0.1">
                            <span>{{ item.name }}</span>
                            <span>{{ item.phone }}</span>
                        </li>
                    </ul>

                    <div v-else class="zwData">暂无正常在线的督导员</div>
                </AutoScroll>

            </div><!--/zcNormal-->
        </div><!--/styleCss-->

        <!--正常在线的督导员-->
        <div class="styleCss normal">
            <div class="styleCssTitle">
                <img src="../assets/images/zc.svg" alt=""> <span>总注册督导员人数</span>
                <em v-if="normalLis.length" class="onlineStyle"><em
                        style="color:#01ec0c">{{ realTime.length + normalLis.length }}</em>人</em>
            </div>
            <div class="zcNormal zcline ">
                <div class="zcNormaltitle">
                    <span>姓名</span>
                    <span>电话号码</span>
                </div>
                <AutoScroll :data="normalLis" :class-option="classOption" class="seamless-warp">
                    <ul class="zcUl" v-if="normalLis.length">
                        <li v-for="(item, index) in normalLis" :key="index * 0.3">
                            <span>{{ item.name }}</span>
                            <span>{{ item.phone }}</span>
                        </li>
                    </ul>

                    <div v-else class="zwData">暂无正常在线的督导员</div>
                </AutoScroll>

            </div><!--/zcNormal-->
        </div><!--/styleCss-->

        <div class="styleCss normal">
            <div class="styleCssTitle wsx">
                <img src="../assets/images/wsx.svg" alt=""> <span>异常督导员</span>
                <em v-if="workerstatusDeny.length" class="onlineStyle"><em
                        style="color:#d81e06">{{ workerstatusDeny.length }}</em>人</em>
            </div>
            <div class="zcNormal wsxLine">
                <div class="zcNormaltitle">
                    <span>姓名</span>
                    <span>电话号码</span>
                </div>

                <AutoScroll :data="workerstatusDeny" :class-option="classOption" class="seamless-warp">
                    <ul class="zcUl" v-if="workerstatusDeny.length">
                        <li v-for="(item, index) in workerstatusDeny" :key="index * 0.4">
                            <span>{{ item.name }}</span>
                            <span>{{ item.phone }}</span>
                        </li>
                    </ul>

                    <div v-else class="zwData">暂无异常督导员</div>
                </AutoScroll>
            </div><!--/zcNormal-->
        </div><!--/styleCss-->

        <div class="styleCss normal" v-show="yc">
            <div class="styleCssTitle wyd">
                <img src="../assets/images/wyd.svg" alt=""> <span>超过15分钟未移动人员</span>
                <em v-if="workerstatusStay.length" class="onlineStyle"><em
                        style="color:#1296db">{{ workerstatusStay.length }}</em>人</em>
            </div>
            <div class="zcNormal wydline">
                <div class="zcNormaltitle">
                    <span>姓名</span>
                    <span>电话号码</span>
                </div>
                <AutoScroll :data="workerstatusStay" :class-option="classOption" class="seamless-warp">
                    <ul class="zcUl" v-if="workerstatusStay.length">
                        <li v-for="(item, index) in workerstatusStay" :key="index * 0.5">
                            <span>{{ item.name }}</span>
                            <span>{{ item.phone }}</span>
                        </li>
                    </ul>

                    <div v-else class="zwData">暂无长时间未移动的督导员</div>
                </AutoScroll>
            </div><!--/zcNormal-->
        </div><!--/styleCss-->
    </div>
</template>

<script>
import { workerstatusNormal, workerstatusDeny, workerstatusStay, point, findAllTodayfault } from '@/api/api'
import Bus from '../utils/eventBus' //兄弟间传值
export default {
    data() {
        return {
            yc: false,
            realTime: [], //实时
            normalLis: [],
            workerstatusDeny: [],
            workerstatusStay: [],
            timer: null
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
            };
        },
    },
    created() {
        this.$nextTick(() => {
            this.getWorkerstatusNormal()
            this.getWorkerstatusDeny()
            this.getWorkerstatusStay()
        })
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.getWorkerstatusNormal()
                this.getWorkerstatusDeny()
                this.getWorkerstatusStay()
            }, 500)
        })

        this.timer = setInterval(() => {//每隔5分鐘刷新一次接口
            this.getWorkerstatusNormal()
            this.getWorkerstatusDeny()
            this.getWorkerstatusStay()
        }, 300000)

        this.pointMap();
        this.timer = setInterval(() => {
            //每隔5分鐘刷新一次接口
            this.pointMap();
        }, 300000);
        this.$once('hook:beforeDestroy', () => { clearInterval(this.timer); })//防止setInterval多次请求

    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        async pointMap() {
            let res = await point();
            let vals = Object.values(res); //对象转数组
            if (axios.waresofeLocation !== '总公司') {
                vals = vals.filter(item => item.indexOf(axios.waresofeLocation !== '涪城' && axios.waresofeLocation !== '安州' ? '四川省' + axios.waresofeLocation : axios.waresofeLocation) > -1)
            }
            let newValss = vals.map((item, index) => {
                return {
                    adress: item.split("&")[0].split("省")[1],
                    lat: parseFloat(item.split("&")[1]),
                    lng: parseFloat(item.split("&")[2]),
                    name:
                        item.split("&")[3] == undefined || item.split("&")[3] == null
                            ? "暂未上传名字"
                            : item.split("&")[3],
                    phone: Object.keys(res)[index], //对象转数组
                };
            });

            this.realTime = newValss.filter((item) => {
                if (item.adress != "null") {
                    return item;
                }
            });
        },
        getWorkerstatusNormal() {//正常在线的督导员
            workerstatusNormal().then(res => {
                let vals = Object.values(res);//获取key
                this.normalLis = vals.map((item, index) => {
                    let newLis = item.split('&')
                    //  console.log(newLis)
                    return {
                        name: newLis[0],
                        adress: newLis[1],
                        lat: parseFloat(newLis[2]),
                        lng: parseFloat(newLis[3]),
                        phone: Object.keys(res)[index],
                    }
                })

                Bus.$emit('zcLnglat', this.normalLis)//兄弟页面传值

            })
        },
        getWorkerstatusDeny() {//未上线的督导员
            workerstatusDeny().then(res => {

                let tels = Object.values(res);//获取key
                let telsLis = tels.map((item, index) => {
                    return {
                        name: item,
                        phone: Object.keys(res)[index]
                    }
                })
                this.workerstatusDeny = telsLis
            })
        },
        getWorkerstatusStay() {//长时间未移动的督导员
            workerstatusStay().then(res => {
                // console.log('123',res)
                let vals = Object.values(res);//获取key
                this.workerstatusStay = vals.map((item, index) => {
                    let newLis = item.split('&')
                    // console.log(newLis)
                    return {
                        name: newLis[0],
                        adress: newLis[1],
                        lat: parseFloat(newLis[2]),
                        lng: parseFloat(newLis[3]),
                        phone: Object.keys(res)[index],
                    }
                })

                Bus.$emit('wydLnglat', this.workerstatusStay)//兄弟页面传值
            })
        }

    }
}
</script>

<style  lang='scss'>
.mapHeight {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: wrap;
}

.seamless-warp {
    max-height: 100px;
    overflow: hidden;
}

// .styleCss{ padding: 20px;  height: calc(33% - 40px); 
.styleCss {
    padding: 1%;
    width: 90%;
    margin: auto;

    .styleCssTitle {
        text-align: left;
        display: flex;
        align-items: center;
        margin: 0 0 0.3rem 0;
        position: relative;

        >img {
            width: 1.5rem;
            height: 1.5rem;
        }

        >span {
            font-size: 0.8rem;
            color: #01ec0c;
            margin: 0 0 0 0.4rem;
            font-weight: 800;
            text-shadow: 0 1px 1px #fff;
        }

        >em {
            position: absolute;
            top: 0;
            right: 0;
        }

        &.wsx {
            >span {
                color: #d81e06;
            }
        }

        &.wyd {
            >span {
                color: #1296db;
            }
        }

        &.ss {
            >span {
                color: #ffc520;
            }
        }
    }

    .zcNormal {
        box-shadow: 0 2px 15px #e2e2e2;
        border-radius: 10px;

        &.zcline {
            border: 1px solid #01ec0c;
            animation: animated-border 1.5s infinite;

            .zcNormaltitle {
                border-bottom: 1px solid #01ec0c;
                background: #01ec0c;
            }

            li {
                &>span {
                    color: #01ec0c;
                }
            }
        }

        &.ssline {
            border: 1px solid #ffc520;
            animation: animated-border-red 1.5s infinite;

            .zcNormaltitle {
                border-bottom: 1px solid #ffc520;
                background: #ffc520;
            }

            li {
                &>span {
                    color: #ffc520;
                }
            }
        }

        &.wsxLine {
            border: 1px solid #d81e06;
            animation: animated-border-red 1.5s infinite;

            .zcNormaltitle {
                border-bottom: 1px solid #d81e06;
                background: #d81e06;
            }

            li {
                &>span {
                    color: #d81e06;
                }
            }
        }

        &.wydline {
            border: 1px solid #1296db;
            animation: animated-border-lv 1.5s infinite;

            .zcNormaltitle {
                border-bottom: 1px solid #1296db;
                background: #1296db;
            }

            li {
                &>span {
                    color: #1296db;
                }
            }
        }

        .zcNormaltitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.2rem 0;
            border-bottom: 1px solid #01ec0c;
            border-radius: 10px 10px 0 0;

            span {
                font-size: 0.8rem;
                display: inline-block;
                width: 50%;
                text-align: center;
                color: #fff;
            }
        }

        .zcUl {
            >li {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 1.8rem;
                border-top: 1px solid #efefef;

                >span {
                    font-size: 0.8rem;
                    display: inline-block;
                    width: 50%;
                    text-align: center;
                }
            }
        }
    }

    //zcNormal


}

.zwData {
    padding: 2rem 0;
    text-align: center;
}

.onlineStyle {
    font-style: normal;
    margin: 0 0 0 1rem;

    >em {
        font-size: 20px;
        font-weight: 800;
        margin: 0 5px;
    }
}</style>
