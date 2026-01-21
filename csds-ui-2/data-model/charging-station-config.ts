import type { EVSE, EVSEVariables } from './evse'
// static configuration of a charger
export interface ChargingStationUnitConfig {
  powerLimit: number
  // power sources that EVSEs use. 1 socket can be used by 1 EVSE
  sockets: ChargerSocket[]
  overCurrentProtection: {
    treshold: number
  }
  internalTemperature: {
    target: number
    minSet: number // treshold value
    maxSet: number // treshold value
  }
}

export type ChargerSocketCommons = {
  id: number
  type: 'AC' | 'DC'
}

export type ChargerSocket = ChargerSocketCommons & {
  evse: EVSE | {}
}

export type ChargerSocketVariables = {
  status: 'online' | 'offline'
  evse: EVSEVariables | {}
}
