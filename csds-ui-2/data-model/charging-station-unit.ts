// static hardware characteristics of a charger
export interface ChargingStationUnit {
  id: number
  description: {
    model: string
    manufacturer: string
  }
  components: ChargingStationComponents
  maxPower: number
  numberOfSockets: {
    ac: number
    dc: number
  }
}

interface ChargingStationComponents {
  coolingSystem: AirCoolingSystemType | LiquidCoolingSystemType
  overCurrentProtection?: boolean
  display: 'full' | 'compact' | 'none'
  tokenReader: 'RFID' | 'none'
}

type AirCoolingSystemType = {
  type: 'air'
  numberOfFans: number
  maxSpeed: number // RPM
}
type LiquidCoolingSystemType = {
  type: 'liquid'
  liquidType: string // what liquid
  minTemperature: number
}
