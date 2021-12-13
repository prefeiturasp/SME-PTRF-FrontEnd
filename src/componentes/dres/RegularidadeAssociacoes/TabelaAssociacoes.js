import React from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

export const TabelaAssociacoes = ({associacoes, rowsPerPage, unidadeEscolarTemplate, statusRegularidadeTemplate, acoesTemplate, exibeAcaoDetalhe}) =>{
  return(
      <DataTable
          value={associacoes}
          className="mt-3 container-tabela-associacoes"
          paginator={associacoes.length > rowsPerPage}
          rows={rowsPerPage}
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          autoLayout={true}
          selectionMode="single"
      >
          <Column field="associacao.unidade.codigo_eol" header="Código Eol" />
          <Column
              field="associacao.unidade.nome_com_tipo"
              header="Unidade escolar"
              body={unidadeEscolarTemplate}
          />
          <Column
              field="status_regularidade"
              header="Regularidade"
              body={statusRegularidadeTemplate}
          />
          {exibeAcaoDetalhe &&
              <Column
                  field="associacao.uuid"
                  header="Ações"
                  body={acoesTemplate}
              />
          }

      </DataTable>
  );
};