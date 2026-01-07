import { generateFailedSessions } from './generators'

// mocked server calls

export const fetchData = {
    failedSessions: () => {
        console.log('fetching failed sessions')
        return Promise.resolve().then(() => {
            return generateFailedSessions(25)
        }).catch(e => {
            console.error('error during fetching failed sessions data', e)
        })
    }
}