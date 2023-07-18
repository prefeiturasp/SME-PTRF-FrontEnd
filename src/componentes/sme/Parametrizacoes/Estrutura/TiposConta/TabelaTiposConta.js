import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaTiposContas = ({rowsPerPage, listaDeTiposContas, acoesTemplate})=>{
    return(
        <DataTable
            value={listaDeTiposContas}
            rows={rowsPerPage}
            paginator={listaDeTiposContas.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="nome" header="Tipo de conta" />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />
        </DataTable>
    );
};
export default memo(TabelaTiposContas)

