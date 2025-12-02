import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { useDispatch } from "react-redux";
import Loading from "../../../../../../../utils/Loading";
import { ModalConfirm } from "../../../../../../Globais/Modal/ModalConfirm";
import { useGetUnidadesVinculadas } from "./hooks/useGetUnidadesVinculadas";
import { useDesvincularUnidade } from "./hooks/useDesvincularUnidade";
import { Filtros } from "../Filtros";

const filtroInicial = {
  nome_ou_codigo: "",
  dre: "",
};

export const UnidadesVinculadas = ({ UUID, podeEditar }) => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [filtros, setFiltros] = useState(filtroInicial);

  const { data, refetch, isLoading, error, isError } = useGetUnidadesVinculadas(
    UUID,
    currentPage,
    filtros.nome_ou_codigo,
    filtros.dre
  );

  useEffect(() => {
    // tratamento para cenário de remover acesso do último item da página.
    if (isError && error?.response.status === 404) {
      setCurrentPage(1);
      setFirstPage(0);
    }
  }, [isError]);

  const { mutationDesvincularUnidadeEmLote } = useDesvincularUnidade();

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  function handleDesvincular(rowData) {
    mutationDesvincularUnidadeEmLote.mutate({ uuid: UUID, unidadeUUID: [rowData["uuid"]] });
  }

  const handleDesvincularEmLote = async (rowData = null) => {
    try {
      const uuids = selectedUnidades.map((item) => item.uuid);
      mutationDesvincularUnidadeEmLote.mutate({ uuid: UUID, unidadeUUID: uuids });
      setSelectedUnidades([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDesvincular = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Confirmação desvincular unidade ao tipo de despesa de custeio",
      message: "<p>Deseja realmente desvincular a unidade selecionada ao tipo de despesa de custeio?</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-desvincular-unidade-ao-tipo-de-despesa-custeio",
      onConfirm: () => handleDesvincular(rowData),
    });
  };

  const handleConfirmDesvincularEmLote = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Confirmação desvincular unidades ao tipo de despesa de custeio",
      message: "<p>Deseja realmente desvincular as unidades selecionadas ao tipo de despesa de custeio?</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-desvincular-unidade-ao-tipo-de-despesa-custeio-em-lote",
      onConfirm: () => handleDesvincularEmLote(),
    });
  };

  const unidadeEscolarTemplate = (rowData) => {
    return <div>{rowData["nome_com_tipo"] ? <strong>{rowData["nome_com_tipo"]}</strong> : ""}</div>;
  };

  const montarBarraAcoesEmLote = () => {
    return (
      <div className="row">
        <div
          className="col-12"
          style={{
            background: "#00585E",
            color: "white",
            padding: "15px",
            margin: "0px 15px",
            flex: "100%",
          }}
        >
          <div className="row">
            <div className="col-5">
              <span>
                <strong>{selectedUnidades.length}</strong>{" "}
                {selectedUnidades.length === 1 ? "unidade selecionada" : "unidades selecionadas"}
              </span>
            </div>
            <div className="col-7">
              <div className="row">
                <div className="col-12">
                  <a
                    className="float-right"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setSelectedUnidades([])}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "2px",
                      }}
                      icon={faTimesCircle}
                    />
                    <strong>Cancelar</strong>
                  </a>
                  <div className="float-right" style={{ padding: "0px 10px" }}>
                    |
                  </div>
                  <a
                    className="float-right"
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleConfirmDesvincularEmLote()}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "2px",
                      }}
                      icon={faTimesCircle}
                    />
                    <strong>Desvincular unidades</strong>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const acoesTemplate = (rowData) => {
    return (
      <Tooltip title="Desvincular unidade">
        <Button
          type="text"
          className="link-red"
          aria-label="Desvincular unidade"
          onClick={(e) => {
            e.stopPropagation();
            handleConfirmDesvincular(rowData);
          }}
          disabled={selectedUnidades.length > 0 || !podeEditar}
          icon={
            <FontAwesomeIcon
              style={{
                fontSize: "20px",
                marginRight: 3,
                color: "#B40C02",
              }}
              icon={faTimesCircle}
            />
          }
        ></Button>
      </Tooltip>
    );
  };

  const onFilterChange = () => {
    refetch();
  };

  const limpaFiltros = () => {
    setFiltros(filtroInicial);
    setTimeout(() => refetch(), 0);
  };

  if (isLoading) {
    return <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />;
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Filtros
          onFilterChange={() => onFilterChange()}
          limpaFiltros={limpaFiltros}
          setFiltros={setFiltros}
          filtros={filtros}
        />
        <Spin spinning={mutationDesvincularUnidadeEmLote.isPending}>
          {data && data.count > 0 ? (
            <>
              {selectedUnidades.length ? montarBarraAcoesEmLote() : null}
              <p className="mb-2">
                Exibindo <span className="total">{data.count}</span> unidades
              </p>
              <DataTable
                value={data.results}
                autoLayout={true}
                selection={selectedUnidades}
                onSelectionChange={(e) => setSelectedUnidades(e.value)}
                disabled
              >
                {podeEditar && <Column selectionMode="multiple" style={{ width: "3em" }} />}
                <Column field="codigo_eol" header="Código Eol" className="text-center" style={{ width: "15%" }} />
                <Column field="nome_com_tipo" header="Unidade educacional" body={unidadeEscolarTemplate} />
                {podeEditar && (
                  <Column
                    field="uuid"
                    header="Ação"
                    body={acoesTemplate}
                    className="text-center"
                    style={{ width: "20%" }}
                  />
                )}
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
          ) : null}
        </Spin>
      </div>
    </div>
  );
};
