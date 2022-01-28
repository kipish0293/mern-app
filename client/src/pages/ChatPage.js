import React, { useContext, useEffect, useRef, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/auth.context";
import io from 'socket.io-client'
import { TextField } from '@material-ui/core'

let socket = io.connect('http://localhost:5000')

const ChatPage = () => {
    const auth = useContext(AuthContext)
    const userName = auth.userName;
    const chatRef = useRef()

    const {loading, error, request, clearError} = useHttp()

    const [mess, setMess] = useState({message : '', name : userName })
    const [chat, setChat] = useState([])

    const renderChat = () => {
        return chat.map(({name, message, date}, index)=> (
            <div style={{marginBottom : "10px"}} key={index}>
                <p style={{padding : 0, margin : 0, lineHeight : "1em"}}>{name} : <span>{message}</span></p>
                <span style={{fontSize : "10px", color:"gray"}}>{`${new Date(date).toLocaleString()}`}</span>
            </div>
        ))
    }

    const onTextChange = (e) => {
        setMess({...mess, [e.target.name] : e.target.value})
    }

    const onMessageSubmit = (e) => {
        e.preventDefault()
        const {name, message} = mess
        socket.emit('message', {name, message})
        setMess({message : "", name : userName})
    }

    useEffect(()=> {
        socket.on('message', ({name, message, dateToIo}) => {
            setChat([{name, message, date : dateToIo}, ...chat])
        })
    })

    useEffect(async ()=> {
        const data = await request('/api/auth/messager', 'GET')
        const newMessages = data.messages.reduce((sum, item)=>{
            sum.push({name : item.name, message : item.message, date : item.date})
            return sum;
        },[]).reverse()
        setChat(newMessages)
    },[])

    return (
        <div className="row">   
            <div>
                <form onSubmit={onMessageSubmit}>
                    <h1>Messanger</h1>
                    {/* <div>
                        <TextField
                            name="name"
                            onChange={e => onTextChange(e)}
                            value={mess.name}
                            label="Name"
                        />
                    </div> */}
                    <div>
                        <TextField
                            name="message"
                            onChange={e => onTextChange(e)}
                            value={mess.message}
                            id="outlined-multiline-static"
                            variant="outlined"
                            label="Message"
                            disabled={!userName}
                        />
                    </div>
                    <button>
                        Send Message
                    </button>
                </form>
                <div ref={chatRef} style={{height : "400px", overflowY : "scroll"}}>
                    <h1>Chat Log</h1>
                    {renderChat()}
                </div>
            </div>
        </div>
    )
}

export default ChatPage