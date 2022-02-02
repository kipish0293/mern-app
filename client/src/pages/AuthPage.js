import React, { useContext, useEffect, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/auth.context";

const AuthPage = () => {
    const auth = useContext(AuthContext) 

    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState({
        email : "",
        password : ""
    })

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {

        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            // console.log(data)
            auth.login(data.token, data.userId, data.userName)
        } catch (e) {

        }
    }

    useEffect(()=> {
        message(error)
        clearError()
    },[error, message, clearError])

    useEffect(()=> {
        window.M.updateTextFields()
    }, [])

    return (
        <>
            <div className="row" style={{marginTop : "10%"}}>
                <div className="col s12 m6 offset-s0 offset-m3">
                    <h2
                        style={{textAlign : "center"}}
                    >Family app</h2>
                    <div className="card blue darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Авторизация</span>
                            <div>
                                <div className="input-field">
                                    <input 
                                        type="text" 
                                        id="email" 
                                        placeholder="email"
                                        name="email"
                                        value={form.email}
                                        onChange={changeHandler}
                                    />
                                </div>
                                <div className="input-field">
                                    <input 
                                        type="password" 
                                        id="passord" 
                                        placeholder="Введите пароль"
                                        name="password"
                                        value={form.password}
                                        onChange={changeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-action">
                            <button 
                                className="btn yellow darken-4" 
                                style={{marginRight : "10px"}}
                                onClick={loginHandler}
                                disabled={loading}
                            >
                                Войти
                            </button>
                            <button 
                                className="btn grey lighten-1 black-text"
                                style={{marginRight : 10}}
                                onClick={registerHandler}
                                disabled={loading}
                            >
                                Регистрация
                            </button>

                            {/* <button 
                                className="btn grey lighten-1 black-text"
                                onClick={getDataFromServer}
                                disabled={loading}
                            >
                                Получить данные
                            </button> */}
                        </div>
                    </div>
                </div> 
            </div>
        </>
    )
}

export default AuthPage