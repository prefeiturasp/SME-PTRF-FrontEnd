import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useCallback } from "react";
import { formatMoneyBRL } from "../../../../../../utils/money";
import { IconButton } from "../../../../../Globais/UI";

const TabelaReceitasPrevistas = ({ data, handleOpenEditar }) => {
  const nomeTemplate = useCallback((rowData) => {
    return (
      <span style={{ color: "#00585E" }} className="font-weight-bold">
        {rowData.acao.nome}
      </span>
    );
  }, []);

  const dataTemplate = useCallback(
    (rowData, column) => {
      if (rowData?.acao?.nome === "Total do PTRF") {
        const totalCapital = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_capital
            ) || 0) +
            row?.saldos?.saldo_atual_capital
          );
        }, 0);

        const totalCusteio = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_custeio
            ) || 0) +
            row?.saldos?.saldo_atual_custeio
          );
        }, 0);

        const totalLivre = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_livre
            ) || 0) +
            row?.saldos?.saldo_atual_livre
          );
        }, 0);

        const totalGeral = totalCapital + totalCusteio + totalLivre;

        const fieldMapping = {
          valor_capital: totalCapital,
          valor_custeio: totalCusteio,
          valor_livre: totalLivre,
          total: totalGeral,
        };

        return (
          <div className="text-right font-bold">
            {formatMoneyBRL(fieldMapping[column.field])}
          </div>
        );
      }

      const receitaPrevistaPaa = rowData?.receitas_previstas_paa?.[0];

      const valores = {
        previsao_valor_capital: receitaPrevistaPaa
          ? parseFloat(receitaPrevistaPaa.previsao_valor_capital)
          : 0,
        previsao_valor_custeio: receitaPrevistaPaa
          ? parseFloat(receitaPrevistaPaa.previsao_valor_custeio)
          : 0,
        previsao_valor_livre: receitaPrevistaPaa
          ? parseFloat(receitaPrevistaPaa.previsao_valor_livre)
          : 0,
      };

      const valor_capital =
        valores.previsao_valor_capital + rowData?.saldos?.saldo_atual_capital;
      const valor_custeio =
        valores.previsao_valor_custeio + rowData?.saldos?.saldo_atual_custeio;
      const valor_livre =
        valores.previsao_valor_livre + rowData?.saldos?.saldo_atual_livre;

      const fieldMapping = {
        valor_capital: valor_capital,
        valor_custeio: valor_custeio,
        valor_livre: valor_livre,
        total:
          parseFloat(valor_custeio) +
          parseFloat(valor_capital) +
          parseFloat(valor_livre),
      };

      return (
        <div className="text-right">
          {fieldMapping[column.field] > 0 ? (
            formatMoneyBRL(fieldMapping[column.field])
          ) : (
            <div className="text-right">__</div>
          )}
        </div>
      );
    },
    [data]
  );

  const acoesTemplate = (rowData) => {
    return !rowData["fixed"] ? (
      <IconButton
        icon="faEdit"
        tooltipMessage="Editar"
        iconProps={{
          style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
        }}
        aria-label="Editar"
        onClick={() => handleOpenEditar(rowData)}
      />
    ) : null;
  };

  return (
    <DataTable
      className="tabela-receitas-previstas"
      value={[...data, { acao: { nome: "Total do PTRF" }, fixed: true }]}
    >
      <Column field="nome" header="Recursos" body={nomeTemplate} />
      <Column field="valor_custeio" header="Custeio (R$)" body={dataTemplate} />
      <Column field="valor_capital" header="Capital (R$)" body={dataTemplate} />
      <Column
        field="valor_livre"
        header="Livre Aplicação (R$)"
        body={dataTemplate}
      />
      <Column field="total" header="Total (R$)" body={dataTemplate} />
      <Column field="acoes" header="Ações" body={acoesTemplate} />
    </DataTable>
  );
};

export default TabelaReceitasPrevistas;
