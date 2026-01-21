//Electric Vehicle Supply Equipment static data
export interface EVSE extends EVSECommons {
  power: {
    limit: number
    target: number
    minSet: number // treshold value
    maxSet: number // treshold value
  }
  connectors: ConnectorInterface[]
  phaseRotation: 'RST' | 'STR'
}

export interface ConnectorInterface {
  id: number
  type: 'CCS' | 'CHAdeMO' | 'Type2' | 'NACS' | 'Type1'
}

type EVSECommons = { id: number }

export interface EVSEVariables extends EVSECommons {
  status: 'available' | 'charging' | 'corrupt'
  currentPower: number
  connectors: (ConnectorInterface & {
    physicalState: 'availavble' | 'in use' | 'corrupt'
  })[]
}
