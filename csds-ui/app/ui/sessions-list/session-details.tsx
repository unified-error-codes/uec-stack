import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import type { FailedSession } from '~/data/generators';
import IconButton from '@mui/material/IconButton';

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    data: FailedSession;
}

export const SessionDetailsDialog = (props: SimpleDialogProps) => {
    const { onClose, open, data } = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>{`Session details`}</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <List>
                    <ListItem>
                        <ListItemText primary={`Session Id: ${data.sessionId}`} />
                    </ListItem >
                    <ListItem>
                        <ListItemText primary={`Error Code: ${data.errorCode}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Time stamp: ${data.timeStamp}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`EVSE Id: ${data.evseId}`} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary={`Connector: ${data.connectorId}`} />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary={`Description: ${data.details}`} />
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
}
