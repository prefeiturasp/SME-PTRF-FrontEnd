import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

export const TabelaAssociacoes = ({associacoes, rowsPerPage, unidadeEscolarTemplate, statusRegularidadeTemplate, acoesTemplate}) =>{
  return(
      <DataTable
          value={associacoes}
          className="mt-3 container-tabela-associacoes"
          paginator={associacoes.length > rowsPerPage}
          rows={rowsPerPage}
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          //paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          autoLayout={true}
          selectionMode="single"
      >
          <Column field="unidade.codigo_eol" header="Código Eol" />
          <Column
              field="nome"
              header="Unidade escolar"
              body={unidadeEscolarTemplate}
          />
          <Column
              field="status_regularidade"
              header="Regularidade"
              body={statusRegularidadeTemplate}
          />
          <Column
              header="Ações"
              body={acoesTemplate}
          />
      </DataTable>
  );
};