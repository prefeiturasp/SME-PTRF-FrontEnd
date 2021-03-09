import React, {useCallback, useEffect, useState} from "react";
import { getVersaoApi} from '../../../services/Core.service'

export const Versao = () =>{

    const [versaoApi, setVersaoApi] = useState('')
    const [versaoFront, setVersaoFront] = useState('')

    const carregaVersao = useCallback(async ()=>{
        let versaoApi = await getVersaoApi()
        const pjson = require('../../../../package.json')
        let versaoFront = pjson.version
        setVersaoApi(versaoApi)
        setVersaoFront(versaoFront)
    }, []);

    useEffect(()=>{
        carregaVersao()
    }, [carregaVersao])

    return(
        <>
            <span>{`${versaoFront} (API:${versaoApi})`}</span>
        </>
    )
};