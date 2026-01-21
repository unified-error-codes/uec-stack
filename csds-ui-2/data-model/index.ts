import type { ChargingStationUnit } from './charging-station-unit'
import type { ChargingStationUnitConfig } from './charging-station-config'
import type { ChargingStationVariables } from './variables'

export interface ChargingStationDataModel {
  // static hardware characteristics of a charger
  unit: ChargingStationUnit
  // static configuration of a charger
  config: ChargingStationUnitConfig
  // live data points that represent operational status
  variables: ChargingStationVariables
}
