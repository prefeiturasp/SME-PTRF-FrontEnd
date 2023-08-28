import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {RetornaSeTemPermissaoEdicaoAcompanhamentoDePc} from "../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";
import AssociacaoEPeriodoDoCabecalho from "../AssociacaoEPeriodoDoCabecalho";

export const TopoComBotoes = ({onClickBtnVoltar, setShowModalConfirmaDevolverParaAcerto, dataLimiteDevolucao, qtdeAjustesLancamentos, qtdeAjustesDocumentos, qtdeAjustesExtrato, btnDevolverParaAcertoDisabled, editavel, prestacaoDeContas}) => {

    const TEMPERMISSAOEDICAOACOMPANHAMENTOPC = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()

    return(
        <>
        <div className="d-flex bd-highlight mt-3 mb-0 container-cabecalho">
            <AssociacaoEPeriodoDoCabecalho prestacaoDeContas={prestacaoDeContas} />
            <div className="ml-auto p-2 bd-highlight">
                <button onClick={onClickBtnVoltar} className="btn btn-outline-success mr-2" style={{ whiteSpace: 'nowrap' }}>
                    <FontAwesomeIcon
                        style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
            </div>
            <div className="p-2 bd-highlight">
                <button
                    disabled={!TEMPERMISSAOEDICAOACOMPANHAMENTOPC || !dataLimiteDevolucao || (qtdeAjustesLancamentos <= 0 && qtdeAjustesDocumentos <= 0 && qtdeAjustesExtrato <= 0) || btnDevolverParaAcertoDisabled || !editavel}
                    onClick={()=>setShowModalConfirmaDevolverParaAcerto(true)}
                    className="btn btn-secondary"
                >
                    Devolver para Associação
                </button>
            </div>
        </div>
        <div className="py-2 mb-3 flex-grow-1 bd-highlight">
            <h5 className="titulo-itens-painel mb-0">Resumo de acertos</h5>
        </div>
        </>
    )
}