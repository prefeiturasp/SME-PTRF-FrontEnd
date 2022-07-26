import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaLancamentos = ({todasLancamentos, rowsPerPage, lancamentosTemplate}) => {

    return(
        <DataTable
            value={todasLancamentos}
            paginator={todasLancamentos.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome"/>

            <Column
                field="lancamentos"
                header="lançamentos"
                body={lancamentosTemplate}
            />
        </DataTable>
    )
};