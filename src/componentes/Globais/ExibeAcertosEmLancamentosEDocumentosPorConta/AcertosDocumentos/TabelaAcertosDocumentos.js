import React, {memo, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos } from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {ModalJustificadaApagada} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificadaApagada";
import {ModalJustificarNaoRealizacao} from "../../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao";
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

const TabelaAcertosDocumentos = ({
                                     documentosAjustes,
                                     limparDocumentoStatus,
                                     prestacaoDeContas,
                                     marcarDocumentoComoRealizado,
                                     justificarNaoRealizacaoDocumentos,
                                     rowsPerPageAcertosDocumentos,
                                     setExpandedRowsDocumentos,
                                     expandedRowsDocumentos,
                                     rowExpansionTemplateDocumentos,
                                     documentosSelecionados,
                                     status,
                                     tituloModalCheckNaoPermitido,
                                     textoModalCheckNaoPermitido,
                                     showModalCheckNaoPermitido,
                                     setShowModalCheckNaoPermitido,
                                     selecionarTodosItensDosDocumentos,
                                     totalDeAcertosDosDocumentos,
                                     selecionarTodosItensDoDocumento,
                                     opcoesJustificativa,
                                     limparDocumentos,
                                     analisePermiteEdicao,
}) => {



    const [showModalJustificadaApagada, setShowModalJustificadaApagada] = useState(false)
    const [showModalJustificarNaoRealizacao, setShowModalJustificarNaoRealizacao] = useState(false)
    const [textoConfirmadoJustificado, setTextoConfirmadoJustificado] = useState('')
    const [tipoAcao, setTipoAcao] = useState('')

    let dados_analise_dre_usuario_logado = meapcservice.getAnaliseDreUsuarioLogado()

    const [primeiroRegistroASerExibido, setPrimeiroRegistroASerExibido] = useState(dados_analise_dre_usuario_logado.conferencia_de_documentos.paginacao_atual ? dados_analise_dre_usuario_logado.conferencia_de_documentos.paginacao_atual : 0);

    const tagJustificativa = (rowData) => {
        let status = '-'


        let statusId = rowData.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.status_realizacao.find(justificativa => justificativa.id === statusId)

            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa"
                style={{ backgroundColor: statusId ? tagColors[statusId] : 'none', color: statusId === 'PENDENTE' ? '#000' : '#fff' }}
            >
                {status}
            </div>
        )
    }


    const verificaApagadaJustificada = (tipoAcao) => {
        setShowModalJustificadaApagada(true)
        setTipoAcao(tipoAcao)
    }


    const montagemSelecionarBotaoStatusRealizado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparDocumentos({rowData: null, categoria: null})}
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
                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparDocumentoStatus(documentosSelecionados)}
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

    const montagemSelecionarBotoaoStatusJustificado = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparDocumentos({rowData: null, categoria: null})}
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
                    onClick={() => verificaApagadaJustificada('marcar_como_realizado')}
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
                    onClick={() => verificaApagadaJustificada('limpar_status')}
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

    const montagemSelecionarBotoaoStatusPendente = () => {
        return (
            <>
                <button
                    className="float-right btn btn-link btn-montagem-selecionar"
                    onClick={() => limparDocumentos({rowData: null, categoria: null})}
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
                    onClick={() => marcarDocumentoComoRealizado(documentosSelecionados)}
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
        const quantidadeSelecionada = documentosSelecionados.length

        return (
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "documento selecionado" : "documentos selecionados"} / {totalDeAcertosDosDocumentos} totais
                        </div>
                        <div className="col-7">
                        {status === "REALIZADO" &&
                            montagemSelecionarBotaoStatusRealizado()
                        }
                        {status === "JUSTIFICADO" &&
                            montagemSelecionarBotoaoStatusJustificado()
                        }
                        { status === "PENDENTE" &&
                            montagemSelecionarBotoaoStatusPendente()
                        }
                        </div>
                    </div>
                </div>
            </div>
        )}
    
        const modalBodyHTML = () => {
            return (
                <div className="modal-body">

                    <form>
                        <label htmlFor="justifique-textarea">Você confirma que deseja justificar a não realização do acerto no documento?</label>
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
        if (documentosAjustes.length > 0){
            return (
                <div className="row">
                    <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                        Exibindo <span style={{
                        color: "#00585E",
                        fontWeight: "bold"
                    }}
                    >
                    {totalDeAcertosDosDocumentos}</span> documentos
                    </div>
                </div>
            )
        }
    }

    const onPaginationClick = (event) => {
        setPrimeiroRegistroASerExibido(event.first);
        salvaEstadoPaginacaoDocumentosLocalStorage(event)
    }

    const salvaEstadoPaginacaoDocumentosLocalStorage = (event) => {
        dados_analise_dre_usuario_logado.conferencia_de_documentos.paginacao_atual = event.rows * event.page
        dados_analise_dre_usuario_logado.conferencia_de_documentos.expanded = expandedRowsDocumentos
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), dados_analise_dre_usuario_logado)
    }
    
    return(
        <>
        {documentosSelecionados.length > 0 ?
                montagemSelecionar() :
                mensagemQuantidadeExibida()
        }
        {documentosAjustes && documentosAjustes.length > 0 ? (
            <DataTable
                value={documentosAjustes}
                paginator={documentosAjustes.length > rowsPerPageAcertosDocumentos}
                rows={rowsPerPageAcertosDocumentos}
                expandedRows={expandedRowsDocumentos}
                onRowToggle={(e) => setExpandedRowsDocumentos(e.data)}
                rowExpansionTemplate={rowExpansionTemplateDocumentos}
                paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                stripedRows
                id="tabela-acertos-documentos"

                // Usado para salvar no localStorage a página atual após os calculos ** ver função onPaginationClick
                first={primeiroRegistroASerExibido}
                onPage={onPaginationClick}
            >
                <Column 
                    header='Ver Acertos'
                    expander
                    style={{width: '6%'}}
                />
                <Column 
                    field='tipo_documento_prestacao_conta.nome'
                    header='Nome do Documento'
                    className="align-middle text-left borda-coluna"
                    style={{width: '45%'}}
                />
                <Column 
                        field='status_realizacao'
                        header='Status'
                        className="align-middle text-left borda-coluna"
                        body={tagJustificativa}
                        style={{width: '13%'}}
                />
                {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" && analisePermiteEdicao ?
                <Column
                    header={selecionarTodosItensDosDocumentos()}
                    body={selecionarTodosItensDoDocumento}
                    style={{width: '6%', borderLeft: 'none'}}
                /> : null }
            </DataTable>
            ):
            <p className='text-center fonte-18 mt-4'><strong>Não foram solicitados acertos nos documentos nessa análise da PC.</strong></p>
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
                segundoBotaoOnclick={() => { justificarNaoRealizacaoDocumentos(documentosSelecionados, textoConfirmadoJustificado) }}
                segundoBotaoDisable={textoConfirmadoJustificado.length === 0}
            />
        </section>
        <section>
            <ModalJustificadaApagada
                show={showModalJustificadaApagada}
                titulo='Apagar justificativa(s)'
                texto={'Atenção. Essa ação irá apagar as justificativas digitadas. Confirma ação?'}
                primeiroBotaoTexto="Confirmar"
                primeiroBotaoCss="success"
                primeiroBotaoOnclick={() => tipoAcao === 'limpar_status' ? limparDocumentoStatus(documentosSelecionados) : marcarDocumentoComoRealizado(documentosSelecionados) }
                segundoBotaoTexto="Cancelar"
                segundoBotaoCss="danger"
                handleClose={() => setShowModalJustificadaApagada(false)}

            />
        </section>
        </>
    )
}

export default memo(TabelaAcertosDocumentos)