import React, { useContext, useEffect, useRef, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/auth.context";
import { Button, makeStyles, TextField, withWidth } from '@material-ui/core'
import io from 'socket.io-client'

// let socket = io.connect('http://our-family-gallery.ru')

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
}))

const ChatPage = () => {
    const classes = useClasses()
    const auth = useContext(AuthContext)
    const userName = auth.userName;
    const chatRef = useRef()
    const message = useMessage()

    const {request} = useHttp()

    const [mess, setMess] = useState({message : '', name : userName })
    const [chat, setChat] = useState([])
    const socketRef = useRef()


    const renderChat = () => {
        return chat.map(({name, message, date}, index)=> (

            <div className={name == userName ? 'you' : 'not-you'} style={{marginBottom : "10px"}} key={index}>
                <p style={{padding : 0, margin : 0 }}>{name} : <span>{message}</span></p>
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
        socketRef.current.emit("message", { name, message })
        setMess({message : "", name : userName})
    }

    useEffect(()=> {
        socketRef.current = io.connect('http://our-family-gallery.ru')
        // socketRef.current = io.connect('http://localhost:3000')

        socketRef.current.on("message", ({name, message, dateToIo})=> {
            setChat([...chat, ...[{name, message, date : dateToIo}]])
        })
        socketRef.current.on('userJoinToChat', ({name, message, date}) => {
            setChat([...chat, ...[{name, message, date : date}]])
        })
        setTimeout(()=> {
            chatRef.current.scrollTo(0, 999999)
        },500)
       
        return () => socketRef.current.disconnect()
    }, [chat])    

    useEffect(()=> {
        if(userName) {
            message(`Пользователь ${userName} 
                    присоединился к чату`)
            socketRef.current.emit('userJoined', {userName})
        }
    }, [])

    useEffect(async ()=> {
        const data = await request('/api/auth/messager', 'GET')
        const newMessages = data.messages.reduce((sum, item)=>{
            sum.push({name : item.name, message : item.message, date : item.date})
            return sum;
        },[])
        setChat(newMessages)
        setTimeout(()=> {
            chatRef.current.scrollTo(0, 999999)
        },500)
    },[])

    return (
        <div className="row">   
            <div className="container2"  >
                <div className="typed-out">Добро пожаловать в чат!</div>
            </div>
            <div ref={chatRef} style={{height : "400px", width:"50%", overflowY : "scroll"}}>
                {renderChat()}
            </div>

            <div>
                <form
                    onSubmit={onMessageSubmit}
                    style={{marginBottom : "40px",}}
                >
                    <div>
                        <TextField
                            name="message"
                            classes={{
                                root : `${classes.inputStyle} ${classes.nameInstall}`
                            }}
                            onChange={e => onTextChange(e)}
                            value={mess.message}
                            id="outlined-multiline-static"
                            variant="outlined"
                            label="Message"
                            disabled={!userName}
                            autoComplete="off"
                        />
                    </div>
                    <Button
                        variant="outlined" 
                        color="primary"
                        type="submit"
                    >
                        Отправить
                    </Button>
                </form>
                
            </div>
        </div>
    )
}

export default withWidth()(ChatPage)