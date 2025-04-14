import { GET, POST } from '@/utils/server'

/**
 * 上传画布
 * @param data
 * @returns
 */
export const uplodeFile = (data: {
  name: string
  id: string
  file: string
  photo: string
}) => {
  return POST('/area/GitUpload', data)
}

/**
 * 下载获取画布内容
 * @returns
*/
export const getFile = async (): Promise<{
  id: string
  storey: string
  graph_data: string
}> => {
  return await GET('/area/download')
}

/**
 * 获取一个画布的非重复ID
 * @returns
 */
export const getAreaId = () => {
  return GET<string>('/area/id')
}

/**
 * 根据画布ID获取画布内容
 * @param params 画布ID
 * @returns
 */
export const getGraphDataByAreaId = (params: string) => {
  if (params === '')
    return null

  return GET(`/area/download?areaId=${params}`)
}

/**
 * 获取产线相关信息数据
 * @returns
 */
export const getLineInfo = async (): Promise<{
  line_key: number
  line_id: string
  line_name: string
}> => {
  return await GET('/Line/GetAll')
}

/**
 * 获取设备相关信息数据
 * @returns
 */
export const getEqpInfo = async (): Promise<{
  eqp_key: number
  eqp_id: string
  eqp_name: string
  line_id: string
}> => {
  return await GET('/Equipment/GetAll')
}

/**
 *
 * @returns 获取端口相关信息数据
 */
export const getPortInfo = async (): Promise<{
  eqp_id: string
  port_id: string
  port_name: string
  line_id: string
}> => {
  return await GET('/Port/GetAll')
}

/**
 *
 * @returns 根据产线ID获取对应的图片Base64
 */
export const getLinePhoto = async (lineId: string) => {
  return await GET<string>(`/Line/GetLocation?LineId=${lineId}`)
}

/**
 *
 * @param tmplId 模版ID
 * @returns 根据模版ID获取相关数据
 */
export const getTmplDataByTmplId = async (tmplId: string): Promise<
  string
> => {
  return await GET(`/Tmpl/download?TmplId=${tmplId}`)
}

/**
 *
 * @returns 获取一个不重复的模版ID
 */
export const getTmplId = async (): Promise<string> => {
  return await GET('/Tmpl/id')
}

/**
 *
 * @param data 上传模版数据
 * @returns
 */
export const uplodeTmplFile = async (data: {
  name: string
  id: string
  file: string
  photo: string
}): Promise<boolean> => {
  return await POST('/Tmpl/GitUpload', data)
}

/**
 *
 * @returns 获取所以模版缩略图
 */
export const getTmplPhotos = async (): Promise<string[]> => {
  return await GET('/Tmpl/GetPhotos')
}

/**
 *
 * @returns 获取所有子设备信息
 */
export const getUnitInfo = async (): Promise<{
  unit_id: string
  unit_name: string
  eqp_id: string
  line_id: string
}> => {
  return await GET('/Unit/GetAll')
}
