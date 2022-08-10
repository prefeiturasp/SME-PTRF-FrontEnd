import React, { useState } from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import Dropdown from "react-bootstrap/Dropdown";

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
    'PENDENTE': '#FFF' 
}

export const TabelaAcertosLancamentos = ({lancamentosAjustes, opcoesJustificativa, setExpandedRowsLancamentos, expandedRowsLancamentos, rowExpansionTemplateLancamentos, rowsPerPageAcertosLancamentos, dataTemplate, numeroDocumentoTemplate, valor_template}) => {
    const [lancamentosSelecionados, setLancamentosSelecionados] = useState([])


    const selecionarTemplate = (rowData) => {
        let indexSelecionado = lancamentosSelecionados.findIndex(lanc => lanc.analise_lancamento.id === rowData.analise_lancamento.id)

        return (
            <div className="align-middle text-center">
                <input
                    checked={indexSelecionado >= 0}
                    type="checkbox"
                    onChange={(e) => {
                        if (lancamentosSelecionados.length) {
                            let statusId = lancamentosSelecionados[0].analise_lancamento.status_realizacao
                            if(statusId !== rowData.analise_lancamento.status_realizacao) {
                                e.preventDefault()
                                console.log('aviso de status diferente')
                                return
                            }

                            let lancamentos = [...lancamentosSelecionados]

                            if(indexSelecionado >= 0) {
                                lancamentos.splice(indexSelecionado, 1)
                            } else {
                                lancamentos.push(rowData)
                            }

                            setLancamentosSelecionados(lancamentos)
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
    }

    const limparLancamentos = (event) => {
        setLancamentosSelecionados([])
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

    return(
        <>
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
        </>
    )
}