import type { ChargerSocketVariables } from './charging-station-config'

// live data points that represent operational status
export interface ChargingStationVariables {
  status: {
    code: number
    label: string
  }
  networkConnection: 'online' | 'offline'
  internalTemperature: {
    value: number
    unit: 'C' | 'F' | 'K'
  }
  components: ComponentsVariables
  sockets: ChargerSocketVariables[]
}

// each unit component should have data point
interface ComponentsVariables {
  coolingSystem:
    | {
        fanSpeed: CurrentTarget
      }
    | {
        liquidTemperature: CurrentTarget
      }
  display: 'online' | 'offline'
  tokenReader: 'online' | 'offline'
}

type CurrentTarget = {
  target: number
  current: number
}
