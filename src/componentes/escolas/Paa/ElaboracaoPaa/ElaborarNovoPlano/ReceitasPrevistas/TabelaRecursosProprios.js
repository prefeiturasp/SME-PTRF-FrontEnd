import { useCallback, useMemo } from "react";
import { Spin } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { formatMoneyBRL } from "../../../../../../utils/money";
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";
import { useGetTodos } from "./hooks/useGetReceitasPrevistasOutrosRecursosPeriodo";

const TabelaRecursosProprios = ({
  totalRecursosProprios,
  setActiveTab,
  handleOpenEditar = () => {},
}) => {
  const { data: recursos, isLoading: loadingRecursos } = useGetTodos();

  const dataTodosRecursos = useMemo(() => {
    const valorRecursosProprios = parseFloat(totalRecursosProprios?.total || 0);
    const recursoProprio = {
      nome: "Recursos Próprios",
      previsao_valor_custeio: null,
      previsao_valor_capital: null,
      previsao_valor_livre: valorRecursosProprios,
      previsao_valor_custeio_com_saldo: null,
      previsao_valor_capital_com_saldo: null,
      previsao_valor_livre_com_saldo: valorRecursosProprios,
    };

    if (!recursos) {
      return [recursoProprio, {
        uuid: "total",
        nome: "Total de Outros Recursos",
        previsao_valor_custeio_com_saldo: 0,
        previsao_valor_capital_com_saldo: 0,
        previsao_valor_livre_com_saldo: valorRecursosProprios,
        total_saldos: valorRecursosProprios,
        fixed: true,
      }];
    }

    const outrosRecursosMapped = recursos.map((_r) => {
      const { receitas_previstas } = _r;
      const receitaPrevista = receitas_previstas.length
        ? receitas_previstas[0]
        : {};

      const previsao_valor_capital = parseFloat(
        receitaPrevista?.previsao_valor_capital || 0
      );
      const previsao_valor_custeio = parseFloat(
        receitaPrevista?.previsao_valor_custeio || 0
      );
      const previsao_valor_livre = parseFloat(
        receitaPrevista?.previsao_valor_livre || 0
      );
      const saldo_capital = parseFloat(receitaPrevista?.saldo_capital || 0);
      const saldo_custeio = parseFloat(receitaPrevista?.saldo_custeio || 0);
      const saldo_livre = parseFloat(receitaPrevista?.saldo_livre || 0);

      return {
        ..._r,
        receitas_previstas,
        nome: _r.outro_recurso_objeto.nome,
        cor: _r.outro_recurso_objeto.cor,
        previsao_valor_capital,
        previsao_valor_custeio,
        previsao_valor_livre,
        saldo_capital,
        saldo_custeio,
        saldo_livre,

        previsao_valor_capital_com_saldo:
          previsao_valor_capital + saldo_capital,
        previsao_valor_custeio_com_saldo:
          previsao_valor_custeio + saldo_custeio,
        previsao_valor_livre_com_saldo: previsao_valor_livre + saldo_livre,
      };
    });

    const listaGeral = [recursoProprio, ...outrosRecursosMapped].map((row) => ({
      ...row,
      total_saldos:
        (row.previsao_valor_custeio_com_saldo ?? 0) +
        (row.previsao_valor_capital_com_saldo ?? 0) +
        (row.previsao_valor_livre_com_saldo ?? 0),
    }));

    const totalizadores = listaGeral.reduce(
      (acc, item) => {
        acc.previsao_valor_custeio_com_saldo +=
          item.previsao_valor_custeio_com_saldo ?? 0;
        acc.previsao_valor_capital_com_saldo +=
          item.previsao_valor_capital_com_saldo ?? 0;
        acc.previsao_valor_livre_com_saldo +=
          item.previsao_valor_livre_com_saldo ?? 0;
        acc.total_saldos += item.total_saldos ?? 0;
        return acc;
      },
      {
        previsao_valor_custeio_com_saldo: 0,
        previsao_valor_capital_com_saldo: 0,
        previsao_valor_livre_com_saldo: 0,
        total_saldos: 0,
      }
    );

    const linhaTotal = {
      uuid: "total",
      nome: "Total de Outros Recursos",
      previsao_valor_custeio_com_saldo:
        totalizadores.previsao_valor_custeio_com_saldo,
      previsao_valor_capital_com_saldo:
        totalizadores.previsao_valor_capital_com_saldo,
      previsao_valor_livre_com_saldo:
        totalizadores.previsao_valor_livre_com_saldo,
      total_saldos: totalizadores.total_saldos,
      fixed: true,
    };

    return [...listaGeral, linhaTotal];
  }, [totalRecursosProprios, recursos]);

  const nomeRecursoProprioTemplate = useCallback((rowData, column) => {
    const cor = rowData.cor || "#870051";

    return (
      <span style={{ color: cor }} className="font-weight-bold">
        {rowData.nome}
      </span>
    );
  }, []);

  const formataValorRender = useCallback((campo, rowData) => {
    const valor = rowData[campo];

    if (valor === null || valor === undefined) {
      return (
        <span
          style={{
            fontWeight: rowData.fixed ? "bold" : "normal",
            fontSize: rowData.fixed ? "16px" : "14px",
          }}
        >
          __
        </span>
      );
    }
    
    const valorFormatado = formatMoneyBRL(valor);

    return (
      <span
        style={{
          fontWeight: rowData.fixed ? "bold" : "normal",
          fontSize: rowData.fixed ? "16px" : "14px",
        }}
      >
        {valorFormatado !== null ? `R$ ${valorFormatado}` : "__"}
      </span>
    );
  }, []);

  const acoesRecursoProprioTemplate = (rowData) => {
    return !rowData["fixed"] ? (
      <IconButton
        icon="faEdit"
        tooltipMessage="Editar"
        iconProps={{
          style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
        }}
        aria-label="Editar"
        onClick={() => {
          if (rowData.nome === "Recursos Próprios") {
            setActiveTab();
          } else {
            handleOpenEditar(rowData);
          }
        }}
      />
    ) : null;
  };

  const ehColunaDesabilitada = useCallback((rowData, rowIndex, colunaNome) => {
    if (rowData.fixed) return false;

    if (
      rowIndex === 0 &&
      ["aceita_custeio", "aceita_capital"].includes(colunaNome)
    ) {
      return true;
    }

    if (!rowData?.outro_recurso_objeto) return false;

    return !rowData?.outro_recurso_objeto[colunaNome];
  }, []);

  return (
    <Spin spinning={loadingRecursos}>
      <DataTable
        className="tabela-recursos-proprios mt-5 no-hover"
        value={dataTodosRecursos}
      >
        <Column
          field="nome"
          header="Outros Recursos"
          body={nomeRecursoProprioTemplate}
          style={{ width: "15%" }}
        />
        <Column
          field="previsao_valor_custeio"
          header="Custeio (R$)"
          bodyClassName={(rowData, { rowIndex }) => {
            return ehColunaDesabilitada(rowData, rowIndex, "aceita_custeio")
              ? "bg-cinza-claro text-right"
              : "text-right";
          }}
          body={(rowData) =>
            formataValorRender("previsao_valor_custeio_com_saldo", rowData)
          }
          style={{ width: "15%" }}
        />
        <Column
          field="previsao_valor_capital"
          header="Capital (R$)"
          bodyClassName={(rowData, { rowIndex }) => {
            return ehColunaDesabilitada(rowData, rowIndex, "aceita_capital")
              ? "bg-cinza-claro text-right"
              : "text-right";
          }}
          body={(rowData) =>
            formataValorRender("previsao_valor_capital_com_saldo", rowData)
          }
          style={{ width: "15%" }}
        />
        <Column
          field="saldo_livre"
          header="Livre Aplicação (R$)"
          body={(rowData) =>
            formataValorRender("previsao_valor_livre_com_saldo", rowData)
          }
          bodyClassName={(rowData, { rowIndex }) => {
            return ehColunaDesabilitada(
              rowData,
              rowIndex,
              "aceita_livre_aplicacao"
            )
              ? "bg-cinza-claro text-right"
              : "text-right";
          }}
          style={{ width: "20%" }}
        />
        <Column
          field="total_saldos"
          header="Total (R$)"
          body={(rowData) => formataValorRender("total_saldos", rowData)}
          bodyClassName="text-right"
          style={{ width: "15%" }}
        />
        <Column
          field="acoes"
          header="Ações"
          body={acoesRecursoProprioTemplate}
          style={{ width: "10%" }}
        />
      </DataTable>
    </Spin>
  );
};
export default TabelaRecursosProprios;
