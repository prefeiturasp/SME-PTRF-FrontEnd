import React, {memo} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import './scss/tagJustificativaLancamentos.scss';

const tagColors = {
    'JUSTIFICADO':  '#5C4EF8',
    'REALIZADO': '#198459',
    'PENDENTE': '#FFF' 
}

const TabelaAcertosDocumentos = ({lancamentosDocumentos, rowsPerPageAcertosDocumentos, setExpandedRowsDocumentos, opcoesJustificativa, expandedRowsDocumentos, rowExpansionTemplateDocumentos,}) => {
    
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
                        style={{width: '10%'}}
                    />
            </DataTable>
        </div>
    )
}
export default memo(TabelaAcertosDocumentos)