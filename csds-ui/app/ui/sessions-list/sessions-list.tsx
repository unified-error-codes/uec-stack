import * as React from 'react';
import List from '@mui/material/List';
import { SessionsListItem } from './sessions-list-item'
import type { FailedSession } from '~/data/generators';

type SessionsList = {
    failedSessionsData: void | FailedSession[]
}

export const SessionsList: React.FC<SessionsList> = ({ failedSessionsData }) => {
    return (
        <List>
            {failedSessionsData?.map((data: FailedSession, i) => <SessionsListItem data={data} key={i} />)}
        </List>
    );
}
