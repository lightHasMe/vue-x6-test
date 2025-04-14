
import type { FunctionItem, MenuItem } from './interfaces'

/**
 * Map<k, v>转换为对象
 * @param list
 * @returns
 */
export const dataList2objList = (list: Array<Array<{ data_name?: string; data_value?: string; DATA_NAME?: string; DATA_VALUE?: string }>>) => {
  const result = []
  for (const data of list) {
    const obj: Record<string, string> = {}
    for (const item of data) {
      let k = item.data_name
      let v = item.data_value
      if (k === undefined) {
        k = item.DATA_NAME
        v = item.DATA_VALUE
      }
      if (k !== undefined)
        obj[k] = v ?? ''
    }
    result.push(obj)
  }
  return result
}

export const objList2dataList = (objList: unknown[][]) => {
  const result = []
  for (const obj1 of objList) {
    const data: Array<{ dataname: unknown; datavalue: unknown }> = []
    obj1.forEach((k: unknown, v: unknown) => {
      data.push({
        dataname: k,
        datavalue: v,
      })
    })
    result.push(data)
  }
  return result
}

// 假设只处理逗号列分隔符
export function csvToArray(csv: string, delimiter = ','): string[][] {
  const table = [] as string[][]
  let row: string[] = []
  let cell = ''
  let openQuote = false
  let i = 0

  const pushCell = () => {
    row.push(cell)
    cell = ''
  }

  const pushRow = () => {
    pushCell()
    table.push(row)
    row = []
  }
  // 处理行分隔符和列分隔符
  const handleSeparator = () => {
    const c = csv.charAt(i)
    if (c === delimiter) {
      pushCell()
    }
    else if (c === '\r') {
      if (csv.charAt(i + 1) === '\n')
        i++

      pushRow()
    }
    else if (c === '\n') {
      pushRow()
    }
    else {
      return false
    }
    return true
  }

  while (i < csv.length) {
    const c = csv.charAt(i)
    const next = csv.charAt(i + 1)
    if (!openQuote && (cell.length === 0) && c === '"') {
      // 遇到单元第一个字符为双引号时假设整个单元都是被双引号括起来
      openQuote = true
    }
    else if (openQuote) {
      // 双引号还未成对的时候
      if (c !== '"') {
        // 如非双引号，直接添加进单元内容
        cell += c
      }
      else if (next === '"') {
        // 处理双引号转义
        cell += c
        i++
      }
      else {
        // 确认单元结束
        openQuote = false
        ++i
        if (!handleSeparator())
          throw new Error('Wrong CSV format!')
      }
    }
    else if (!handleSeparator()) {
      // 没有双引号包起来时，如非行列分隔符，一律直接加入单元内容
      cell += c
    }
    i++
  }
  if (cell.length > 0)
    pushRow()

  return table
}

/**
 * 菜单生成
 * @param funcList 所有菜单列表
 * @param fatherFunctionKey 父菜单标识
 */
export const genMenu = (funcList: FunctionItem[], fatherFunctionKey: string | null = null) => {
  const result = []
  const child = funcList.filter(e => e.father_function_key === fatherFunctionKey)
  for (const func of child) {
    const data: MenuItem = {
      key: func.function_key,
      path: func.path_name.length > 0 ? func.path_name : '/',
      name: func.function_id,
      meta: {
        title: {
          zhCn: func.function_name_zh_cn,
          en: func.function_name_en,
          zhTw: func.function_name_zh_tw,
          multilingual: func.multilingual,
        },
        icon: func.menu_icon,
        componentPath: func.component_path,
        isKeepAlive: func.is_keepalive === 1 || func.is_keepalive === '1',
        hidden: func.is_visible === 'N',
      },
      props: true,
    }
    if (func.path_name.length > 0 && func.path_name.includes('/:'))
      data.props = true

    try {
      data.props = JSON.parse(func.props) as Record<string, string>
    }
    catch (err) {
      console.error('路由参数解析失败！', func.props)
    }

    data.children = genMenu(funcList, func.function_key)
    result.push(data)
  }
  if (fatherFunctionKey == null && result.length > 0) return result[0].children ?? result
  return result
}

function getType(obj: unknown) {
  const type = typeof obj
  if (type !== 'object')
    return type

  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}

/**
 * 将下划线式字符串转换为驼峰式字符串的辅助函数
 * @param str 下划线式字符串
 * @returns 驼峰式字符串
 */
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (g) => {
    return g[1].toUpperCase()
  })
}

/**
 * 将驼峰式字符串转换为下划线式字符串的辅助函数
 * @param str 驼峰式字符串
 * @returns 下划线式字符串
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
}

export const convertToCase = <T1, T2>(fromData: T1, method: (str: string) => string): T2 => {
  if (['number', 'string'].includes(typeof fromData))
    return fromData as unknown as T2

  // 创建一个新的对象，用于存储转换后的键值对
  const result: Record<string, unknown> = {}
  // 遍历输入对象的键
  for (const key in fromData) {
    if (Object.prototype.hasOwnProperty.call(fromData, key)) {
      // 将驼峰式键转换为下划线式键，并获取对应的值
      const newKey = method(key)
      let value = fromData[key]

      // 将新的键值对添加到结果对象中
      const type = getType(value)
      // console.log('typeof value =', type)
      switch (type) {
        case 'Array':
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-case-declarations
            const data: any = (value as any[]).map(e => convertToCase(e, method))
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value = data
          }
          break
        case 'Object':
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
            const data: any = convertToCase(value, method)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value = data
          }
          break
      }
      result[newKey] = value
    }
  }
  // 返回转换后的对象
  return result as T2
}

/**
 * 表格数据转驼峰 [TABLE_NAME -> tableName]
 * @param fromData 表格数据
 * @param method
 * @returns
 */
export const convertTableDataToCase = <T1, T2>(fromData: T1): T2 => {
  // 创建一个新的对象，用于存储转换后的键值对
  const result: Record<string, unknown> = {}
  // 遍历输入对象的键
  for (const key in fromData) {
    if (Object.prototype.hasOwnProperty.call(fromData, key)) {
      // 将驼峰式键转换为下划线式键，并获取对应的值
      const newKey = toCamelCase(key.toLowerCase())
      const value = fromData[key]

      // 将新的键值对添加到结果对象中
      result[newKey] = value
    }
  }
  // 返回转换后的对象
  return result as T2
}

/**
 * 将对象中的属性由驼峰式转为下划线式
 * @param fromData 属性是驼峰式的数据
 * @returns
 */
export const convertToSnakeCase = <T1, T2>(fromData: T1): T2 => {
  return convertToCase(fromData, toSnakeCase)
}

/**
 * 将对象中的属性由下划线式转为驼峰式
 * @param fromData 属性是下划线形式的数据
 * @returns
 */
export const convertToCamelCase = <T1, T2>(fromData: T1): T2 => {
  return convertToCase(fromData, toCamelCase)
}

export const useMainApp = () => {
  return (window as unknown as Record<string, string>).microApp ? window.parent : window
}
