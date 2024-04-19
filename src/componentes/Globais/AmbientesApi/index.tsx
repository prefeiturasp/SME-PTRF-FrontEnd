import React, {useCallback, useEffect, useState} from "react";

export const AmbientesApi: React.FC = () => {

    const url: string = window.location.href
    const prefixo_url: string = url.split('/')[2].split('.', 1)[0]

    const [ambienteApi, setAmbienteApi] = useState<string>('')

    const carregaAmbienteApi = useCallback(()=>{
        let API_URL: string = "API_URL_REPLACE_ME"
        if (process.env.REACT_APP_NODE_ENV === "local"){
            API_URL = process.env.REACT_APP_API_URL || "";
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
