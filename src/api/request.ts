import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/http'
import { ApiRequestError } from '@/types/http'
import { getToken } from '@/utils/token'

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000
  })

  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  return instance
}

const http = createHttpClient()

const unwrapResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  const payload = response.data

  if (typeof payload?.code !== 'number') {
    throw new ApiRequestError('接口响应格式错误', response.status, -1)
  }

  if (payload.code !== 0) {
    throw new ApiRequestError(payload.message || '业务处理失败', response.status, payload.code)
  }

  return payload.data
}

const transformAxiosError = (error: unknown): ApiRequestError => {
  if (error instanceof ApiRequestError) {
    return error
  }

  const axiosError = error as AxiosError<ApiResponse<null>>
  const httpStatus = axiosError.response?.status ?? 0
  const businessCode = axiosError.response?.data?.code ?? httpStatus
  const message = axiosError.response?.data?.message || axiosError.message || '网络请求失败'
  return new ApiRequestError(message, httpStatus, businessCode)
}

export const request = {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await http.get<ApiResponse<T>>(url, { params })
      return unwrapResponse(response)
    } catch (error) {
      throw transformAxiosError(error)
    }
  },
  async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response = await http.post<ApiResponse<T>>(url, data)
      return unwrapResponse(response)
    } catch (error) {
      throw transformAxiosError(error)
    }
  }
}
