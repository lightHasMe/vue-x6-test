import type { App } from 'vue'
import auth from './permission/auth'
import type { PermissionMapKeyType } from './permission/permission'

const directives: Record<string, {
  mounted: (el: Element, binding: globalThis.DirectiveBinding<PermissionMapKeyType | null>) => void
}> = { // 指令对象
  auth,
}
export default {
  install(app: App<Element>) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}
