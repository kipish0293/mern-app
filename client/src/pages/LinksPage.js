import React, { useCallback, useContext, useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/auth.context";
import { useHttp } from "../hooks/http.hook";
import LinksList from "../components/LinksList"
import axios from "axios";

const LinksPage = () => {
    const [links, setLinks] = useState([])
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)
    const [img, setImg] = useState(null)
    const [avatar, setAvatar] = useState(null)

    const sendFile = useCallback(async () => {
        try {
            const data = new FormData()
            data.append('photo', img)

            axios.post('/api/images/upload', data, {
                headers : {
                    'content-type' : 'multipart/form-data'
                }
            })
                .then(res => setAvatar(res.data.path))
        } catch (error) {
            console.error(error, '123')
        }
    }, [img])

    const fetchLinks = useCallback( async ()=> {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                Authorisation : `Bearer ${token}`
            })
            setLinks(fetched)
        } catch (e) {

        }
    }, [token, request])

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if ( loading ) {
        return <Loader/>
    }

    return (
        <>
            {!loading && <LinksList links={links}/>}
            {
                avatar 
                ? <img src={`${avatar}`} alt="img" />
                : <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/640px-SNice.svg.png" alt="img" />
            }
            <div>
                <input type="file" onChange={e => setImg(e.target.files[0])} />
                <button onClick={sendFile}>Отправить на сервер</button>
            </div>
           
            <div className="div">
                <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis excepturi quo officia neque quis tenetur voluptatibus ducimus necessitatibus corrupti, animi ipsa corporis deserunt similique vero aspernatur ratione deleniti et dolorem. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem alias laboriosam, tempora similique provident itaque dignissimos molestias quibusdam fuga blanditiis dolor ullam aut ea beatae deserunt nihil asperiores. Delectus, neque?
                </p>
            </div>
        </>
    )
}

export default LinksPage