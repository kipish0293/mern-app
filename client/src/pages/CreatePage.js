import React , {useState, useEffect, useContext} from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useHttp } from "../hooks/http.hook";

const CreatePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('')
    const {request} = useHttp()

    useEffect(()=> {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async (event) => {
        if (event.key === "Enter") {
            try {
                const data = await request('/api/link/generate', 'POST', {from:link}, {
                    Authorisation : `Bearer ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (e) {

            }
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop : "2rem"}}>
                <div className="input-field">
                    <input 
                        type="text" 
                        id="link" 
                        autoComplete="off"
                        placeholder="Вставьте ссылку"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
}

export default CreatePage;