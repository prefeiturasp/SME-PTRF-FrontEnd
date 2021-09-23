import React, {memo} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

const TabelaAcertosDocumentos = ({lancamentosDocumentos, rowsPerPageAcertosDocumentos, setExpandedRowsDocumentos, expandedRowsDocumentos, rowExpansionTemplateDocumentos,}) => {
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
                <Column field='tipo_documento_prestacao_conta.nome' header='Nome do Documento' className="align-middle text-left borda-coluna"/>
                <Column expander style={{width: '3em', borderLeft: 'none'}}/>
            </DataTable>
        </div>
    )
}
export default memo(TabelaAcertosDocumentos)