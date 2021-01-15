import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaAcoesDasAssociacoes = ({todasAsAcoes, rowsPerPage, statusTemplate, dataTemplate, acoesTemplate}) => {

    return(
        <DataTable
            value={todasAsAcoes}
            paginator={todasAsAcoes.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="associacao.unidade.codigo_eol" header="EOL"/>
            <Column field="associacao.unidade.nome_com_tipo" header="Unidade Educacional"/>
            <Column field="acao.nome" header="Ação"/>
            <Column
                field="acao.nome"
                header="Status"
                body={statusTemplate}
            />
            <Column
                field="acao.nome"
                header="Status"
                body={dataTemplate}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
            />
        </DataTable>
    )
};