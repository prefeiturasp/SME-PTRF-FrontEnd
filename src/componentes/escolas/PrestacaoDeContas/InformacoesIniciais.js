import React, {useState, useEffect} from "react";
import {
    getFiqueDeOlho,
} from "../../../services/escolas/PrestacaoDeContas.service";

export const InformacoesIniciais = () => {
    const [fique_de_olho, setFiqueDeOlho] = useState("");

    useEffect(() => {
        buscaFiqueDeOlho();
    }, [])

    const buscaFiqueDeOlho = async () => {
        await getFiqueDeOlho().then((response) => {
            setFiqueDeOlho(response.detail);
        }).catch((error) => {
            console.log(error);
        })
    }

    return(
        <div className="col-12 container-texto-introdutorio mb-4">
            <div dangerouslySetInnerHTML={{ __html: fique_de_olho }} />
        </div>
    )
}