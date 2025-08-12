import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Flex, Spin } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { useGetBemProduzidosComAdquiridos } from "./hooks/useGetBemProduzidosComAdquiridos";
import { Tag } from "../../../Globais/Tag";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FormFiltrosBens } from "./FormFiltrosBens";
import { useGetPeriodosComPC } from "../../../../hooks/Globais/useGetPeriodoComPC";
import { useCarregaTabelaDespesa } from "../../../../hooks/Globais/useCarregaTabelaDespesa";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../assets/img/img-404.svg";
import ReactTooltip from "react-tooltip";

const filtroInicial = {
  especificacao_bem: "",
  fornecedor: "",
  acao_associacao_uuid: undefined,
  conta_associacao_uuid: undefined,
  periodos_uuid: undefined,
  data_inicio: "",
  data_fim: "",
};

const formatarNumeroDocumento = (numeroDocumento) => {
  if (!numeroDocumento || numeroDocumento.trim() === "") {
    return "";
  }
  
  const numeros = numeroDocumento.split(",").map(num => num.trim()).filter(num => num !== "");
  
  if (numeros.length === 0) {
    return "-";
  }
  
  if (numeros.length === 1) {
    return numeros[0];
  }

  return numeros.map(num => (
    <div key={num} style={{ marginBottom: "2px" }}>
      {num}
    </div>
  ));
};

const formatarDescricao = (rowData) => {
  const especificacao = rowData.especificacao_do_bem || "-";
  const status = rowData.status || "";
  
  let statusColor = "#000000";
  let statusExibido = status;
  
  if (status === "RASCUNHO" || status === "INCOMPLETO") {
    statusColor = "#B40C02";
    statusExibido = "RASCUNHO";
  } else if (status === "COMPLETO") {
    statusColor = "#138E56";
  }
  
  return (
    <div>
      <div style={{ 
        marginBottom: "4px", 
        overflow: "hidden", 
        textOverflow: "ellipsis",
        maxWidth: "200px"
      }}>
        {especificacao}
      </div>
      <div style={{ color: statusColor, fontSize: "0.9em" }}>
        Status: {statusExibido}
      </div>
    </div>
  );
};

const formatarNumeroProcesso = (numeroProcesso) => {
  if (!numeroProcesso || numeroProcesso.trim() === "") {
    return "-";
  }
  
  const numero = numeroProcesso.trim();
  
  if (numero.includes(".") || numero.includes("-")) {
    return numero;
  }
  
  if (/^\d+$/.test(numero)) {
    if (numero.length >= 10) {
      const parte1 = numero.substring(0, 4);
      const parte2 = numero.substring(4, 8);
      const parte3 = numero.substring(8, 15);
      const parte4 = numero.substring(15, 16);
      return `${parte1}.${parte2}/${parte3}-${parte4}`;
    } else {
      return numero.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1.$2/$3-$4");
    }
  }
  return numero;
};

const formatarValorMonetario = (valor) => {
  if (!valor && valor !== 0) {
    return "-";
  }
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  if (isNaN(numero)) {
    return "-";
  }
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatarData = (data) => {
  if (!data) {
    return "-";
  }
  try {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "-";
    }
    return dataObj.toLocaleDateString('pt-BR');
  } catch (error) {
    return "-";
  }
};

export const ListaBemProduzido = (props) => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState(filtroInicial);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [filtroSalvo, setFiltroSalvo] = useState(filtroInicial);

  const { data, refetch, isLoading, error, isError } = useGetBemProduzidosComAdquiridos(
    {
      especificacao_bem: filtros.especificacao_bem,
      fornecedor: filtros.fornecedor,
      acao_associacao_uuid: filtros.acao_associacao_uuid,
      conta_associacao_uuid: filtros.conta_associacao_uuid,
      periodos_uuid: filtros.periodos_uuid,
      data_inicio: filtros.data_inicio
        ? moment(filtros.data_inicio).format("YYYY-MM-DD")
        : "",
      data_fim: filtros.data_fim
        ? moment(filtros.data_fim).format("YYYY-MM-DD")
        : "",
    },
    currentPage
  );
  const { data: periodos } = useGetPeriodosComPC({ filtrar_por_referencia: "" });
  const tabelas = useCarregaTabelaDespesa(null);

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  const onFiltrar = () => {
    refetch();
    setFiltroSalvo(filtros);
    setCurrentPage(1);
    setFirstPage(0);
  };

  const onFiltrosChange = (values) => {
    setFiltros((prev) => {
      return { ...prev, ...values };
    });
  };

  const limpaFiltros = () => {
    setFiltros(filtroInicial);
    setFiltroSalvo(filtroInicial);
    setTimeout(() => refetch(), 0);
    setCurrentPage(1);
    setFirstPage(0);
  };

  const onCancelarFiltros = () => {
    setFiltros(filtroSalvo);
  };

  const expandedRowTemplate = (data) => (
    <>
      {data.despesas.map((despesa) => (
        <DataTable key={despesa.uuid} value={despesa.rateios} rowGroupMode="rowspan" className="mx-4 my-3">
          <Column field="num_documento" header="Nº do Documento" />
          <Column field="data_documento" header="Data do Documento" body={(rowData) => formatarData(rowData.data_documento)} />
          <Column field="" header="Rateio" body={(_, { rowIndex }) => `Despesa ${rowIndex + 1}`} />
          <Column field="especificacao_do_bem" header="Especificação do material ou serviço" />
          <Column field="acao" header="Ação" />
          <Column field="valor" header="Valor" body={(rowData) => formatarValorMonetario(rowData.valor)} />
          <Column field="valor_utilizado" header="Valor utilizado" body={(rowData) => formatarValorMonetario(rowData.valor_utilizado)} />
          <Column
            header="Ação"
            style={{ width: "70px", textAlign: "center" }}
            body={() => {
              return (
                <>
                  <button
                    data-tip="Visualizar despesa"
                    data-for={`tooltip-visualizar-despesa-${despesa.despesa_uuid}`}
                    onClick={() => navigate(`/edicao-de-despesa/${despesa.despesa_uuid}`, { state: { origem: 'situacao_patrimonial' } })}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label="Visualizar despesa"
                  >
                    <FontAwesomeIcon icon={faEye} style={{ color: '#888', fontSize: '1.2em' }} />
                  </button>
                  <ReactTooltip id={`tooltip-visualizar-despesa-${despesa.despesa_uuid}`} effect="solid" place="top" />
                </>
              )
            }}
          />
        </DataTable>
      ))}
      <Flex justify="end" gap={8} className="mt-1 mb-4 mx-4">
        <button 
          className="btn btn-outline-success float-right"
          onClick={() => navigate(`/edicao-bem-produzido/${data.bem_produzido_uuid}`)}
        >
          Editar bem
        </button>
      </Flex>
    </>
  );

  const isRowExpanded = (rowData) => !!expandedRows[rowData.uuid];
  const handleToggleRow = (rowData) => {
    setExpandedRows(prev => {
      const updated = { ...prev };
      if (updated[rowData.uuid]) {
        delete updated[rowData.uuid];
      } else {
        updated[rowData.uuid] = true;
      }
      return updated;
    });
  };

  return (
    <div>
      <div style={{ position: "relative" }}>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/cadastro-bem-produzido")}
        >
          Adicionar bem produzido
        </button>
      </div>

      <FormFiltrosBens
          onFiltrar={onFiltrar}
          onFiltrosChange={onFiltrosChange}
          onLimparFiltros={limpaFiltros}
          acaoOptions={tabelas?.acoes_associacao}
          tipoContaOptions={tabelas?.contas_associacao}
          periodoOptions={periodos}
          filtroSalvo={filtroSalvo}
          onCancelarFiltros={onCancelarFiltros}
        />

      <Spin spinning={isLoading}>
        {data && data.count > 0 ? (
        <>
          <p className="mb-2 mt-4">
            <Flex justify="space-between" align="center">
              <span>
                Exibindo <span className="total">{data?.results.length}</span> de{" "}
                <span className="total">{data?.count}</span>
              </span>
              <button
                onClick={() => console.log("EXPORTAR")}
                className={`link-exportar`}
              >
                <FontAwesomeIcon
                    style={{marginRight:'3px'}}
                    icon={faDownload}
                />
                <strong>Exportar</strong>
              </button>
            </Flex>
          </p>

          <DataTable
            value={data?.results}
            autoLayout={true}
            expandedRows={expandedRows}
            rowExpansionTemplate={expandedRowTemplate}
            dataKey="uuid"
            className="no-stripe mt-3 no-hover"
          >
            <Column 
              field="numero_documento" 
              header="Nº do documento" 
              body={(rowData) => formatarNumeroDocumento(rowData.numero_documento)}
            />
            <Column 
              field="descricao" 
              header="Especificação do bem" 
              body={(rowData) => formatarDescricao(rowData)}
            />
            <Column 
              field="num_processo_incorporacao" 
              header="Nº do processo de incorporação"
              body={(rowData) => formatarNumeroProcesso(rowData.num_processo_incorporacao)}
            />
            <Column 
              field="data_aquisicao_producao" 
              header="Data de aquisição/ produção"
              style={{ width: "60px" }}
              body={(rowData) => formatarData(rowData.data_aquisicao_producao)}
            />
            <Column field="periodo" header="Período" />
            <Column 
              field="quantidade" 
              header="Quantidade"
              style={{ width: "30px", textAlign: "center" }}
              bodyStyle={{ textAlign: 'center' }}
            />
            <Column 
              field="valor_total" 
              header="Valor total"
              body={(rowData) => formatarValorMonetario(rowData.valor_total)}
            />
            <Column 
              field="tipo" 
              header="Tipo de bem"
              body={(rowData) => {
                if (rowData.tipo === "Produzido") {
                  return <Tag label="Produzido" color="bem-produzido" />;
                } else if (rowData.tipo === "Adquirido") {
                  return <Tag label="Adquirido" color="bem-adquirido" />;
                } else {
                  return null;
                }
              }}
            />
            <Column
              header="Ação"
              style={{ width: "5%", borderLeft: "none", textAlign: 'center' }}
              body={rowData => {
                if (rowData.tipo === "Produzido") {
                  const isExpanded = isRowExpanded(rowData);
                  return (
                    <button
                      onClick={() => handleToggleRow(rowData)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      aria-label={isExpanded ? "Recolher" : "Expandir"}
                    >
                      <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
                    </button>
                  );
                }
                if (rowData.tipo === "Adquirido") {
                  return (
                    <>
                      <button
                        data-tip="Visualizar despesa"
                        data-for={`tooltip-visualizar-despesa-${rowData.despesa_uuid}`}
                        onClick={() => navigate(`/edicao-de-despesa/${rowData.despesa_uuid}`, { state: { origem: 'situacao_patrimonial' } })}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        aria-label="Visualizar despesa"
                      >
                        <FontAwesomeIcon icon={faEye} style={{ color: '#888', fontSize: '1.2em' }} />
                      </button>
                      <ReactTooltip id={`tooltip-visualizar-despesa-${rowData.despesa_uuid}`} effect="solid" place="top" />
                    </>
                  );
                }
                return null;
              }}
            />
          </DataTable>

          {data?.count > 10 && (
            <Paginator
              first={firstPage}
              rows={10}
              totalRecords={data?.count}
              template="PrevPageLink PageLinks NextPageLink"
              onPageChange={onPageChange}
              alwaysShow={false}
            />
          )}
        </>
        ) : (
          <MsgImgCentralizada
            texto={
              "Nenhum resultado encontrado."
            }
            img={Img404}
          />
        )}
        
      </Spin>
      </div>
    </div>
  );
};
