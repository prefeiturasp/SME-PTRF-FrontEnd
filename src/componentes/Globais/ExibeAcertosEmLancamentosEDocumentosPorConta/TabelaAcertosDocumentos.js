import React, {memo, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import Dropdown from "react-bootstrap/Dropdown";
import './scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
    'PENDENTE': '#FFF' 
}
// DOCUMENTOS

const TabelaAcertosDocumentos = ({lancamentosDocumentos, documentosAjustes, rowsPerPageAcertosDocumentos, setExpandedRowsDocumentos, opcoesJustificativa, expandedRowsDocumentos, rowExpansionTemplateDocumentos,}) => {
    const [documentosSelecionados, setDocumentosSelecionados] = useState([])
    const [textoModalCheckNaoPermitido, setTextoModalCheckNaoPermitido] = useState('')
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [status, setStatus] = useState()

    const selecionarPorStatus = (event, statusId) => {
        console.log('event: ' + event, 'status : ' + statusId)
        console.log('documentosAjustes: ' + documentosAjustes)
        event.preventDefault()
        setStatus(statusId)

        let documentos = documentosAjustes.filter(doc => 
            doc.status_realizacao === statusId
        )
        console.log('documentos: ' + documentos)

        setDocumentosSelecionados(documentos)
    }

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
                                setTextoModalCheckNaoPermitido('<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>')
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
                style={{ backgroundColor: statusId ? tagColors[statusId] : '#fff', color: statusId === 'PENDENTE' ? '#000' : '#fff' }}
            >
                {status}
            </div>
        )
    }

    const limparDocumentos = (event) => {
        setDocumentosSelecionados([])
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="p-0">
                            <input
                                checked={false} // documentosSelecionados.length === documentosAjustes.length
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

    return(
        <div>
            <DataTable
                value={lancamentosDocumentos}
                paginator={lancamentosDocumentos.length > rowsPerPageAcertosDocumentos}
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
                    style={{width: '6%'}}
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
                <Column
                    header={selecionarHeader()}
                    body={selecionarTemplate}
                    style={{width: '4%', borderLeft: 'none'}}
                />
            </DataTable>
        </div>
    )
}
export default memo(TabelaAcertosDocumentos)