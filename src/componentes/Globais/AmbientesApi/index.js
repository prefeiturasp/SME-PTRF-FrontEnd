import React, {useCallback, useEffect, useState} from "react";

export const AmbientesApi = () =>{

    let url = window.location.href
    let prefixo_url = url.split('/')[2].split('.', 1)[0]

    const [ambienteApi, setAmbienteApi] = useState('')

    const carregaAmbienteApi = useCallback( ()=>{
        let API_URL = "API_URL_REPLACE_ME";

        if (process.env.REACT_APP_NODE_ENV === "local") {
            API_URL = process.env.REACT_APP_API_URL;
        }

        if (API_URL.split('/')[2].split('.', 1)[0] !== prefixo_url){
            setAmbienteApi(API_URL.split('/')[2].split('.', 1)[0])
        }
    }, [prefixo_url])

    useEffect(()=>{
        carregaAmbienteApi()
    }, [carregaAmbienteApi])

    return(
        <>
            {ambienteApi &&
                <span>{`API: ${ambienteApi}`}</span>
            }
        </>

    )
}