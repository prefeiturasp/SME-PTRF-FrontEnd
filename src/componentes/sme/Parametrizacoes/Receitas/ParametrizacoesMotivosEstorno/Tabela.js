import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Tabela = ({rowsPerPage, lista, acoesTemplate})=>{
    return(
        <DataTable
            value={lista}
            rows={rowsPerPage}
            paginator={lista.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="motivo" header="Nome" />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />
        </DataTable>
    );
};
export default memo(Tabela)

