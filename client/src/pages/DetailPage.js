import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AuthContext } from "../context/auth.context";
import { useHttp } from "../hooks/http.hook";
import { LinkCard } from "../components/LinkCard";

const DetailPage = () => {
    const {token} = useContext(AuthContext)
    const [link,setLink] = useState(null)
    const linkId = useParams().id
    const {request, loading} = useHttp()
    const getLink = useCallback(async ()=> {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null , {
                Authorisation : `Bearer ${token}`
            })
            setLink(fetched)
        } catch (e) {

        }
    }, [token, linkId, request])

    useEffect(()=> {
        getLink()
    }, [getLink])

    if(loading) {
        return <Loader/>
    }

    return (
        <>
            { !loading && link && <LinkCard link={link}/>}
        </>
    )
}

export default DetailPage;