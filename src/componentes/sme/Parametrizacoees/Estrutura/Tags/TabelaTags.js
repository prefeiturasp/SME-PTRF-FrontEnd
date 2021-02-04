import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaTags = ({rowsPerPage, listaDeTags, statusTemplate})=>{
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
        </DataTable>
    );
};
export default memo(TabelaTags)

