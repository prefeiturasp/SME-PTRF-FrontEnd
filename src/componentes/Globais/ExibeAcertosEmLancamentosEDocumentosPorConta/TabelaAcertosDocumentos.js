import React, {memo, useState, useMemo} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos } from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {ModalJustificadaApagada} from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificadaApagada";
import {ModalJustificarNaoRealizacao} from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao";
import {visoesService} from "../../../services/visoes.service";
import Dropdown from "react-bootstrap/Dropdown";
import './scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
}

const TabelaAcertosDocumentos = ({documentosAjustes, limparDocumentoStatus, prestacaoDeContas, marcarDocumentoComoRealizado, justificarNaoRealizacaoDocumentos, rowsPerPageAcertosDocumentos, setExpandedRowsDocumentos, opcoesJustificativa, expandedRowsDocumentos, rowExpansionTemplateDocumentos}) => {
    const [documentosSelecionados, setDocumentosSelecionados] = useState([])
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalJustificadaApagada, setShowModalJustificadaApagada] = useState(false)
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [showModalJustificarNaoRealizacao, setShowModalJustificarNaoRealizacao] = useState(false)
    const [textoConfirmadoJustificado, setTextoConfirmadoJustificado] = useState('')
    const [isConfirmadoJustificado, setIsConfirmadoJustificado] = useState(false)
    const [tipoAcao, setTipoAcao] = useState('')
    const [status, setStatus] = useState()

    const selecionarTemplate = (rowData) => {
        let indexSelecionado = documentosSelecionados.findIndex(doc => doc.id === rowData.id)

        return (
            <div className="align-middle text-center">
                <input
                    checked={indexSelecionado >= 0}
                    type="checkbox"
                    onChange={(e) => {
                        if (documentosSelecionados.length) {
                            let statusId = documentosSelecionados[0].status_realizacao
                            setStatus(statusId)
                            if(statusId !== rowData.status_realizacao) {
                                e.preventDefault()
                                setTextoModalCheckNaoPermitido('<p>Esse documento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
                                setShowModalCheckNaoPermitido(true)
                                return
                            }

                            let documentos = [...documentosSelecionados]

                            if(indexSelecionado >= 0) {
                                documentos.splice(indexSelecionado, 1)
                            } else {
                                documentos.push(rowData)
                            }
                            setDocumentosSelecionados(documentos)


                        } else {
                            setDocumentosSelecionados([rowData])
                            setStatus(rowData.status_realizacao)
                        }
                    }}
                    name="checkLancamentoAjuste"
                    id="checkLancamentoAjuste"
                    disabled={false}
                />
            </div>
        )
    }

    const tagJustificativa = (rowData) => {
        let status = '-'


        let statusId = rowData.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.find(justificativa => justificativa.id === statusId)

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

    const selecionarPorStatus = (event, statusId) => {
        event.preventDefault()
        setStatus(statusId)

        let documentos = documentosAjustes.filter(doc =>
            doc.status_realizacao === statusId
        )

        setDocumentosSelecionados(documentos)

    }

    const limparDocumentos = (event) => {
        setDocumentosSelecionados([])
    }


    const verificaApagadaJustificada = (documentosSelecionados, tipoAcao) => {
        setShowModalJustificadaApagada(true)
        setTipoAcao(tipoAcao)
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="p-0">
                        <input
                            checked={documentosSelecionados.length === documentosAjustes.length}
                            type="checkbox"
                            value=""
                            onChange={(e) => e}
                            name="checkHeader"
                            id="checkHeader"
                            disabled={false}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, 'REALIZADO')}>Selecionar todos
                            realizados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, 'JUSTIFICADO')}>Selecionar todos
                            justificados</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => selecionarPorStatus(e, 'PENDENTE')}>Selecionar todos sem status </Dropdown.Item>
                        <Dropdown.Item onClick={limparDocumentos}>Desmarcar todos</Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>
            </div>
        )
    }

    const montagemSelecionar = () => {
        const quantidadeSelecionada = documentosSelecionados.length

        return (
            <div className="row">
                <div className="col-12"
                     style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "documento selecionado" : "documentos selecionados"} / {totalDeAcertosDocumentos} totais
                        </div>
                        <div className="col-7">
                            {status === "REALIZADO" &&
                                <>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => limparDocumentos(e)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
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
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
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
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Limpar Status</strong>
                                    </button>
                                </>
                            }
                            {status === "JUSTIFICADO" &&
                                <>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => limparDocumentos(e)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Cancelar</strong>
                                    </button>
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => verificaApagadaJustificada(documentosSelecionados, 'marcar_como_realizado')}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Marcar como realizado</strong>
                                    </button>
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={() => verificaApagadaJustificada(documentosSelecionados, 'limpar_status')}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Limpar Status</strong>
                                    </button>
                                </>
                            }
                            { status === "PENDENTE" &&
                                <>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => limparDocumentos(e)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Cancelar</strong>
                                    </button>
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => marcarDocumentoComoRealizado(documentosSelecionados)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Marca como realizado</strong>
                                    </button>
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={() => setShowModalJustificarNaoRealizacao(true)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Justificar não realização</strong>
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )}

    const modalBodyHTML = () => {
        return (
            <div className="modal-body">
                <p>Você confirma que deseja marcar o documento como não realizado? Em caso afirmativo será necessário adicionar uma justificativa para tal evento.</p>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="confirmacao-justificativa" id="confirmacao-justificativa1" onChange={() => {setIsConfirmadoJustificado(true)}}/>
                    <label className="form-check-label" htmlFor="confirmacao-justificativa1">
                        Sim
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="confirmacao-justificativa" id="confirmacao-justificativa2" onChange={() => {setIsConfirmadoJustificado(false);}} defaultChecked/>
                    <label className="form-check-label" htmlFor="confirmacao-justificativa2">
                        Não
                    </label>
                </div>
                {isConfirmadoJustificado && (<form>
                    <label htmlFor="justifique-textarea">Justifique</label>
                    <textarea className="form-check form-check-inline w-100 pl-1" style={{'resize': 'none'}} onChange={(e) => setTextoConfirmadoJustificado(e.target.value)} id="justifique-textarea" value={textoConfirmadoJustificado} rows="7"></textarea>
                </form>)
                }
            </div>
        )
    }

    const totalDeAcertosDocumentos = useMemo(() => documentosAjustes.length, [documentosAjustes]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalDeAcertosDocumentos}</span> documentos
                </div>
            </div>
        )
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
                >
                    <Column
                        header='Ver Acertos'
                        expander
                        style={{width: '8%'}}
                    />
                    <Column
                        field='tipo_documento_prestacao_conta.nome'
                        header='Nome do Documento'
                        className="align-middle text-left borda-coluna"
                    />
                    <Column
                        field='status_realizacao'
                        header='Status'
                        className="align-middle text-left borda-coluna"
                        body={tagJustificativa}
                        style={{width: '13%'}}
                    />
                    {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE' && visoesService.getPermissoes(["change_analise_dre"]) && prestacaoDeContas.status === "DEVOLVIDA" ?
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{width: '4%', borderLeft: 'none'}}
                        /> : null }
                </DataTable>
            ): null }
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeLancamentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo='Seleção não permitida'
                    texto={textoModalCheckNaoPermitido}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
            <section>
                <ModalJustificarNaoRealizacao
                    show={showModalJustificarNaoRealizacao}
                    titulo='Marcar como não realizado'
                    bodyText={modalBodyHTML()}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="danger"
                    primeiroBotaoOnClick={() => setShowModalJustificarNaoRealizacao(false)}
                    segundoBotaoTexto="Confirmar"
                    segundoBotaoCss="success"
                    segundoBotaoOnclick={(e) => { justificarNaoRealizacaoDocumentos(documentosSelecionados, textoConfirmadoJustificado) }}
                    segundoBotaoDisable={textoConfirmadoJustificado.length === 0 && isConfirmadoJustificado || !isConfirmadoJustificado}
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