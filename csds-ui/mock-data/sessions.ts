import type { SessionDataType } from '~/ui/templates/outlets/sessions'
import { getRandomNumberInRange, generateDate } from './generators'

// set arbitrary amount of sessions to be displayed
export const sessionItemsCount = 100

export const sessionListData: SessionDataType[] = []

for (let i = 0; i < sessionItemsCount; i++) {
  let dates = generateDate()
  sessionListData.push({
    sessionId: getRandomNumberInRange(100000000, 999999999),
    errorCode: getRandomNumberInRange(500, 504),
    startTimestamp: Date.parse(dates.startDate.toString()),
    endTimestamp: Date.parse(dates.endDate.toString()),
    chargePointId: getRandomNumberInRange(0, 4),
    connectorId: getRandomNumberInRange(0, 8),
  })
}
