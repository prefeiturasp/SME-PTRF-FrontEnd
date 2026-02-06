import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useCallback } from "react";
import { formatMoneyBRL } from "../../../../../../utils/money";
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";

const TabelaReceitasPrevistas = ({ data, handleOpenEditar, totalRecursosProprios }) => {
  const nomeTemplate = useCallback((rowData) => {
    return (
      <span style={{ color: "#00585E" }} className="font-weight-bold">
        {rowData.acao.nome}
      </span>
    );
  }, []);

  const getCongeladoOuCapital = (row) => {
    const saldo_congelado_receita_prevista = parseFloat(
      row?.receitas_previstas_paa?.[0]?.saldo_congelado_capital
    )
    return saldo_congelado_receita_prevista || row?.saldos?.saldo_atual_capital
  }
  const getCongeladoOuCusteio = (row) => {
    const saldo_congelado_receita_prevista = parseFloat(
      row?.receitas_previstas_paa?.[0]?.saldo_congelado_custeio
    )
    return saldo_congelado_receita_prevista ||
            row?.saldos?.saldo_atual_custeio
  }
  const getCongeladoOuLivre = (row) => {
    const saldo_congelado_receita_prevista = parseFloat(
      row?.receitas_previstas_paa?.[0]?.saldo_congelado_livre
    )
    const valor_livre = saldo_congelado_receita_prevista || row?.saldos?.saldo_atual_livre
    return valor_livre < 0 ? 0 : valor_livre
  }

  const dataTemplate = useCallback(
    (rowData, column) => {
      if (rowData?.acao?.nome === "Total do PTRF") {
        const totalCapital = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_capital
            ) || 0) + getCongeladoOuCapital(row)
          );
        }, 0);

        const totalCusteio = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_custeio
            ) || 0) + getCongeladoOuCusteio(row)
          );
        }, 0);

        const totalLivre = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_livre
            ) || 0) + getCongeladoOuLivre(row)
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
          <div className="text-right font-weight-bold">
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
        valores.previsao_valor_capital + getCongeladoOuCapital(rowData);

      const valor_custeio =
        valores.previsao_valor_custeio + getCongeladoOuCusteio(rowData);

      const valor_livre =
        valores.previsao_valor_livre + getCongeladoOuLivre(rowData);

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
    [data, totalRecursosProprios]
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
      className="tabela-receitas-previstas no-hover"
      value={[...data, { acao: { nome: "Total do PTRF" }, fixed: true }]}
    >
      <Column field="nome" header="Recursos" body={nomeTemplate} style={{width: '15%'}} />
      <Column field="valor_custeio" header="Custeio (R$)" body={dataTemplate} style={{width: '15%'}} />
      <Column field="valor_capital" header="Capital (R$)" body={dataTemplate} style={{width: '15%'}} />
      <Column
        field="valor_livre"
        header="Livre Aplicação (R$)"
        body={dataTemplate}
        style={{width: '20%'}}
      />
      <Column field="total" header="Total (R$)" body={dataTemplate} style={{width: '15%', fontWeight: 'bold'}} />
      <Column field="acoes" header="Ações" body={acoesTemplate} style={{width: '10%'}} />
    </DataTable>
  );
};

export default TabelaReceitasPrevistas;
