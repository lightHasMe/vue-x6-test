
/**
 * 菜单属性类型
 */
export interface MenuMetaItem {
  icon: string
  title: {
    [key: string]: string
    zhCn: string
    en: string
    zhTw: string
    multilingual: string
  }
  componentPath: string
  isKeepAlive: boolean
  hidden: boolean
}

/**
 * 菜单类型
 */
export interface MenuItem {
  key: string
  path: string
  name: string
  meta: MenuMetaItem
  props: boolean | Record<string, string>
  children?: MenuItem[]
}

/**
 * 系统功能类型
 */
export interface FunctionItem {
  /**
   * @deprecated 使用多语言keyword
   */
  function_name_zh_cn: string
  /**
   * @deprecated 使用多语言keyword
   */
  function_name_en: string
  /**
   * @deprecated 使用多语言keyword
   */
  function_name_zh_tw: string
  /**
   * 多语言关键字
   */
  multilingual: string
  father_function_key: string
  path_name: string
  function_id: string
  menu_icon: string
  /**
   * @deprecated
   */
  function_sub_type: string
  component_path: string
  is_keepalive: 0 | 1 | '0' | '1'
  is_visible: 'Y' | 'N'
  function_key: string
  props: string
}

export interface TabData {
  /**
   * 标题，多语言
   */
  title: string
  name: string
  /**
   * 路由
   */
  route: string
  /**
   * 完全路由
   */
  fullPath: string
  meta: Record<string, unknown>
  immediate: boolean
}
