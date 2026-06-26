<template>
      <div class="mapHeight">
          <!--正常在线的督导员-->
          <div class="styleCss normal">
                <div class="styleCssTitle">
                    <img src="../assets/images/zc.svg" alt=""> <span>正常在线的督导员</span>
                </div>
               <div class="zcNormal zcline ">
                      <div class="zcNormaltitle">
                         <span>姓名</span>
                         <span>电话号码</span>
                      </div>
                       <AutoScroll :data="normalLis" :class-option="classOption" class="seamless-warp">  
                        <ul class="zcUl" v-if="normalLis.length">
                            <li  v-for="item in normalLis" :key="item.tel">
                                <span>{{item.name}}</span>
                                <span>{{item.phone}}</span>
                            </li>
                        </ul>

                        <div v-else class="zwData">暂无正常在线的督导员</div>
                        </AutoScroll>
                        
               </div><!--/zcNormal-->
          </div><!--/styleCss-->

           <div class="styleCss normal">
                <div class="styleCssTitle wsx">
                    <img src="../assets/images/wsx.svg" alt=""> <span>异常督导员</span>
                </div>
               <div class="zcNormal wsxLine">
                      <div class="zcNormaltitle">
                         <span>姓名</span>
                         <span>电话号码</span>
                      </div>
                
                       <AutoScroll :data="workerstatusDeny" :class-option="classOption" class="seamless-warp">  
                            <ul class="zcUl" v-if="workerstatusDeny.length">
                                <li  v-for="item in workerstatusDeny" :key="item.tel">
                                    <span>{{item.name}}</span>
                                    <span>{{item.phone}}</span>
                                </li>
                            </ul>

                            <div v-else class="zwData">暂无异常督导员</div>
                        </AutoScroll>
               </div><!--/zcNormal-->
          </div><!--/styleCss-->

           <div class="styleCss normal">
                <div class="styleCssTitle wyd">
                    <img src="../assets/images/wyd.svg" alt=""> <span>长时间未移动的督导员</span>
                </div>
               <div class="zcNormal wydline">
                      <div class="zcNormaltitle">
                         <span>姓名</span>
                         <span>电话号码</span>
                      </div>
                       <AutoScroll :data="workerstatusStay" :class-option="classOption" class="seamless-warp">  
                            <ul class="zcUl" v-if="workerstatusStay.length">
                                <li  v-for="item in workerstatusStay" :key="item.tel">
                                    <span>{{item.name}}</span>
                                    <span>{{item.phone}}</span>
                                </li>
                            </ul>

                            <div v-else class="zwData">暂无长时间未移动的督导员</div>
                        </AutoScroll>
               </div><!--/zcNormal-->
          </div><!--/styleCss-->
      </div>
</template>

<script>
import {workerstatusNormal,workerstatusDeny,workerstatusStay} from '@/api/api'
import Bus from '../utils/eventBus' //兄弟间传值
export default {
    data(){
        return{
            normalLis:[],
            workerstatusDeny:[],
            workerstatusStay:[],
            timer:null
        }
    },
    computed: {
    classOption() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum:5, // 开始无缝滚动的数据量 this.dataList.length
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
    mounted(){
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
        
    },
     beforeDestroy() {
        clearInterval(this.timer);
      },
    methods:{
        getWorkerstatusNormal(){//正常在线的督导员
           workerstatusNormal().then(res=>{
                let vals=Object.values(res);//获取key
                this.normalLis=  vals.map((item,index)=>{
                     let newLis= item.split('&')
                     //  console.log(newLis)
                       return {
                            name:newLis[0],
                            adress:newLis[1],
                            lat:parseFloat(newLis[2]),
                            lng:parseFloat(newLis[3]),
                            phone:Object.keys(res)[index],
                       }
                })
                
              Bus.$emit('zcLnglat',this.normalLis)//兄弟页面传值

           })
        },
        getWorkerstatusDeny(){//未上线的督导员
           workerstatusDeny().then(res=>{
               
                  let tels =Object.values(res);//获取key
                  let telsLis=  tels.map((item,index)=>{
                      return {
                          name:item,
                          phone:Object.keys(res)[index]
                      }
                  })
                 this.workerstatusDeny=telsLis
           })
        },
        getWorkerstatusStay(){//长时间未移动的督导员
             workerstatusStay().then(res=>{
                // console.log('123',res)
                let vals=Object.values(res);//获取key
                this.workerstatusStay=  vals.map((item,index)=>{
                     let newLis= item.split('&')
                      // console.log(newLis)
                       return {
                            name:newLis[0],
                            adress:newLis[1],
                            lat:parseFloat(newLis[2]),
                            lng:parseFloat(newLis[3]),
                            phone:Object.keys(res)[index],
                       }
                })

                  Bus.$emit('wydLnglat',this.workerstatusStay)//兄弟页面传值
             })
        }

    }
}
</script>

<style  lang='scss'>
.mapHeight{  height: 100vh;}
    .seamless-warp{ max-height: 200px;  overflow: hidden;}
    // .styleCss{ padding: 20px;  height: calc(33% - 40px); 
      .styleCss{ padding: 20px;  height: calc(33% - 40px); 
       .styleCssTitle{ text-align: left; display: flex; align-items: center;  margin:  0 0  10px 0;
          >img{width: 30px;height: 30px;}
          >span{font-size: 16px; color: #01ec0c; margin:  0 0 0 5px; font-weight: 800; text-shadow:  0 1px 1px #fff;}
          &.wsx{
            >span{color: #d81e06;}
          }
          &.wyd{
            >span{color: #1296db;}
          }
        }

        .zcNormal{ box-shadow: 0  2px 15px #e2e2e2; border-radius: 10px;
           
            &.zcline{border: 1px solid #01ec0c;animation: animated-border 1.5s infinite;
             .zcNormaltitle{ border-bottom: 1px solid #01ec0c; background:#01ec0c;
             }
             li{
                &>span{color: #01ec0c;}
               }
            }
            &.wsxLine{
                  border: 1px solid #d81e06; animation: animated-border-red  1.5s infinite;
                  .zcNormaltitle{ border-bottom: 1px solid #d81e06;background:#d81e06;}
                   li{
                        &>span{color: #d81e06;}
                    }
            }
            &.wydline{
                 border: 1px solid #1296db; animation: animated-border-lv  1.5s infinite;
                  .zcNormaltitle{ border-bottom: 1px solid #1296db;background:#1296db;}
                  li{
                        &>span{color: #1296db;}
                    }
            }
            .zcNormaltitle{
                 display: flex; align-items: center; justify-content: space-between; padding: 10px 0;
                 border-bottom: 1px solid #01ec0c; border-radius: 10px 10px 0 0;
                span{ font-size: 16px; display: inline-block; width: 50%; text-align: center; color: #fff; }
            }
            .zcUl{
                >li{
                     display: flex; align-items: center; justify-content: space-between; height: 40px;
                      border-top: 1px solid #efefef;
                   >span{
                     font-size: 14px; display: inline-block; width: 50%; text-align: center;
                   }
                }
            }
        }//zcNormal


    }

.zwData{ padding: 30px 0; text-align: center;}
          
</style>
