import React from "react";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import moment from "moment";

export const TabelaAcoesDasAssociacoes = ({todasAsAcoes}) => {

    const rowsPerPage = 10;

    const statusTemplate = (rowData) => {
        console.log('statusTemplate ', rowData.status)
        return rowData.status && rowData.status === 'ATIVA' ? 'Ativa' : 'Inativa'
    };

    const dataTemplate = (rowData) => {
        return rowData.criado_em ? moment(rowData.criado_em).format("DD/MM/YYYY [às] HH[h]mm") : '';
    };

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
        </DataTable>

    )
};