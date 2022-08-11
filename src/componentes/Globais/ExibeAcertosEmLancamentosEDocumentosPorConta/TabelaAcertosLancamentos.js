import React, { useMemo, useState } from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos,} from "../../dres/PrestacaoDeContas//DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {ModalJustificarNaoRealizacao} from "../../dres/PrestacaoDeContas//DetalhePrestacaoDeContas/ConferenciaDeLancamentos/Modais/ModalJustificarNaoRealizacao";
import Dropdown from "react-bootstrap/Dropdown";

import './scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
    'PENDENTE': '#FFF' 
}

export const TabelaAcertosLancamentos = ({lancamentosAjustes, limparStatus, justificarNaoRealizacao, opcoesJustificativa, setExpandedRowsLancamentos, expandedRowsLancamentos, rowExpansionTemplateLancamentos, rowsPerPageAcertosLancamentos, dataTemplate, numeroDocumentoTemplate, valor_template}) => {
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([])
    const [exibirBtnJustificado, setExibirBtnJustificado] = useState(false)
    const [exibirBtnRealizado, setExibirBtnRealizado] = useState(false)
    const [exibirBtnSemStatus, setExibirBtnSemStatus] = useState(false)
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [showModalJustificarNaoRealizacao, setShowModalJustificarNaoRealizacao] = useState(false)


    const selecionarTemplate = (rowData) => {
        let indexSelecionado = lancamentosSelecionados.findIndex(lanc => lanc.analise_lancamento.id === rowData.analise_lancamento.id)

        return (
            <div className="align-middle text-center">
                <input
                    checked={indexSelecionado >= 0}
                    type="checkbox"
                    onChange={(e) => {
                        setQuantidadeSelecionada(lancamentosSelecionados.length + 1)
                        if (lancamentosSelecionados.length) {
                            let statusId = lancamentosSelecionados[0].analise_lancamento.status_realizacao
                            verificarStatus(statusId)
                            if(statusId !== rowData.analise_lancamento.status_realizacao) {
                                e.preventDefault()
                                setTextoModalCheckNaoPermitido('<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
                                setShowModalCheckNaoPermitido(true)
                                return
                            }

                            let lancamentos = [...lancamentosSelecionados]

                            if(indexSelecionado >= 0) {
                                lancamentos.splice(indexSelecionado, 1)
                            } else {
                                lancamentos.push(rowData)
                            }
                            setLancamentosSelecionados(lancamentos)
                            setQuantidadeSelecionada(lancamentos.length)

                        } else {
                            setLancamentosSelecionados([rowData])
                        }
                    }}
                    name="checkLancamentoAjuste"
                    id="checkLancamentoAjuste"
                    disabled={false}
                />
            </div>
        )
    }

    const verificarStatus = (statusId) => {
        if(statusId === 'REALIZADO') {
            setExibirBtnRealizado(true)
            setExibirBtnSemStatus(false)
            setExibirBtnJustificado(false)
        }
        else if(statusId === 'JUSTIFICADO') {
            setExibirBtnJustificado(true)
            setExibirBtnRealizado(false)
            setExibirBtnSemStatus(false)
        }
        else if(statusId === 'PENDENTE') {
            setExibirBtnSemStatus(true)
            setExibirBtnJustificado(false)
            setExibirBtnRealizado(false)
        }
    }

    const tagJustificativa = (rowData) => {        
        let status = '-'

        let statusId = rowData.analise_lancamento.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.find(justificativa => justificativa.id === statusId)
    
            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa" 
                style={{ backgroundColor: statusId ? tagColors[statusId] : '#fff', color: statusId === 'PENDENTE' ? '#000' : '#fff' }}
            >
                {status}
            </div>
        )
    }

    const selecionarPorStatus = (event, statusId) => {
        event.preventDefault()
        verificarStatus(statusId)

        let lancamentos = lancamentosAjustes.filter(lanc => 
            lanc.analise_lancamento.status_realizacao === statusId
        )

        setLancamentosSelecionados(lancamentos)
        setQuantidadeSelecionada(lancamentos.length)
    }

    const limparLancamentos = (event) => {
        setLancamentosSelecionados([])
        setQuantidadeSelecionada(0)
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="p-0">
                            <input
                                checked={lancamentosSelecionados.length === lancamentosAjustes.length}
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
                            <Dropdown.Item onClick={limparLancamentos}>Desmarcar todos</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
            </div>
        )
    }

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12"
                     style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalDeAcertosLancamentos} totais
                        </div>
                        <div className="col-7">
                        {exibirBtnRealizado &&
                                <>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={() => {}}
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
                                        onClick={(e) => {
                                            setShowModalJustificarNaoRealizacao(true)
                                            // justificarNaoRealizacao(lancamentosSelecionados)
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
                                        onClick={() => limparStatus(lancamentosSelecionados)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Limpar Status</strong>
                                    </button>
                                </>
                                }
                        {exibirBtnJustificado &&
                                <>
                                 <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={(e) => limparLancamentos(e)}
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
                                        onClick={(e) => e}
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
                                        onClick={() => limparStatus(lancamentosSelecionados)}
                                        style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faCheckCircle}
                                        />
                                        <strong>Limpar Status</strong>
                                    </button>
                                </>
                                }
                        {exibirBtnSemStatus &&
                                <>
                                <button
                                       className="float-right btn btn-link btn-montagem-selecionar"
                                       onClick={(e) => limparLancamentos(e)}
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
                                       onClick={(e) => e}
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
                                       onClick={(e) => e}
                                       style={{textDecoration: "underline", cursor: "pointer"}}>
                                       <FontAwesomeIcon
                                           style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                           icon={faCheckCircle}
                                       />
                                       <strong>Justificar não realizado</strong>
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
                <form>
                    <div className='row'>
                        <div className="col-12 mt-2">
                            <p>Motivos para a existência do estorno</p>
                            <label htmlFor="ressalvas">Motivo(s)</label>
                            <br/>
                            <div className="multiselect-demo">
                                <div className="">
                                    <p>TEXTE</p>
                                </div>
                            </div>
                        </div>
    
                        <div className='col-12'>
                            <div className="d-flex  justify-content-end pb-3 mt-3">
                                <button onClick={() => {}} type="reset"
                                        className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                </button>
                                <button
                                    onClick={() => {}}
                                    type="button"
                                    className="btn btn-success mt-2"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
    
                    </div>
                </form>
            )
        }


    const totalDeAcertosLancamentos = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding: "15px 0px", margin: "0px 15px", flex: "100%"}}>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalDeAcertosLancamentos}</span> lançamentos
                </div>
            </div>
        )
    }

    return(
        <>
            {quantidadeSelecionada > 0 ?
                montagemSelecionar() :
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
                    />
                    <Column field='tipo_transacao' header='Tipo de lançamento' className="align-middle text-left borda-coluna"/>
                    <Column
                        field='numero_documento'
                        header='N.º do documento'
                        body={numeroDocumentoTemplate}
                        className="align-middle text-left borda-coluna"
                    />
                    <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"/>
                    <Column
                        field='valor_transacao_total'
                        header='Valor (R$)'
                        body={valor_template}
                        className="align-middle text-left borda-coluna"
                    />
                    <Column 
                        field='status_realizacao'
                        header='Status'
                        className="align-middle text-left borda-coluna"
                        body={tagJustificativa}
                        style={{width: '12%'}}/>
                    <Column
                        header={selecionarHeader()}
                        body={selecionarTemplate}
                        style={{width: '3rem', borderLeft: 'none'}}
                    />
                </DataTable>
                
                
            ):
                <p className='text-center fonte-18 mt-4'><strong>Não existem ajustes para serem exibidos</strong></p>
            }
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
                    handleClose={() => setShowModalJustificarNaoRealizacao(false)}
                    titulo='Marcar como não realizado'
                    bodyText={modalBodyHTML}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
        </>
    )
}