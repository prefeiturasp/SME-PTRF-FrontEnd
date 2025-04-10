import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useCallback } from "react";
import { formatMoneyBRL } from "../../../../../../utils/money";
import { IconButton } from "../../../../../Globais/UI";

const TabelaRecursosProprios = ({ totalRecursosProprios, setActiveTab }) => {
  const dataRecursosProprios = [
    {
      nome: "Recursos Próprios",
    },
  ];

  const nomeRecursoProprioTemplate = useCallback((rowData, column) => {
    return (
      <span style={{ color: "#992B6C" }} className="font-weight-bold">
        {rowData.nome}
      </span>
    );
  }, []);

  const totalRecursoProprioTemplate = useCallback(() => {
    return (
      <span className="font-weight-bold">
        {totalRecursosProprios
          ? formatMoneyBRL(totalRecursosProprios.total)
          : "__"}
      </span>
    );
  }, [totalRecursosProprios]);

  const acoesRecursoProprioTemplate = (rowData) => {
    return !rowData["fixed"] ? (
      <IconButton
        icon="faEdit"
        tooltipMessage="Editar"
        iconProps={{
          style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
        }}
        aria-label="Editar"
        onClick={() => setActiveTab()}
      />
    ) : null;
  };
  return (
    <DataTable
      className="tabela-recursos-proprios mt-5"
      value={dataRecursosProprios}
    >
      <Column
        field="nome"
        header="Recursos"
        body={nomeRecursoProprioTemplate}
      />
      <Column field="valor_custeio" header="Custeio (R$)" />
      <Column field="valor_capital" header="Capital (R$)" />
      <Column field="valor_livre" header="Livre Aplicação (R$)" />
      <Column
        field="total"
        header="Total (R$)"
        body={totalRecursoProprioTemplate}
      />
      <Column field="acoes" header="Ações" body={acoesRecursoProprioTemplate} />
    </DataTable>
  );
};
export default TabelaRecursosProprios;
