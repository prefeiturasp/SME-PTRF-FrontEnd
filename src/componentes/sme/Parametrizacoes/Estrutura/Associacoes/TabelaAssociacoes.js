import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'

export const TabelaAssociacoes = ({listaDeAssociacoes, rowsPerPage, acoesTemplate}) => {

    return(
        <DataTable
            value={listaDeAssociacoes}
            paginator={listaDeAssociacoes.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome da Associação"/>
            <Column field="unidade.nome_com_tipo" header="Unidade educacional"/>
            <Column field="unidade.nome_dre" header="DRE"/>
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    )
};