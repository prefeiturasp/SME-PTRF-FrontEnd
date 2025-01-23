import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Tabela = ({rowsPerPage, lista, acoesTemplate})=>{
    return(
        <DataTable
            data-qa="tabela-motivos-pagamento-antecipado"
            value={lista}
            rows={rowsPerPage}
            paginator={lista.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column data-qa="tabela-col-motivos-pagamento-antecipado-motivo" field="motivo" header="Motivo de pagamento antecipado" />
            <Column
                data-qa="tabela-col-motivos-pagamento-antecipado-acoes"
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />
        </DataTable>
    );
};
export default memo(Tabela)
