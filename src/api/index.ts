import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import GlobalFetch from 'alova/GlobalFetch'

// user alova instance
export const complexityAlova = createAlova({
  // baseURL: 'http://192.168.1.227:13890/api/complexity',
  baseURL: 'https://apikg.dev.knogen.com:10444/api/complexity',
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  // 全局的响应拦截器
  responded: response => response.json(),
})

// user alova instance
export const gpcAlova = createAlova({
  baseURL: 'https://apikg.dev.knogen.com:10444/api/gpc',
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  // 全局的响应拦截器
  responded: response => response.json(),
})

// user alova instance
export const wikiNikeAlova = createAlova({
  baseURL: 'https://wiki.nikepai.com/api',
  statesHook: VueHook,
  requestAdapter: GlobalFetch(),
  // 全局的响应拦截器
  responded: response => response.json(),
})
