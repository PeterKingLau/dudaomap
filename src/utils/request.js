import axios from 'axios'

const waresofeLocation = '四川'
const MAX_CONCURRENT_REQUESTS = 6

const service = axios.create({
  timeout: 1000 * 6000,
  baseURL: import.meta.env.VITE_BASE_URL_HTTPS,
})

const pendingRequests = new Map()
const requestQueue = []
let activeRequestCount = 0

function normalizePayload(payload = {}) {
  return {
    disname: waresofeLocation,
    ...payload,
  }
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`
}

function getRequestKey(method, url, payload) {
  return `${method.toUpperCase()}::${url}::${stableStringify(payload)}`
}

function runNextRequest() {
  while (
    activeRequestCount < MAX_CONCURRENT_REQUESTS &&
    requestQueue.length > 0
  ) {
    const { task, resolve, reject } = requestQueue.shift()
    activeRequestCount += 1

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activeRequestCount -= 1
        runNextRequest()
      })
  }
}

function enqueueRequest(task) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ task, resolve, reject })
    runNextRequest()
  })
}

function request(method, url, payload = {}) {
  const data = normalizePayload(payload)
  const requestKey = getRequestKey(method, url, data)

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)
  }

  const task = () => {
    if (method === 'get') {
      return service.get(url, { params: data })
    }

    return service.post(url, data)
  }

  const promise = enqueueRequest(task).finally(() => {
    pendingRequests.delete(requestKey)
  })

  pendingRequests.set(requestKey, promise)
  return promise
}

function post(url, data = {}) {
  return request('post', url, data)
}

function get(url, params = {}) {
  return request('get', url, params)
}

service.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export default {
  post,
  get,
  waresofeLocation,
}
