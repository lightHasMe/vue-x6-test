import type { EventCenterForMicroApp } from '@micro-zoe/micro-app'
import type { TabData } from './interfaces'
import log from './log'

export const useMainApp = () => ({
  addTab: (tab: TabData) => {
    const microApp = (window as unknown as Record<string, EventCenterForMicroApp | undefined>).microApp
    if (!microApp) {
      log.error('not running under mainApp!')
      return
    }
    log.info('add tab to main', tab, microApp)
    microApp.dispatch({
      addTab: tab,
    })
  },
})
