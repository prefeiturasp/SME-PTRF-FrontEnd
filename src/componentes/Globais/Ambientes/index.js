import React, {useCallback, useEffect, useState} from "react";
import {getAmbientes} from "../../../services/Core.service";

export const Ambientes = () =>{
    let url = window.location.href
    let prefixo_url = url.split('/')[2].split('.', 1)[0]

    const [ambiente, setAmbiente] = useState('')

    const carregaAmbiente = useCallback(async ()=>{
        let ambientes = await getAmbientes()
        if (ambientes && ambientes.length > 0){
            let ambiente = ambientes.find(prefixo=> prefixo.prefixo === prefixo_url)
            if (ambiente){
                setAmbiente(ambiente.nome)
            }else {
                setAmbiente('Local')
            }
        }
    }, [prefixo_url])

    useEffect(()=>{
        carregaAmbiente()
    }, [carregaAmbiente])

    return(
        <span>{`${ambiente}`}</span>
    )

}