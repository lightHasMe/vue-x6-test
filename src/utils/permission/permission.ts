import { useUserStore } from '@/store/module/user'

interface PermissionMapType {
  /**
   * 供应商添加
   */
  supplierAdd: string
  /**
   * 供应商编辑
   */
  supplierEdit: string
  /**
   * 供应商隐藏
   */
  supplierHide: string
  /**
   * 供应商显示
   */
  supplierView: string
  /**
   * 库位添加
   */
  stockAdd: string
  /**
   * 库位编辑
   */
  stockEdit: string
  /**
   * 库位隐藏
   */
  stockHide: string
  /**
   * 库位展示
   */
  stockShow: string

  // 库区
  warehouseAdd: string // 库区增加
  warehouseEdit: string// 库区编辑
  warehouseHide: string// 库区隐藏
  warehouseView: string// 库区恢复
  // 载具
  carrierAdd: string // 载具增加
  carrierEdit: string// 载具编辑
  carrierHide: string// 载具隐藏
  carrierView: string// 载具恢复
}
export type PermissionMapKeyType = keyof PermissionMapType
const permissionMap: PermissionMapType = {
  /**
   * 供应商
   */
  supplierAdd: '/api/Supplier/Add',
  supplierEdit: '/api/Supplier/Edit',
  supplierHide: '/api/Supplier/Hide',
  supplierView: '/api/Supplier/Recover',

  /**
   * 库位
   */
  stockAdd: '/api/Stock/Add',
  stockEdit: '/api/Stock/Edit',
  stockHide: '/api/Stock/Hide',
  stockShow: '/api/Stock/Recover',
  /**
   * 库区
   */
  warehouseAdd: '/api/Warehouse/Add',
  warehouseEdit: '/api/Warehouse/Edit',
  warehouseHide: '/api/Warehouse/Hide',
  warehouseView: '/api/Warehouse/Recover',
  // 载具
  carrierAdd: '/api/Carrier/Add',
  carrierEdit: '/api/Carrier/Edit',
  carrierHide: '/api/Carrier/Hide',
  carrierView: '/api/Carrier/Recover',
}

export function usePermission() {
  const userStore = useUserStore()
  return {
    /**
     * 检查权限
     * @param value 检查值
     * @param def 默认
     * @returns 结果
     */
    hasPermission: (value: PermissionMapKeyType | null, def = true): boolean => {
      if (userStore.info.userId.toLowerCase() === 'admin') return true
      // 默认视为有权限
      if (value == null)
        return def
      // const allCodeList = permissionStore.getPermCodeList
      // if (!isArray(value))
      //   return allCodeList.includes(value)
      // const pmList = store.getters['user/permission'] as string[]

      const reqPerm = permissionMap[value]
      if (reqPerm !== undefined)
        return userStore.pmList.includes(reqPerm)
      return userStore.pmList.includes(value)

      // // intersection是lodash提供的一个方法，用于返回一个所有给定数组都存在的元素组成的数组
      // return (intersection(value, allCodeList)).length > 0

      return true
    },
    getPermissionList: (): Array<{ name: string; route: string }> => {
      const ret: Array<{ name: string; route: string }> = []
      for (const k in permissionMap) {
        const value = (permissionMap as unknown as Record<string, string>)[k]
        ret.push({
          name: k,
          route: value,
        })
      }
      return ret
    },
  }
}
