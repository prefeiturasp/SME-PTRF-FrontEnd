import React, { Fragment, useState } from "react";
import { Checkbox, Flex, Spin } from "antd";
import { useGetAcoesAssociacao } from "./hooks/useGetAcoesAssociacao";
import "./style.css";
import ReceitasPrevistasModalForm from "./ReceitasPrevistasModalForm";
import { Icon } from "../../../../../Globais/UI/Icon";
import DetalhamentoRecursosProprios from "../DetalhamentoRecursosProprios";
import { useGetTotalizadorRecursoProprio } from "../DetalhamentoRecursosProprios/hooks/useGetTotalizarRecursoProprio";
import { ASSOCIACAO_UUID } from "../../../../../../services/auth.service";
import TableReceitasPrevistasPdde from "./TableReceitasPrevistasPdde";
import { DetalhamentoAcoesPdde } from "./DetalhamentoAcoesPdde";
import TabelaRecursosProprios from "./TabelaRecursosProprios";
import TabelaReceitasPrevistas from "./TabelaReceitasPrevistas";

const ReceitasPrevistas = () => {
  const associacaoUUID = localStorage.getItem(ASSOCIACAO_UUID);
  const [activeTab, setActiveTab] = useState("receitas-previstas");
  const [modalForm, setModalForm] = useState({ open: false, data: null });
  const { data, isLoading: isLoadingAcoesassociacao } = useGetAcoesAssociacao();
  const { data: totalRecursosProprios } =
    useGetTotalizadorRecursoProprio(associacaoUUID);

  const TAB_DETALHAMENTO_RECURSOS_PROPRIOS =
    "detalhamento-de-recursos-proprios";

  const tabs = [
    { id: "receitas-previstas", label: "Receitas Previstas" },
    {
      id: "detalhamento-das-acoes-pdde",
      label: "Detalhamamento das ações PDDE",
    },
    {
      id: TAB_DETALHAMENTO_RECURSOS_PROPRIOS,
      label: "Detalhamento de Recursos Próprios",
    },
  ];

  const handleOpenEditar = (rowData) => {
    setModalForm({ open: true, data: rowData });
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
                className={`nav-link btn-escolhe-acao mr-4 ${
                  activeTab === tab.id && "btn-escolhe-acao-active"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          </Fragment>
        ))}
      </nav>

      {activeTab === "receitas-previstas" ? (
        <>
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

          <Spin spinning={isLoadingAcoesassociacao}>
            <TabelaReceitasPrevistas
              data={data}
              handleOpenEditar={handleOpenEditar}
            />
          </Spin>

          <TableReceitasPrevistasPdde
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <TabelaRecursosProprios
            setActiveTab={() =>
              setActiveTab(TAB_DETALHAMENTO_RECURSOS_PROPRIOS)
            }
            totalRecursosProprios={totalRecursosProprios}
          />
        </>
      ) : null}

      {activeTab === "detalhamento-das-acoes-pdde" ? (
        <DetalhamentoAcoesPdde />
      ) : null}

      {activeTab === "detalhamento-de-recursos-proprios" ? (
        <DetalhamentoRecursosProprios />
      ) : null}
    </div>
  );
};

export default ReceitasPrevistas;
