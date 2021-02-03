import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaAcoes = ({todasAsAcoes, rowsPerPage, acoesTemplate, conferirUnidadesTemplate}) => {

    return(
        <DataTable
            value={todasAsAcoes}
            paginator={todasAsAcoes.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome"/>

            <Column body={conferirUnidadesTemplate} header='UEs vinculadas'
                                                style={{textAlign: 'center'}}/>

            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    )
};