import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Tabela = ({rowsPerPage, lista, temDocumentoTemplate, acoesTemplate})=>{
    return(
        <DataTable
            value={lista}
            rows={rowsPerPage}
            paginator={lista.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="nome" header="Nome" />
            <Column field="tem_documento" header="Tem documento?" body={temDocumentoTemplate}/>
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

