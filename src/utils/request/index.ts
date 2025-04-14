// index.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestInterceptors } from './types'

class Request<T> {
  // axios 实例
  instance: AxiosInstance
  // 拦截器对象
  interceptorsObj?: RequestInterceptors<AxiosResponse>

  constructor(config: RequestConfig<T>) {
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<T>) => {
        return config
      },
      async (err) => {
        return await Promise.reject(err)
      },
    )

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestInterceptors,
      config.interceptors?.requestInterceptorsCatch,
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseInterceptors,
      config.interceptors?.responseInterceptorsCatch,
    )

    // 全局响应拦截器保证最后执行
    this.instance.interceptors.response.use(
      // 因为我们接口的数据都在res.data下，所以我们直接返回res.data
      (res: AxiosResponse) => {
        return res
      },
      async err => await Promise.reject(err),
    )
  }

  async request<RespType, ReqType>(config: RequestConfig<ReqType, RespType>): Promise<AxiosResponse<RespType>> {
    return await new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if ((config.interceptors?.requestInterceptors) != null)
        config = config.interceptors.requestInterceptors(config)

      this.instance
        .request<RespType>(config)
        .then((res) => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if ((config.interceptors?.responseInterceptors) != null)
            res = config.interceptors.responseInterceptors(res)

          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default Request
