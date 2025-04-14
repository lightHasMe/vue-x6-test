/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
export interface RequestInterceptors<RespType = any> {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>
  requestInterceptorsCatch?: (err: any) => any
  // 响应拦截
  responseInterceptors?: (config: AxiosResponse<RespType, any>) => AxiosResponse<RespType, any>
  responseInterceptorsCatch?: (err: AxiosError<RespType>) => any
}
// 自定义传入的参数
export interface RequestConfig<ReqType = any, RespType = any> extends InternalAxiosRequestConfig<ReqType> {
  interceptors?: RequestInterceptors<RespType>
}

export interface ServerRequestConfig<RequestType = any, ResponseType = any> extends RequestConfig<RequestType, ResponseType> {
  data?: RequestType
  showErrorMessage?: boolean
  serviceName?: string
}
export interface ServerRequestSimpleConfig<RequestType = any> extends AxiosRequestConfig<RequestType> {
  data?: RequestType
  showErrorMessage?: boolean
  serviceName?: string
}
export interface ServerResponse<T> {
  header: any
  body: T
  result?: ServerResponseResultType
}
export interface ServerResponseResultType {
  code?: number
  message?: string
}
