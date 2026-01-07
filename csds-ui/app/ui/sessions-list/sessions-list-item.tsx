import { ListItem, Button, ListItemAvatar, Avatar, ListItemText } from "@mui/material"
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import type { FailedSession } from '~/data/generators';
import { SessionDetailsDialog } from './session-details'
import React from "react";

type SessionsListItem = {
    data: FailedSession
}

export const SessionsListItem: React.FC<SessionsListItem> = ({ data, ...props }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <ListItem {...props}
            secondaryAction={
                <Button variant="outlined" startIcon={<InfoOutlineIcon />} onClick={handleClickOpen}>
                    Details
                </Button>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    <ErrorOutlineIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={`Error ${data.errorCode} | Session Id: ${data.sessionId}`}
                secondary={`Time stamp: ${data.timeStamp} | EVSE Id: ${data.evseId} | Connector: ${data.connectorId}`}
            />
            <SessionDetailsDialog
                open={open}
                onClose={handleClose}
                data={data}
            />
        </ListItem>
    )
}