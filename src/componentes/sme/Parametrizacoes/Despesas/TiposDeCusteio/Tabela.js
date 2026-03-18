import React, { memo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "../../../../Globais/Tag";

const Tabela = ({ rowsPerPage, lista, acoesTemplate }) => {
  const bodyUnidadeContempladas = (rowData) => {
    if (rowData.todas_unidades_selecionadas) {
      return <Tag label="Total" color="todas" />;
    }
    return <Tag label="Parcial" color="parcial" />;
  };

  return (
    <DataTable
      value={lista}
      rows={rowsPerPage}
      paginator={lista.length > rowsPerPage}
      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
    >
      <Column field="nome" header="Nome" />
      <Column
        body={bodyUnidadeContempladas}
        header="Uso associação"
        style={{ width: "250px" }}
      />
      <Column
        field="acoes"
        header="Ações"
        body={acoesTemplate}
        style={{ width: "100px" }}
      />
    </DataTable>
  );
};
export default memo(Tabela);
