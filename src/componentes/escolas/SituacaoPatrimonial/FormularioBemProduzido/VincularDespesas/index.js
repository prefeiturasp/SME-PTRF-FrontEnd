import React, { useEffect, useState } from "react";
import { Flex, Spin } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../assets/img/img-404.svg";
import { useGetDespesas } from "./hooks/useGetDespesas";
import { formataData } from "../../../../../utils/FormataData";
import { formatMoneyBRL } from "../../../../../utils/money";
import { FormFiltrosDespesas } from "./FormFiltrosDespesas";
import { useCarregaTabelaDespesa } from "../../../../../hooks/Globais/useCarregaTabelaDespesa";
import { useGetPeriodos } from "../../../../../hooks/Globais/useGetPeriodo";
import moment from "moment";
import { useNavigate } from 'react-router-dom';

const filtroInicial = {
  fornecedor: "",
  search: "",
  rateios__conta_associacao__uuid: "",
  periodo__uuid: "",
  data_inicio: "",
  data_fim: "",
};

export const VincularDespesas = ({
  uuid,
  despesasSelecionadas,
  setDespesasSelecionadas,
  salvarRascunho,
}) => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [filtros, setFiltros] = useState(filtroInicial);

  const { data, refetch, isLoading, error, isError } = useGetDespesas(
    {
      fornecedor: filtros.fornecedor,
      search: filtros.search,
      rateios__conta_associacao__uuid: filtros.rateios__conta_associacao__uuid,
      periodo__uuid: filtros.periodo__uuid,
      data_inicio: filtros.data_inicio
        ? moment(filtros.data_inicio).format("YYYY-MM-DD")
        : "",
      data_fim: filtros.data_fim
        ? moment(filtros.data_fim).format("YYYY-MM-DD")
        : "",
    },
    currentPage
  );
  const tabelas = useCarregaTabelaDespesa(null);
  const { data: periodos } = useGetPeriodos({ filtrar_por_referencia: "" });

  useEffect(() => {
    // tratamento para cenário de remover acesso do último item da página.
    if (isError && error?.response.status === 404) {
      setCurrentPage(1);
      setFirstPage(0);
    }
  }, [isError]);

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  const onFiltrar = () => {
    refetch();
  };

  const onFiltrosChange = (values) => {
    setFiltros((prev) => {
      return { ...prev, ...values };
    });
  };

  const limpaFiltros = () => {
    setFiltros(filtroInicial);
    setTimeout(() => refetch(), 0);
  };

  const dataTemplate = (rowData, column) => {
    return formataData(rowData.data_documento);
  };

  const moneyTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.valor_total);
  };

  const valorUtilizadoRateioTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.valor_utilizado);
  };

  const valorDisponivelRateioTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.valor_disponivel);
  };

  const valorRateioTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.valor_rateio);
  };

  const rateioTemplate = (rowData, column) => {
    return `Rateio ${column.rowIndex + 1}`;
  };

  const expandedRowTemplate = (data) => {
    return (
      <DataTable value={data.rateios}>
        <Column header="Rateio" body={rateioTemplate} />
        <Column
          field="especificacao_material_servico.descricao"
          header="Especificação do material ou serviço"
        />
        <Column field="aplicacao_recurso" header="Aplicação do recurso" />
        <Column field="acao_associacao.acao.nome" header="Ação" />
        <Column field="conta_associacao.tipo_conta.nome" header="Conta" />
        <Column
          field="valor_rateio"
          header="Valor"
          body={valorRateioTemplate}
        />
        <Column
          field="valor_rateio"
          header="Valor disponível para utilização"
          body={valorDisponivelRateioTemplate}
        />
        <Column
          field="valor_rateio"
          header="Valor utilizado"
          body={valorUtilizadoRateioTemplate}
        />
      </DataTable>
    );
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <h5 className="mt-5">
          Pesquise as despesas relacionadas à produção do bem
        </h5>

        <FormFiltrosDespesas
          onFiltrar={onFiltrar}
          onFiltrosChange={onFiltrosChange}
          onLimparFiltros={limpaFiltros}
          contaOptions={tabelas?.contas_associacao}
          periodoOptions={periodos}
        />

        <div className="mb-5">
          <h5>Resultado da pesquisa</h5>
          <span>Selecione a Despesa para informar os valores utilizados.</span>
        </div>

        <Spin spinning={isLoading}>
          {data && data.count > 0 ? (
            <>
              <p className="mb-2 mt-2">
                Exibindo <span className="total">{data.results.length}</span> de{" "}
                <span className="total">{data.count}</span>
              </p>
              <DataTable
                value={data.results}
                autoLayout={true}
                selection={despesasSelecionadas}
                onSelectionChange={(e) => setDespesasSelecionadas(e.value)}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={expandedRowTemplate}
              >
                <Column selectionMode="multiple" style={{ width: "3em" }} />
                <Column field="periodo_referencia" header="Período" />
                <Column field="numero_documento" header="Nº do documento" />
                <Column
                  field="data_documento"
                  header="Data do documento"
                  body={dataTemplate}
                />
                <Column
                  field="tipo_documento.nome"
                  header="Tipo de Documento"
                />
                <Column
                  field="valor_total"
                  header="Valor"
                  body={moneyTemplate}
                />
                <Column expander style={{ width: "5%", borderLeft: "none" }} />
              </DataTable>

              <Paginator
                first={firstPage}
                rows={10}
                totalRecords={data.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
                alwaysShow={false}
              />
            </>
          ) : (
            <MsgImgCentralizada
              texto={
                "Use os filtros para localizar a despesa que será selecionada."
              }
              img={Img404}
            />
          )}

          <Flex justify="end" gap={8} className="mt-4">
            <button
              className="btn btn-outline-success float-right"
              onClick={() => navigate("/lista-situacao-patrimonial")}
            >
              Cancelar
            </button>
            <button
              className="btn btn-outline-success float-right"
              disabled={!despesasSelecionadas.length && !uuid}
              onClick={salvarRascunho}
            >
              Salvar rascunho
            </button>
          </Flex>
        </Spin>
      </div>
    </div>
  );
};
