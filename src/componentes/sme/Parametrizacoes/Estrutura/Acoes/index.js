import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import '../parametrizacoes-estrutura.scss'
import Loading from "../../../../../utils/Loading";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { AcoesContextProvider } from "./context/AcoesContext";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Filtros } from "./components/Filtros";
import { TabelaAcoes } from "./components/TabelaAcoes";
import { ModalFormAcoes } from "./components/ModalFormAcoes";
import { ModalConfirmDeleteAcao } from "./components/ModalConfirmDeleteAcao";
import { useAcoesContext } from "./hooks/useAcoesContext";

const AcoesContent = () => {
    const { isLoading, results } = useAcoesContext();

    return (
        <>
            <h1 className="titulo-itens-painel mt-5">Ações</h1>
            <div className="page-content-inner">
                <AbasPorRecurso />

                {isLoading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) : (
                    <>
                        <TopoComBotoes />
                        
                        <Filtros />
                        
                        {(results || []).length ? (
                            <>
                                <TabelaAcoes />
                            </>
                        ) : (
                            <MsgImgCentralizada
                                data-qa="imagem-lista-sem-acoes"
                                texto="Nenhum resultado encontrado."
                                img={Img404}
                            />
                        )}
                    </>
                )}

                <section>
                    <ModalFormAcoes />
                </section>
                <section>
                    <ModalConfirmDeleteAcao />
                </section>
            </div>
        </>
    );
};

export const Acoes = () => {
    return (
        <PaginasContainer>
            <AcoesContextProvider>
                <AcoesContent />
            </AcoesContextProvider>
        </PaginasContainer>
    );
};