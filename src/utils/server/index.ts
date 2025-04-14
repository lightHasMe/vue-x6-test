/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError, AxiosHeaders } from 'axios'
import Request from '../request/index'
import router from '../../router'
import type { ServerRequestConfig, ServerRequestSimpleConfig, ServerResponse } from '../request/types'
import { useLogger } from '../log'
import { message } from './../message'

const log = useLogger('Server')
const cfg: ServerRequestConfig<any, ServerResponse<never>> = {
  baseURL: '/api',
  timeout: 1000 * 60 * 5,
  interceptors: {
    // 请求拦截器
    requestInterceptors: (config) => {
      // Do something before request is sent

      return config
    },
    // 响应拦截器
    responseInterceptors: (response) => {
      const resp = response.data
      if (resp.result == null)
        message.error('响应体状态码丢失！')

      return response
    },
    async responseInterceptorsCatch(error) {
      // Do something with response error
      log.error('请求出现异常 - ', error)
      log.error('错误对象类型 - ', Object.prototype.toString.call(error))
      log.error('error.name', error.name)
      log.error('error.message', error.message)
      log.error('error.code', error.code)
      log.error('error.status', error.status)

      // 网络异常
      if (error.message === 'Network Error') {
        message.error('服务器通信错误！')
        return await Promise.reject(error)
      }
      else if (error.message.includes('timeout')) {
        message.error('服务器响应超时')
        return await Promise.reject(error)
      }

      // 网络正常，但请求失败
      const resp = error.response
      if (resp === undefined) return await Promise.reject(error)
      const data = resp.data

      switch (resp.status) {
        // 401: 未登录，或者登录过期
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          message.warning('未登录')
          // 清除token
          localStorage.removeItem('token')
          await router.push({
            path: '/login',
            query: {
              redirect: router.currentRoute.value.fullPath,
            },
          })
          break

        // 403 没有接口相关权限
        // 对用户进行提示
        // 跳转登录页面
        case 403:
          message.warning('你没有权限执行该操作')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //     path: "/index",
          //     query: {
          //       redirect: router.currentRoute.fullPath
          //     }
          //   });
          // }, 1000);
          break

        // 404请求不存在
        case 404:
          message.error('接口不存在！')
          break
        // 其他错误，直接抛出错误提示
        default:
          if (data.result == null)
            message.error('请求发生异常1！')
      }
      return await Promise.reject(error)
    },
  },
  headers: new AxiosHeaders({
    'Content-Type': 'application/json',
  }),
}
const request = new Request<ServerResponse<never>>(cfg)

/**
 * @description: 函数的描述
 * @interface D 请求参数的interface
 * @interface T 响应结构的interface
 * @param {ServerRequestConfig} config 不管是GET还是POST请求都使用data
 * @returns {Promise}
 */
const ServerRequest = async <ReqType, RespType>(config: ServerRequestSimpleConfig<ReqType>) => {
  const { method = 'GET' } = config
  if (method === 'get' || method === 'GET') {
    if (config.data !== undefined && undefined === config.params)
      config.params = config.data
  }
  const cfg: ServerRequestConfig<ReqType, ServerResponse<RespType>> = {
    ...config,
    headers: new AxiosHeaders(),
  }

  return await request.request<ServerResponse<RespType>, any>(cfg).then(async (res) => {
    if (res?.data?.result?.code === 0) return await Promise.resolve(res.data.body)
    const err = new AxiosError()
    err.response = res
    err.message = 'ERR_BODY_CODE_NOT_ZERO'
    return await Promise.reject(err)
  }).catch(async (err: AxiosError<ServerResponse<RespType>>) => {
    // code不正确
    // console.error('code不正确', err)
    if (config.showErrorMessage !== false) {
      const resp = err?.response
      if (resp != null) {
        const data = resp.data
      }
    }
    return await Promise.reject(err)
  })
}

export const POST = async <ResponseType = any, RequestType = any>(url: string, data: RequestType, config?: ServerRequestSimpleConfig<RequestType>) => {
  if (config == null)config = {}
  config.url = url
  config.data = data
  config.method = 'POST'
  return await ServerRequest<RequestType, ResponseType>(config)
}
export const GET = async <ResponseType = any, RequestType = any>(url: string, config?: ServerRequestSimpleConfig<RequestType>) => {
  if (config == null)config = {}
  config.url = url
  config.method = 'GET'
  return await ServerRequest<RequestType, ResponseType>(config)
}
export const PUT = async <ResponseType = any, RequestType = any>(url: string, data: RequestType, config?: ServerRequestSimpleConfig<RequestType>) => {
  if (config == null)config = {}
  config.url = url
  config.data = data
  config.method = 'PUT'
  return await ServerRequest<RequestType, ResponseType>(config)
}
export const DELETE = async <ResponseType = any, RequestType = any>(url: string, config?: ServerRequestSimpleConfig<RequestType>) => {
  if (config == null)config = {}
  config.url = url
  config.method = 'DELETE'
  return await ServerRequest<RequestType, ResponseType>(config)
}
export default ServerRequest
