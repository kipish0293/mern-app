import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, makeStyles, TextField, withWidth } from '@material-ui/core'
import socket from "../socket";
import ACTIONS from "../socket/actions";
import { useHistory } from "react-router-dom";
import {v4} from 'uuid'

const useClasses = makeStyles((theme)=> ({
    inputStyle : {
        marginTop: "20px",
        width : "50%",
        
        "& div" : {
            padding : "10px",
            "& input": {
                padding : "4px 5px 5px!important",
                fontSize : "16px!important",
                color : "#333333!important",
                [theme.breakpoints.between(theme.breakpoints.values.sm, theme.breakpoints.values.md)]: {
                  fontSize : "16px!important",
                  minWidth : "50px!important",
                },
                [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
                  fontSize : "14px!important",
                },
              },
        }
        
    },
    nameInstall : {
        [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
          width : "100%"
        },
    },
    videoChat : {
        display : 'grid',
        gridTemplateColumns : "repeat(auto-fill, '300px')",
        gridAutoRows : "300px"
    },
    video : {
        width : "100%",
        height : "100%",
        objectFit : "cover",
    }
}))

const VideoChatPage = (props) => {
    const classes = useClasses()
    const history = useHistory();
    const [rooms, updateRooms] = useState([]);
    const rootNode = useRef();

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
        if (rootNode.current) {
            updateRooms(rooms);
        }
        });
    }, []);

    return (
        <div ref={rootNode}>
        <h1>Available Rooms</h1>

        <ul>
            {rooms.map(roomID => (
            <li key={roomID}>
                {roomID}
                <button onClick={() => {
                history.push(`/room/${roomID}`);
                }}>JOIN ROOM</button>
            </li>
            ))}
        </ul>

        <button onClick={() => {
            history.push(`/room/${v4()}`);
        }}>Create New Room</button>
        </div>
    );
}

export default withWidth()(VideoChatPage)