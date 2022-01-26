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

    useEffect(()=> {
        message(error)
        clearError()
    },[error, message, clearError])

    useEffect(()=> {
        window.M.updateTextFields()
    }, [])

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
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    const getDataFromServer = async () => {
        try {
            const data = await request('/api/auth/get-data', 'GET')
            message(data.message)
        } catch(e) {
            
        }
    }

    const getDataFromServer2 = async () => {
        try {
            const data = await request('/api/auth/test', 'GET')
            message(data.message)
        } catch(e) {
            throw Error('Что-то не так 2')
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Сократи ссылку</h1>
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

                        <button 
                            className="btn grey lighten-1 black-text"
                            onClick={getDataFromServer}
                            disabled={loading}
                        >
                            Получить данные
                        </button>
                        <button 
                            className="btn grey lighten-1 black-text"
                            onClick={getDataFromServer2}
                            disabled={loading}
                        >
                            Получить данные 2
                        </button>
                    </div>

                </div>
            </div>   
        </div>
    )
}

export default AuthPage