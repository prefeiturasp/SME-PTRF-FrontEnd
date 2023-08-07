import React from "react";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export const TabelaContasEncerradas = ({
    contas, 
    rowsPerPage, 
}) =>{
    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData.solicitacao_encerramento ? moment(rowData.solicitacao_encerramento.data_aprovacao).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };       
  return( 
    <>
        <h6 className="title-primary">Histórico de contas encerradas</h6>
        <DataTable
            value={contas}
            className="mt-3 container-tabela-contas"
            paginator={contas.length > rowsPerPage}
            rows={rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            autoLayout={true}
            selectionMode="single"
        >
            <Column field="banco_nome" header="Banco" />
            <Column field="agencia" header="Agência" />
            <Column field="numero_conta" header="Nº da conta com o dígito" />
            <Column field="solicitacao_encerramento.data_aprovacao" 
                    data="solicitacao_encerramento.data_aprovacao" 
                    header="Data do encerramento da conta" 
                    body={dataTemplate}/>
        </DataTable>
    </>
  );
};