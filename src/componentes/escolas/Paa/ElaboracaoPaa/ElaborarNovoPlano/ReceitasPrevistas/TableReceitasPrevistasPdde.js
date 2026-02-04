import React from "react";
import { useGetProgramasPddeTotais } from "./hooks/useGetProgramasPddeTotais";
import { Spin } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconButton } from "../../../../../Globais/UI/Button/IconButton";
import { formatMoneyBRL } from "../../../../../../utils/money";

const TableReceitasPrevistasPdde = ({ activeTab, tabs, setActiveTab }) => {
  const { programas, total, isLoading } = useGetProgramasPddeTotais();

  const nomeTemplate = (rowData, column) => {
    return (
      <span
        style={{ color: "rgba(81, 81, 207, 1)" }}
        className="font-weight-bold"
      >
        {rowData.nome}
      </span>
    );
  };

  const moneyTemplate = (field) => (rowData) => {
    return (
      <div style={{ textAlign: "right" }}>
        {formatMoneyBRL(rowData[field] || 0)}
      </div>
    );
  };

  const handleChangeTab = () => {
    setActiveTab("detalhamento-das-acoes-pdde");
  };

  const rowClassName = (rowData) => {
    return rowData.fixed ? "total-row" : "inactive-row";
  };

  const acoesTemplate = (rowData) => {
    return !rowData["fixed"] ? (
      <IconButton
        icon="faEdit"
        tooltipMessage="Editar ações"
        iconProps={{
          style: { fontSize: "20px", marginRight: "0", color: "#00585E" },
        }}
        aria-label="Editar"
        onClick={() => handleChangeTab()}
      />
    ) : null;
  };

  const totalRow = {
    nome: "Total do PDDE",
    total_valor_custeio: total?.total_valor_custeio || 0,
    total_valor_capital: total?.total_valor_capital || 0,
    total_valor_livre_aplicacao: total?.total_valor_livre_aplicacao || 0,
    total: total?.total || 0,
    fixed: true,
  };

  return (
    <>
      {tabs.length > 0 && activeTab === tabs[0].id ? (
        <Spin spinning={isLoading}>
          <DataTable
            className="tabela-receitas-previstas mt-4 no-hover"
            value={[...programas, totalRow]}
            rowClassName={rowClassName}
          >
            <Column field="nome" header="Recursos" body={nomeTemplate} style={{width: '15%'}} />
            <Column
              field="total_valor_custeio"
              header="Custeio (R$)"
              body={moneyTemplate("total_valor_custeio")}
              align="right"
              style={{width: '15%'}}
            />
            <Column
              field="total_valor_capital"
              header="Capital (R$)"
              body={moneyTemplate("total_valor_capital")}
              align="right"
              style={{width: '15%'}}
            />
            <Column
              field="total_valor_livre_aplicacao"
              header="Livre Aplicação (R$)"
              body={moneyTemplate("total_valor_livre_aplicacao")}
              align="right"
              style={{width: '20%'}}
            />
            <Column
              field="total"
              header="Total (R$)"
              body={moneyTemplate("total")}
              align="right"
              style={{width: '15%'}}
            />
            <Column field="acoes" header="Ações" body={acoesTemplate} style={{width: '10%'}} />
          </DataTable>
        </Spin>
      ) : null}
    </>
  );
};

export default TableReceitasPrevistasPdde;
