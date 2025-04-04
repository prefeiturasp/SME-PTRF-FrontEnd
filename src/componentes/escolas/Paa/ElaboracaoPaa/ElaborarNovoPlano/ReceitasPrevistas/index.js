import React, { Fragment, useCallback, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Checkbox, Flex, Spin } from "antd";
import { IconButton } from "../../../../../Globais/UI";
import { useGetAcoesAssociacao } from "./hooks/useGetAcoesAssociacao";
import "./style.css";
import ReceitasPrevistasModalForm from "./ReceitasPrevistasModalForm";
import { Icon } from "../../../../../Globais/UI/Icon";
import { formatMoneyBRL } from "../../../../../../utils/money";

const ReceitasPrevistas = () => {
  const [activeTab, setActiveTab] = useState("Receitas Previstas");
  const [modalForm, setModalForm] = useState({ open: false, data: null });
  const { data, isLoading } = useGetAcoesAssociacao();

  const tabs = ["Receitas Previstas", "Detalhamento de recursos próprios"];

  const dataTemplate = useCallback(
    (rowData, column) => {
      if (rowData?.acao?.nome === "Total do PTRF") {
        const totalCapital = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_capital
            ) || 0) + row?.saldos.saldo_atual_capital
          );
        }, 0);

        const totalCusteio = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_custeio
            ) || 0) + row?.saldos.saldo_atual_custeio
          );
        }, 0);

        const totalLivre = data.reduce((acc, row) => {
          return (
            acc +
            (parseFloat(
              row?.receitas_previstas_paa?.[0]?.previsao_valor_livre
            ) || 0) + row?.saldos.saldo_atual_livre
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

      const receitaPrevistaPaa = rowData?.receitas_previstas_paa?.[0]

      const valores = {
        previsao_valor_capital: receitaPrevistaPaa ?  parseFloat(receitaPrevistaPaa.previsao_valor_capital) : 0,
        previsao_valor_custeio: receitaPrevistaPaa ?  parseFloat(receitaPrevistaPaa.previsao_valor_custeio) : 0 ,
        previsao_valor_livre: receitaPrevistaPaa ?  parseFloat(receitaPrevistaPaa.previsao_valor_livre) : 0 
      };

      const valor_capital = valores.previsao_valor_capital + rowData?.saldos.saldo_atual_capital
      const valor_custeio = valores.previsao_valor_custeio + rowData?.saldos.saldo_atual_custeio
      const valor_livre = valores.previsao_valor_livre + rowData?.saldos.saldo_atual_livre

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
          {fieldMapping[column.field] > 0 ? formatMoneyBRL(fieldMapping[column.field]) : <div className="text-right">__</div>}
        </div>
      );
    },
    [data]
  );

  const nomeTemplate = useCallback((rowData, column) => {
    return (
      <span style={{ color: "#00585E" }} className="font-weight-bold">
        {rowData.acao.nome}
      </span>
    );
  }, []);

  const acoesTemplate = (rowData) => {
    return !rowData["fixed"] === true ? (
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

  const handleOpenEditar = (rowData) => {
    setModalForm({ open: true, data: rowData });
  };

  const rowClassName = () => {
    return "inactive-row";
  };

  const handleCloseModalForm = () => {
    setModalForm({ open: false, data: null });
  };

  return (
    <div>
      {modalForm.open && (
        <ReceitasPrevistasModalForm
          open={modalForm.open}
          acaoAssociacao={modalForm.data}
          onClose={handleCloseModalForm}
        />
      )}

      <nav className="nav mb-4 mt-4 menu-interno">
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            <li className="nav-item">
              <button
                className={`nav-link btn-escolhe-acao mr-3 ${
                  activeTab === tab && "btn-escolhe-acao-active"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          </Fragment>
        ))}
      </nav>
      {activeTab === tabs[0] ? (
        <Spin spinning={isLoading}>
          <Flex gutter={8} justify="space-between" className="mb-4">
            <h4 className="mb-0">Receitas Previstas</h4>
            <Flex align="center">
              <Checkbox>Parar atualizações do saldo</Checkbox>
              <Icon
                tooltipMessage="Ao selecionar esta opção os valores dos recursos não serão atualizados e serão mantidos os valores da última atualização automática ou da edição realizada."
                icon="faExclamationCircle"
                iconProps={{
                  style: {
                    fontSize: "16px",
                    marginLeft: 4,
                    color: "#086397",
                  },
                }}
              />
            </Flex>
          </Flex>

          <DataTable
            className="tabela-receitas-previstas"
            value={[...data, { acao: { nome: "Total do PTRF" }, fixed: true }]}
            rowClassName={rowClassName}
          >
            <Column field="nome" header="Recursos" body={nomeTemplate} />
            <Column
              field="valor_custeio"
              header="Custeio (R$)"
              body={dataTemplate}
            />
            <Column
              field="valor_capital"
              header="Capital (R$)"
              body={dataTemplate}
            />
            <Column
              field="valor_livre"
              header="Livre Aplicação (R$)"
              body={dataTemplate}
            />
            <Column field="total" header="Total (R$)" body={dataTemplate} />
            <Column field="acoes" header="Ações" body={acoesTemplate} />
          </DataTable>
        </Spin>
      ) : null}
    </div>
  );
};

export default ReceitasPrevistas;
