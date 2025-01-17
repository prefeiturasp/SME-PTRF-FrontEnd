import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Tabela = ({rowsPerPage, lista, acoesTemplate})=>{
    return(
        <DataTable
            data-qa="tabela-tipo-documento"
            value={lista}
            rows={rowsPerPage}
            paginator={lista.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column data-qa="tabela-col-tipo-documento-nome" field="nome" header="Nome" />
            <Column
                data-qa="tabela-col-tipo-documento-acoes"
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />
        </DataTable>
    );
};
export default memo(Tabela)
