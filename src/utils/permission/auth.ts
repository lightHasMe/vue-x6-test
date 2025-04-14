
import type { App, DirectiveBinding } from 'vue'
import { useLogger } from '../log'
import type { PermissionMapKeyType } from './permission'
import { usePermission } from './permission'

const log = useLogger('Auth')
function isAuth(el: Element, binding: DirectiveBinding<PermissionMapKeyType | null>) {
  const { hasPermission } = usePermission()

  const value = binding.value
  if (value == null) return
  if (!hasPermission(value))
    el.parentNode?.removeChild(el)
}

const mounted = (el: Element, binding: DirectiveBinding<PermissionMapKeyType | null>) => {
  log.info('mounted')
  isAuth(el, binding)
}

const authDirective = {
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted,
}

export default authDirective

// 注册全局指令
export function setupPermissionDirective(app: App<Element>) {
  app.directive('auth', authDirective)
}
