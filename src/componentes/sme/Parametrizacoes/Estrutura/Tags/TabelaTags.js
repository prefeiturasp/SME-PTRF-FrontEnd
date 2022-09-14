import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaTags = ({rowsPerPage, listaDeTags, statusTemplate, acoesTemplate})=>{
    return(
        <DataTable
            value={listaDeTags}
            rows={rowsPerPage}
            paginator={listaDeTags.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="uuid" header="UUID"/>
            <Column field="nome" header="Nome" />
            <Column
                field="status"
                header="Status"
                body={statusTemplate}
            />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />
        </DataTable>
    );
};
export default memo(TabelaTags)

