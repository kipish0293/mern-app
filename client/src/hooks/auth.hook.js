import {useState, useCallback, useEffect} from "react";

const storageName = "userData"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(true)
    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState(null)

    const login = useCallback((jwtToken, id, name) => {
        setToken(jwtToken)
        setUserId(id)
        setUserName(name)

        localStorage.setItem(storageName, JSON.stringify({
            userId : id, token : jwtToken, name : name
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUserName(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(()=> {
        const data = JSON.parse(localStorage.getItem(storageName))
        if(data && data.token) {
            login(data.token, data.userId, data.name)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, userName, ready}
}