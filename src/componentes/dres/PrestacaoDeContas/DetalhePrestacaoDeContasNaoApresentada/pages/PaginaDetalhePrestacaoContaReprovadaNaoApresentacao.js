import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {PrestacaoContaReprovadaNaoApresentacaoProvider} from "../context/PrestacaoContaReprovadaNaoApresentacao";
import {useGetPrestacaoContaReprovadaNaoApresentacao} from "../hooks/useGetPrestacaoContaReprovadaNaoApresentacao";
import {useParams} from "react-router-dom";
import Cabecalho from "../../DetalhePrestacaoDeContas/Cabecalho";
import Loading from "../../../../../utils/Loading";
import {BotoesAvancarRetroceder} from "../../DetalhePrestacaoDeContas/BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "../../DetalhePrestacaoDeContas/TrilhaDeStatus";
import ComentariosDeAnalise from "../../DetalhePrestacaoDeContas/ComentariosDeAnalise";
import {RetornaSeTemPermissaoEdicaoAcompanhamentoDePc} from "../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

export const PaginaDetalhePrestacaoContaReprovadaNaoApresentacao = () => {

    let {prestacao_conta_uuid} = useParams();

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()

    const {isLoading, data} = useGetPrestacaoContaReprovadaNaoApresentacao(prestacao_conta_uuid)

    return (
        <PrestacaoContaReprovadaNaoApresentacaoProvider>
            <PaginasContainer>
                <h1 data-qa="titulo-acompanhamento-pcs" className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
                <div className="page-content-inner">
                    {isLoading ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        ):
                        <>
                            <Cabecalho
                                prestacaoDeContas={data}
                            />
                            <BotoesAvancarRetroceder
                                prestacaoDeContas={data}
                                textoBtnAvancar=''
                                textoBtnRetroceder={"Retornar para não apresentada"}
                                metodoAvancar={undefined}
                                metodoRetroceder={undefined}
                                disabledBtnAvancar={true}
                                disabledBtnRetroceder={true}
                                esconderBotaoAvancar={true}
                            />
                            <TrilhaDeStatus
                                prestacaoDeContas={data}
                            />
                            <ComentariosDeAnalise
                                associacaoUuid={data.associacao.uuid}
                                periodoUuid={data.periodo.uuid}
                                editavel={TEMPERMISSAO}
                            />
                        </>
                    }
                </div>
            </PaginasContainer>
        </PrestacaoContaReprovadaNaoApresentacaoProvider>
    )
}