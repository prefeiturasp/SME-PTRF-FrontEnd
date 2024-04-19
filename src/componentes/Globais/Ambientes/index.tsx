import React, {useCallback, useEffect, useState} from "react";
import {getAmbientes} from "../../../services/Core.service";


interface Ambiente {
    id: number;
    prefixo: string;
    nome: string;
}

export const Ambientes: React.FC = () => {

    const url: string = window.location.href
    const prefixo_url: string = url.split('/')[2].split('.', 1)[0]

    const [ambiente, setAmbiente] = useState<string>('')

    const carregaAmbiente = useCallback(async () => {
        const ambientes: Ambiente[] = await getAmbientes();
        if (ambientes && ambientes.length > 0) {
            const ambienteEncontrado: Ambiente|undefined = ambientes.find(prefixo => prefixo.prefixo === prefixo_url);
            if (ambienteEncontrado) {
                setAmbiente(ambienteEncontrado.nome);
            } else {
                setAmbiente('Local');
            }
        }
    }, [prefixo_url])

    useEffect(()=>{
        carregaAmbiente().then()
    }, [carregaAmbiente])

    return (
        <span>{`${ambiente}`}</span>
    )
}