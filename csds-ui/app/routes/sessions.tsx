import React from 'react'
import SessionsList from "~/ui/sessions-list";
import { fetchData } from '~/data/fetch'
import type { FailedSession } from '~/data/generators';


export default function Sessions() {

  // fetch data
  // const failedSessionsData: Promise<FailedSession[]> = React.useMemo(
  //   () => fetchData.failedSessions(),
  //   []
  // );

  return fetchData.failedSessions().then((failedSessionsData) => {
    return <SessionsList failedSessionsData={failedSessionsData} />;
  })

}
