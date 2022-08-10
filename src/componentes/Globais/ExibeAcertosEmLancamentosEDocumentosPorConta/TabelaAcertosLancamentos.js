import React, { useMemo, useState } from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos} from "../../dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import Dropdown from "react-bootstrap/Dropdown";

import './scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
    'PENDENTE': '#FFF' 
}

export const TabelaAcertosLancamentos = ({lancamentosAjustes, opcoesJustificativa, setExpandedRowsLancamentos, expandedRowsLancamentos, rowExpansionTemplateLancamentos, rowsPerPageAcertosLancamentos, dataTemplate, numeroDocumentoTemplate, valor_template}) => {
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([])
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)


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

    const tagJustificativa = (rowData) => {        
        let status = '-'

        let statusId = rowData.analise_lancamento.status_realizacao

        if (statusId && statusId !== 'PENDENTE') {
            let nomeStatus = opcoesJustificativa.find(justificativa => justificativa.id === statusId)
    
            status = nomeStatus?.nome ?? '-'
        }

        return (
            <div className="tag-justificativa" 
                style={{ backgroundColor: statusId ? tagColors[statusId] : '#fff' }}
            >
                {status}
            </div>
        )
    }

    const selecionarPorStatus = (event, statusId) => {
        event.preventDefault()

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
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, 'JUSTIFICADO')}>Selecionar todos não
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
                    </div>
                <div className="col-7">
                    <div className="row">
                        <div className="col-12">
                                <button className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={(e) => limparLancamentos(e)}
                                    style={{textDecoration: "underline", cursor: "pointer"}}>
                                <strong>Cancelar</strong>
                            </button>
                            <>
                                <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                <button
                                    className="float-right btn btn-link btn-montagem-selecionar"
                                    onClick={() => marcarComoCorreto()}
                                    style={{textDecoration: "underline", cursor: "pointer"}}>
                                    <FontAwesomeIcon
                                        style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                        icon={faCheckCircle}
                                    />
                                    <strong>Marcar como Correto</strong>
                                </button>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}
        //                 <div className="col-7">
        //                     <div className="row">
        //                         <div className="col-12">
        //                             <button className="float-right btn btn-link btn-montagem-selecionar"
        //                                     onClick={(e) => limparLancamentos(e)}
        //                                     style={{textDecoration: "underline", cursor: "pointer"}}>
        //                                 <strong>Cancelar</strong>
        //                             </button>
        //                             {exibirBtnMarcarComoCorreto &&
        //                             <>
        //                                 <div className="float-right" style={{padding: "0px 10px"}}>|</div>
        //                                 <button
        //                                     className="float-right btn btn-link btn-montagem-selecionar"
        //                                     onClick={() => marcarComoCorreto()}
        //                                     style={{textDecoration: "underline", cursor: "pointer"}}
        //                                 >
        //                                     <FontAwesomeIcon
        //                                         style={{color: "white", fontSize: '15px', marginRight: "3px"}}
        //                                         icon={faCheckCircle}
        //                                     />
        //                                     <strong>Marcar como Correto</strong>
        //                                 </button>
        //                             </>
        //                             }
        //                             {exibirBtnMarcarComoNaoConferido &&
        //                             <>
        //                                 <div className="float-right" style={{padding: "0px 10px"}}>|</div>
        //                                 <button
        //                                     className="float-right btn btn-link btn-montagem-selecionar"
        //                                     onClick={() => marcarComoNaoConferido()}
        //                                     style={{textDecoration: "underline", cursor: "pointer"}}
        //                                 >
        //                                     <FontAwesomeIcon
        //                                         style={{color: "white", fontSize: '15px', marginRight: "3px"}}
        //                                         icon={faCheckCircle}
        //                                     />
        //                                     <strong>Marcar como Não conferido</strong>
        //                                 </button>
        //                             </>
        //                             }
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // )
    // }

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
    
    const marcarComoCorreto = async () => {
        // let documentos_marcados_como_corretos = getDocumentosSelecionados()
        // if (documentos_marcados_como_corretos && documentos_marcados_como_corretos.length > 0) {
        //     let payload = [];
        //     documentos_marcados_como_corretos.map((documento) =>
        //         payload.push({
        //             "tipo_documento": documento.tipo_documento_prestacao_conta.uuid,
        //             "conta_associacao": documento.tipo_documento_prestacao_conta.conta_associacao,
        //         })
        //     );
        //     payload = {
        //         'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
        //         'documentos_corretos': [
        //             ...payload
        //         ]
        //     }
        //     try {
        //         await postDocumentosParaConferenciaMarcarComoCorreto(prestacaoDeContas.uuid, payload)
        //         console.log("Documentos marcados como correto com sucesso!")
        //         desmarcarTodos()
        //         await carregaListaDeDocumentosParaConferencia()
        //     } catch (e) {
        //         console.log("Erro ao marcar documentos como correto ", e.response)
        //     }
        // }
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
        </>
    )
}