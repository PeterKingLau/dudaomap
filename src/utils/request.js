import axios from 'axios';
//设置axios
    let waresofeLocation = '涪城' //打包区域端
const service=axios.create({
    timeout:1000*6000,
    baseURL:process.env.BASE_URL_HTTPS
   //  baseURL:process.env.VUE_APP_BASE_URL
   //baseURL:'/api',//对axios发送的请求路径进行集中设置
})

// console.log('service:',process.env.BASE_URL_HTTPS)
//封装post请求
let post=function(url,data_={}){
    return new Promise((resolve,reject)=>{
        data_ = {
            ...{disname:waresofeLocation},
            ...data_
        }
        service.post(url,data_).then((res)=>{
           
            return resolve(res)
        }).catch((err)=>{
            return reject(err)
        })
    })
}

//封装get请求
let get=function(url,params){
    params = {
        ...{disname:waresofeLocation},
        ...params
    }
    return new Promise((resolve,reject)=>{
        service.get(url,{params},
            ).then((res)=>{
            return resolve(res)
        }).catch((err)=>{
            return reject(err)
        })
    })
}

//请求拦截       
service.interceptors.request.use(config=>{
    //添加请求头
    config.headers={
        'Content-Type': 'application/x-www-form-urlencoded',
        //  "Authorization":'1231312'
    }
    return config
},err=>{
    return Promise.reject(err)
})

//添加响应拦截
service.interceptors.response.use(res=>{
    return res.data
},err=>{
    return err
})

export default{
    post,
    get,
    waresofeLocation
}