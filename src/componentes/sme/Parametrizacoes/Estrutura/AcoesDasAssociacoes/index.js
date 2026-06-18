import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import '../parametrizacoes-estrutura.scss'
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {Filtros} from "./Filtros";
import {BtnAddAcoes} from "./BtnAddAcoes";
import {TabelaAcoesDasAssociacoes} from "./TabelaAcoesDasAssociacoes";
import {ModalFormAcoesDaAssociacao} from "./ModalFormAcoesDasAssociacoes";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { AcoesDasAssociacoesContextProvider } from "./context/AcoesDasAssociacoesContext";

export const AcoesDasAssociacoes = () => {
    return (
        <PaginasContainer>
            <AcoesDasAssociacoesContextProvider>
                <h1 className="titulo-itens-painel mt-5">Ações das Associações</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso 
                        extra_abas={UrlsMenuInterno}
                    />

                    <BtnAddAcoes />
                    
                    <Filtros />
                    
                    <TabelaAcoesDasAssociacoes />

                    <ModalFormAcoesDaAssociacao />
                </div>
            </AcoesDasAssociacoesContextProvider>
        </PaginasContainer>
    )
};