import type {
  AreaGroupDto,
  AreaGroupType,
  EqpGroupDto,
  EqpGroupType,
  EquipmentTraceType,
  EquipmentType,
  ItemGroupDto,
  ItemGroupType,
  LineGroupDto,
  LineGroupType,
  LineInfoType,
  PortType,
  StatusColorType,
  UnitType,
} from '../router/interface'
import { convertToCamelCase, convertToSnakeCase } from '@/utils/common'
import { } from '../components/PortList.vue'
import { GET, POST } from '@/utils/server'
export const getAllStatus = async () => {
  return await GET<string>('/StatusColor/GetAll')
}
export const getAllLine = async () => {
  const response = await GET<LineGroupDto>('/Line/GetAll')
  return convertToCamelCase<LineGroupDto, LineGroupType>(response)
}
// 修改后的 getAllEqp 函数
export const getAllEqp = async () => {
  const response = await GET<EqpGroupDto>('/Equipment/GetAll')
  return convertToCamelCase<EqpGroupDto, EqpGroupType>(response)
}
export const getAllItem = async () => {
  const response = await GET<ItemGroupDto>('/Trace/GetAll')
  return convertToCamelCase<ItemGroupDto, ItemGroupType[]>(response)
}
export const getEQPIN = async (eqpKey: string) => {
  return await GET<string>(`/Equipment/GetEqpIN?EqpKey=${eqpKey}`)
}
export const getLINEIN = async (lineKey: string) => {
  return await GET<string>(`/Line/GetLineIN?LineKey=${lineKey}`)
}
export const getAREA = async () => {
  const response = await GET<AreaGroupDto>('/Layout/GetArea')
  return convertToCamelCase<AreaGroupDto, AreaGroupType>(response)
}
export const getlineImg = async (lineId: string) => {
  return await GET<string>(`/Line/GetLocation?lineId=${lineId}`)
}
export const getEqpType = async (eqpId: string): Promise<{
  item_id: string
  item_name: string
  item_desc: string
  show_type: string
  value_max: number
  value_min: number
}[]> => {
  return await GET(`/Trace/GetItemid?eqpId=${eqpId}`)
}
// export const getEqpType = async (eqpId: string) => {
//   const response = await GET<EqpsItemGroupDto>(`/Trace/GetItemid?eqpId=${eqpId}`)
//   return convertToCamelCase<EqpsItemGroupDto, EqpsItemGroupType>(response)
// }
export const getType = async (itemId: string) => {
  return await GET<string>(`/Trace/GetType?itemId=${itemId}`)
}

export const HideData = async (formData: FormData, Name: string) => {
  try {
    const response: string = await POST(`/${Name}/Hide`, formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
export const RecoverData = async (formData: FormData, Name: string) => {
  try {
    const response: string = await POST(`/${Name}/Recover`, formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
export const saveColorInfo = async (user: StatusColorType) => {
  return await POST<number>('/StatusColor/Edit', convertToSnakeCase(user))
}
export const saveLineInfo = async (user: LineInfoType) => {
  return await POST<number>('/Line/Edit', convertToSnakeCase(user))
}
export const saveEquipmentInfo = async (user: EquipmentType) => {
  return await POST<number>('/Equipment/Edit', convertToSnakeCase(user))
}
export const saveEquipmentMidInfo = async (user: EquipmentType) => {
  return await POST<number>('/Equipment/EditMid', convertToSnakeCase(user))
}
export const saveEquipmentTraceInfo = async (user: EquipmentTraceType) => {
  return await POST<number>('/Trace/Edit', convertToSnakeCase(user))
}

export const saveEquipmentTraceMidInfo = async (user: EquipmentTraceType) => {
  return await POST<number>('/Trace/EditMid', convertToSnakeCase(user))
}

export const saveUnitInfo = async (user: UnitType) => {
  return await POST<number>('/Unit/Edit', convertToSnakeCase(user))
}
export const savePortInfo = async (user: PortType) => {
  return await POST<number>('/Port/Edit', convertToSnakeCase(user))
}
export const addColorInfo = async (user: StatusColorType) => {
  return await POST<number>('/StatusColor/Add', convertToSnakeCase(user))
}
export const addLineInfo = async (user: LineInfoType) => {
  return await POST<number>('/Line/Add', convertToSnakeCase(user))
}
export const addEquipmentInfo = async (user: EquipmentType) => {
  return await POST<number>('/Equipment/Add', convertToSnakeCase(user))
}
export const addUnitInfo = async (user: UnitType) => {
  return await POST<number>('/Unit/Add', convertToSnakeCase(user))
}
export const addPortInfo = async (user: PortType) => {
  return await POST<number>('/Port/Add', convertToSnakeCase(user))
}
export const addEquipmentTraceInfo = async (user: EquipmentTraceType) => {
  return await POST<number>('/Trace/Add', convertToSnakeCase(user))
}

export const deleteColor = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/StatusColor/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
export const deleteLine = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Line/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteTmpl = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Tmpl/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteEquipment = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Equipment/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
export const deleteEquipmentTrace = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Trace/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
export const deleteUnit = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Unit/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deletePort = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Port/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const deleteLayout = async (Key: number) => {
  const int64Key = BigInt(Key).toString()
  const requestBody = JSON.stringify(int64Key) // 只包含 Key 的值

  return await POST<string>('/Layout/Hide', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const updateINUnit = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Unit/Hide', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
export const updateUNit = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Unit/Recover', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateINEqp = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Equipment/Hide', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
export const updateIEqp = async (formData: FormData) => {
  try {
    const response: string = await POST(
      '/BasicInfo/Equipment/Recover',
      formData,
    )
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateINLine = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Line/Hide', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateLine = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Line/Recover', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateINPort = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Port/Hide', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateIPort = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Port/Recover', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}

export const updateINArea = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Layout/Hide', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
export const updateArea = async (formData: FormData) => {
  try {
    const response: string = await POST('/BasicInfo/Layout/Recover', formData)
    return response
  }
  catch (error) {
    console.error('Error in updateInColor:', error)
    throw error // 重新抛出错误以便调用者可以处理
  }
}
