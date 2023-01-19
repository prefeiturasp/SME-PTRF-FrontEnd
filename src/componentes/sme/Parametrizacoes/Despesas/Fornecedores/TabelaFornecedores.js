import React, {memo} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelaFornecedores = ({rowsPerPage, listaDeFornecedores, acoesTemplate})=>{
    return(
        <DataTable
            value={listaDeFornecedores}
            rows={rowsPerPage}
            paginator={listaDeFornecedores.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        >
            <Column field="nome" header="Nome do Fornecedor" />
            <Column field="cpf_cnpj" header="CPF / CNPJ" />
            <Column
                field="acoes"
                header="Ações"
                body={acoesTemplate}
                style={{width:'100px'}}
            />

        </DataTable>
    );
};
export default memo(TabelaFornecedores)

