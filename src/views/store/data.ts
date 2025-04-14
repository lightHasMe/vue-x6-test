import { defineStore } from 'pinia'
import { ref } from 'vue'

class Line {
  public line_id: string
  public line_name: string
  public exist = false

  public constructor () {
    this.line_id = ''
    this.line_name = ''
  }
}

class Eqp {
  public eqp_id: string
  public eqp_name: string
  public line_id: string
  public selected = true
  public exist = false

  public constructor () {
    this.eqp_id = ''
    this.eqp_name = ''
    this.line_id = ''
  }
}

class Port {
  public eqp_id: string
  public port_id: string
  public port_name: string
  public line_id: string
  public selected = true
  public exist = false

  public constructor () {
    this.eqp_id = ''
    this.port_id = ''
    this.port_name = ''
    this.line_id = ''
  }
}

class unit {
  public unit_id: string
  public unit_name: string
  public eqp_id: string
  public line_id: string

  public constructor () {
    this.unit_id = ''
    this.unit_name = ''
    this.eqp_id = ''
    this.line_id = ''
  }
}

export const dataStore = defineStore('dataStore', () => {
  const productionLine = ref<Line[]>([])
  const eqps = ref<Eqp[]>([])
  const ports = ref<Port[]>([])
  const units = ref<unit[]>([])

  function updateEqp (id: string, judge: boolean) {
    eqps.value.forEach((Eqp) => {
      if (Eqp.eqp_id === id)
        Eqp.selected = judge
    })
  }

  function updatePort (id: string, jodge: boolean) {
    ports.value.forEach((port) => {
      if (port.eqp_id === id)
        port.selected = jodge
    })
  }

  function setLine (data: Line[]) {
    productionLine.value = data
  }

  function setEqp (data: Eqp[]) {
    eqps.value = data.map((eqpData) => {
      const eqpInstance = new Eqp()
      Object.assign(eqpInstance, eqpData)

      eqpInstance.selected = eqpData.selected ?? true
      return eqpInstance
    })
  }

  function setPort (data: Port[]) {
    ports.value = data.map((portData) => {
      const portInstance = new Port()
      Object.assign(portInstance, portData)

      portInstance.selected = portData.selected ?? true
      return portInstance
    })
  }

  function setUnit (data: unit[]) {
    units.value = data
  }

  return { productionLine, eqps, ports, units, updateEqp, setLine, setEqp, updatePort, setPort, setUnit }
})
