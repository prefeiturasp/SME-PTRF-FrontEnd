import React, {useCallback, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {
    ModalCheckNaoPermitidoConfererenciaDeLancamentos,
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {
    ModalJustificarNaoRealizacao
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao";
import {
    ModalJustificadaApagada
} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificadaApagada";
import {visoesService} from "../../../../services/visoes.service";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../services/mantemEstadoAnaliseDre.service";
import '../scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'REALIZADO': '#198459',
    'JUSTIFICADO': '#5C4EF8',
    'REALIZADO_JUSTIFICADO': '#C65D00',
    'REALIZADO_PARCIALMENTE': '#C65D00',
    'REALIZADO_JUSTIFICADO_PARCIALMENTE': '#C65D00',
}

export const TabelaAcertosLancamentos = ({
                                             lancamentosAjustes,
                                             limparStatus,
                                             marcarComoRealizado,
                                             prestacaoDeContas,
                                             justificarNaoRealizacao,
                                             opcoesJustificativa,
                                             setExpandedRowsLancamentos,
                                             expandedRowsLancamentos,
                                             rowExpansionTemplateLancamentos,
                                             rowsPerPageAcertosLancamentos,
                                             dataTemplate,
                                             numeroDocumentoTemplate,
                                             valor_template,
                                             selecionarTodosItensDosLancamentosGlobal,
                                             selecionarTodosItensDoLancamentoRow,
                                             tituloModalCheckNaoPermitido,
                                             textoModalCheckNaoPermitido,
                                             showModalCheckNaoPermitido,
                                             setShowModalCheckNaoPermitido,
                                             totalDeAcertosDosLancamentos,
                                             analisePermiteEdicao,
                                             quantidadeSelecionada,
                                             acoesDisponiveis,
                                             acaoCancelar
                                         }) => {


    const [showModalJustificarNaoRealizacao, setShowModalJustificarNaoRealizacao] = useState(false)
    const [showModalJustificadaApagada, setShowModalJustificadaApagada] = useState(false)
    const [textoConfirmadoJustificado, setTextoConfirmadoJustificado] = useState('')

    const [tipoAcao, setTipoAcao] = useState('')

    let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()

    // Paginação
    const [primeiroRegistroASerExibido, setPrimeiroRegistroASerExibido] = useState(dados_analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual ? dados_analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual : 0);

    const tagJustificativa = (rowData) => {
        let status = '-'

        let statusId = rowData.analise_lancamento.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.status_realizacao.find(justificativa => justificativa.id === statusId)

            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa"
                 style={{
                     backgroundColor: statusId ? tagColors[statusId] : 'none',
                     color: statusId === 'PENDENTE' ? '#000' : '#fff'
                 }}
            >
                {status}
            </div>
        )
    }

    const montagemSelecionarBotaoStatusJustificadoEhRealizado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparStatus()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotaoStatusRealizadoEhPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparStatus()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>

                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => {
                        setShowModalJustificarNaoRealizacao(true)
                    }}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Justificar não realização</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotaoStatusJustificadoEhRealizadoEhPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparStatus()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotoaoStatusJustificadoEhPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'limpar_status')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>
                
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'marcar_como_realizado')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Marcar como realizado</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotaoStatusRealizado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>

                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparStatus()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => {
                        setShowModalJustificarNaoRealizacao(true)
                    }}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Justificar não realização</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotoaoStatusJustificado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>

                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'limpar_status')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Limpar Status</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>

                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => verificaApagadaJustificada( 'marcar_como_realizado')}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Marcar como realizado</strong>
                </button>
            </>
        )
    }

    const montagemSelecionarBotoaoStatusPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => acaoCancelar()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Cancelar</strong>
                </button>

                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => marcarComoRealizado()}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Marcar como realizado</strong>
                </button>
                
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => setShowModalJustificarNaoRealizacao(true)}
                    style={{textDecoration: "underline", cursor: "pointer"}}
                >
                    <FontAwesomeIcon
                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                        icon={faCheckCircle}
                    />
                    <strong>Justificar não realização</strong>
                </button>
            </>
        )
    }

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalDeAcertosDosLancamentos} totais
                        </div>

                        <div className="col-7">
                            {acoesDisponiveis().JUSTIFICADO_E_REALIZADO &&
                                montagemSelecionarBotaoStatusJustificadoEhRealizado()
                            }

                            {acoesDisponiveis().REALIZADO_E_PENDENTE &&
                                montagemSelecionarBotaoStatusRealizadoEhPendente()
                            }

                            {acoesDisponiveis().JUSTIFICADO_E_REALIZADO_E_PENDENTE &&
                                montagemSelecionarBotaoStatusJustificadoEhRealizadoEhPendente()
                            }

                            {acoesDisponiveis().JUSTIFICADO_E_PENDENTE &&
                                montagemSelecionarBotoaoStatusJustificadoEhPendente()
                            }

                            {acoesDisponiveis().REALIZADO &&
                                montagemSelecionarBotaoStatusRealizado()
                            }

                            {acoesDisponiveis().JUSTIFICADO &&
                                montagemSelecionarBotoaoStatusJustificado()
                            }

                            {acoesDisponiveis().PENDENTE &&
                                montagemSelecionarBotoaoStatusPendente()
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalBodyHTML = () => {
        return (
            <div className="modal-body">

                <form>
                    <label htmlFor="justifique-textarea">Justifique abaixo a não realização do acerto no lançamento.</label>
                    <textarea
                        className="form-check form-check-inline w-100 pl-1"
                        style={{'resize': 'none'}}
                        onChange={(e) => setTextoConfirmadoJustificado(e.target.value)}
                        id="justifique-textarea"
                        value={textoConfirmadoJustificado}
                        rows="7"
                    >
                    </textarea>
                </form>

            </div>
        )
    }

    const mensagemQuantidadeExibida = () => {
        if (lancamentosAjustes.length > 0){
            return (
                <div className="row">
                    <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                        Exibindo <span style={{color: "#00585E", fontWeight: "bold"}}>{totalDeAcertosDosLancamentos}</span> lançamentos
                    </div>
                </div>
            )
        }

    }

    // Dispara modal de Confirmação
    const verificaApagadaJustificada = (tipoAcao) => {
        setShowModalJustificadaApagada(true)
        setTipoAcao(tipoAcao)
    }

    const onPaginationClick = (event) => {
        setPrimeiroRegistroASerExibido(event.first);
        salvaEstadoPaginacaoLancamentosLocalStorage(event)
    }

    const salvaEstadoPaginacaoLancamentosLocalStorage = (event) => {
        dados_analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual = event.rows * event.page
        dados_analise_dre_usuario_logado.conferencia_de_lancamentos.expanded = expandedRowsLancamentos
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
    }

    return (
        <>
            {quantidadeSelecionada > 0 
                ?
                    montagemSelecionar() 
                :
                    mensagemQuantidadeExibida()
            }
            
            {lancamentosAjustes && lancamentosAjustes.length > 0 ? (
                    <DataTable
                        value={lancamentosAjustes}
                        expandedRows={expandedRowsLancamentos}
                        onRowToggle={(e) => setExpandedRowsLancamentos(e.data)}
                        rowExpansionTemplate={rowExpansionTemplateLancamentos}
                        paginator={lancamentosAjustes.length > rowsPerPageAcertosLancamentos}
                        rows={rowsPerPageAcertosLancamentos}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        stripedRows
                        autoLayout={true}
                        id='tabela-acertos-lancamentos'

                        // Usado para salvar no localStorage a página atual após os calculos ** ver função onPaginationClick
                        first={primeiroRegistroASerExibido}
                        onPage={onPaginationClick}
                    >
                        <Column
                            header='Ver Acertos'
                            expander
                            style={{width: '6%'}}/>
                        <Column
                            field='data'
                            header='Data'
                            body={dataTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '6%'}}
                        />
                        <Column field='tipo_transacao' header='Tipo de lançamento' style={{width: '10%'}}
                                className="align-middle text-left borda-coluna"/>
                        <Column
                            field='numero_documento'
                            header='N.º do documento'
                            body={numeroDocumentoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '12%'}}
                        />
                        <Column field='descricao' header='Descrição' style={{width: '40%'}}
                                className="align-middle text-left borda-coluna"/>
                        <Column
                            field='valor_transacao_total'
                            header='Valor (R$)'
                            body={valor_template}
                            className="align-middle text-left borda-coluna"
                            style={{width: '8%'}}
                        />
                        <Column
                            field='status_realizacao'
                            header='Status'
                            className="align-middle text-left borda-coluna"
                            body={tagJustificativa}
                            style={{width: '10%'}}/>
                        {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao ?
                            <Column
                                header={selecionarTodosItensDosLancamentosGlobal()}
                                body={selecionarTodosItensDoLancamentoRow}
                                style={{width: '4%', borderLeft: 'none'}}
                            /> : null
                        }
                    </DataTable>
                ) :
                <p className='text-center fonte-18 mt-4'><strong>Não foram solicitados acertos nos lançamentos nessa análise da PC.</strong></p>
            }
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeLancamentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo={tituloModalCheckNaoPermitido}
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
            <section>
                <ModalJustificarNaoRealizacao
                    show={showModalJustificarNaoRealizacao}
                    titulo='Justificar não realização'
                    bodyText={modalBodyHTML()}
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="danger"
                    primeiroBotaoOnClick={() => setShowModalJustificarNaoRealizacao(false)}
                    segundoBotaoTexto="Confirmar"
                    segundoBotaoCss="success"
                    segundoBotaoOnclick={() => {
                        justificarNaoRealizacao(textoConfirmadoJustificado)
                    }}
                    segundoBotaoDisable={ textoConfirmadoJustificado.length === 0}
                />
            </section>
            <section>
                <ModalJustificadaApagada
                    show={showModalJustificadaApagada}
                    titulo='Apagar justificativa(s)'
                    texto={'Atenção. Essa ação irá apagar as justificativas digitadas. Confirma ação?'}
                    primeiroBotaoTexto="Confirmar"
                    primeiroBotaoCss="success"
                    primeiroBotaoOnclick={() => tipoAcao === 'limpar_status' ? limparStatus() : marcarComoRealizado()}
                    segundoBotaoTexto="Cancelar"
                    segundoBotaoCss="danger"
                    handleClose={() => setShowModalJustificadaApagada(false)}
                />
            </section>
        </>
    )
}