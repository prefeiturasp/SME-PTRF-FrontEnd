import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {PrestacaoDeContas} from "../../componentes/PrestacaoDeContas";
import "../../componentes/PrestacaoDeContas/prestacao-de-contas.scss"


export const PrestacaoDeContasPage = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Prestação de contas</h1>
            <div className="col-12 container-texto-introdutorio">
                <p>Fique de olho
                    Antes de fazer a prestação de contas será necessário seguir alguns passos:
                </p>
            </div>
            <div className="page-content-inner">
                <PrestacaoDeContas/>
            </div>
        </PaginasContainer>
    )
}