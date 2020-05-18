import React, {useEffect, useState} from "react";
import {PaginasContainer} from "../PaginasContainer";
import {PrestacaoDeContas} from "../../componentes/PrestacaoDeContas";
import "../../componentes/PrestacaoDeContas/prestacao-de-contas.scss"
import "../../componentes/PrestacaoDeContas/InformacoesIniciais"
import {InformacoesIniciais} from "../../componentes/PrestacaoDeContas/InformacoesIniciais";


export const PrestacaoDeContasPage = () => {
    const [reload, setReload] = useState(0)
    useEffect(()=>{
        setReload(1)
    }, []);
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Prestação de contas</h1>
            <InformacoesIniciais/>
            <div className="page-content-inner pt-0">
                <PrestacaoDeContas/>
            </div>
        </PaginasContainer>
    )
}