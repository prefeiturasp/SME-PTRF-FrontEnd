import React, { useEffect, useState } from "react";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { useDispatch } from "react-redux";

import { useUnidadesEmSuporte } from "./hooks/useUnidadesEmSuporte";
import {
  authService,
  getUsuarioLogado,
} from "../../../../../services/auth.service";
import { LegendaInformacao } from "../../../ModalLegendaInformacao/LegendaInformacao";
import { TableTags } from "../../../TableTags";
import { coresTagsAssociacoes } from "../../../../../utils/CoresTags";
import Loading from "../../../../../utils/Loading";
import { ModalConfirm } from "../../../Modal/ModalConfirm";
import { useRemoverSuporte } from "./hooks/useRemoverSuporte";

export const UnidadesAssociadas = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [showModalLegendaInformacao, setShowModalLegendaInformacao] =
    useState(false);

  const { data, count, isLoading, error, isError } = useUnidadesEmSuporte(
    getUsuarioLogado().login,
    currentPage
  );

  useEffect(() => {
    // tratamento para cenário de remover acesso do último item da página.
    if (isError && error?.response.status === 404) {
      setCurrentPage(1);
      setFirstPage(0);
    }
  }, [isError]);

  const { mutationRemoverSuporte, mutationRemoverSuporteEmLote } =
    useRemoverSuporte();

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  function handleRemoverSuporte(rowData) {
    mutationRemoverSuporte.mutate({
      usuario: getUsuarioLogado().login,
      unidade_uuid: rowData.uuid,
    });
  }

  const handleEncerrarSuporteEmLote = async () => {
    try {
      const uuids = selectedUnidades.map((item) => item.uuid);
      await mutationRemoverSuporteEmLote.mutateAsync({
        usuario: getUsuarioLogado().login,
        unidade_uuids: uuids,
      });
      setSelectedUnidades([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarRemoverSuporte = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Confirmação de encerramento de suporte",
      message:
        "<p>Deseja encerrar o suporte a essa unidade?</p> <p> Ao confirmar, você não visualizará mais essa unidade como suporte.</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-remover-suporte",
      onConfirm: () => handleRemoverSuporte(rowData),
    });
  };

  const handleConfirmarRemoverSuporteEmLote = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Confirmação de encerramento de suporte",
      message:
        "<p>Deseja encerrar o suporte a essas unidades?</p> <p> Ao confirmar, você não visualizará mais essas unidades como suporte.</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-remover-suporte-em-lote",
      onConfirm: () => handleEncerrarSuporteEmLote(),
    });
  };

  const handleLoginToSuporte = () => {
    authService.logoutToSuporte();
  };

  const unidadeEscolarTemplate = (rowData) => {
    return (
      <div>
        {rowData["nome_com_tipo"] ? (
          <strong>{rowData["nome_com_tipo"]}</strong>
        ) : (
          ""
        )}
      </div>
    );
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
                {selectedUnidades.length === 1
                  ? "unidade selecionada"
                  : "unidades selecionadas"}
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
                    onClick={() => handleConfirmarRemoverSuporteEmLote()}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "2px",
                      }}
                      icon={faTrash}
                    />
                    <strong>Encerrar suporte</strong>
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
      <Tooltip title="Encerrar suporte">
        <Button
          type="text"
          className="link-red"
          onClick={() => handleConfirmarRemoverSuporte(rowData)}
          disabled={selectedUnidades.length > 0}
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

  if (isLoading) {
    return (
      <Loading
        corGrafico="black"
        corFonte="dark"
        marginTop="0"
        marginBottom="0"
      />
    );
  }

  return (
    count > 0 && (
      <>
        <h5 className="titulo-itens-painel mt-2">
          Unidades de suporte vinculadas
        </h5>
        <div className="d-flex justify-content-end">
          <button
            onClick={handleLoginToSuporte}
            className="btn btn-success mt-2"
          >
            Login para as unidades de suporte
          </button>
        </div>
        <div className="mt-5">
          <div className="my-3">
            <LegendaInformacao
              showModalLegendaInformacao={showModalLegendaInformacao}
              setShowModalLegendaInformacao={setShowModalLegendaInformacao}
              entidadeDasTags="associacao"
              excludedTags={["Encerramento de conta pendente"]}
            />
          </div>
          <div style={{ position: "relative" }}>
            {mutationRemoverSuporteEmLote.isLoading ||
            mutationRemoverSuporte.isLoading ? (
              <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
                style={{
                  position: "absolute",
                  zIndex: 999,
                  right: 0,
                  left: 0,
                  top: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.2)",
                  alignItems: "center",
                }}
              />
            ) : null}

            {selectedUnidades.length ? montarBarraAcoesEmLote() : null}

            <DataTable
              value={data.results}
              autoLayout={true}
              selection={selectedUnidades}
              onSelectionChange={(e) => setSelectedUnidades(e.value)}
              disabled
            >
              <Column selectionMode="multiple" style={{ width: "3em" }} />
              <Column
                field="codigo_eol"
                header="Código Eol"
                className="text-center"
                style={{ width: "15%" }}
              />
              <Column
                field="nome_com_tipo"
                header="Unidade educacional"
                body={unidadeEscolarTemplate}
              />
              <Column
                field="informacao"
                header="Informações"
                className="align-middle text-center"
                body={(rowData) => (
                  <TableTags
                    data={rowData}
                    coresTags={coresTagsAssociacoes}
                    excludeTags={["Encerramento de conta pendente"]}
                  />
                )}
                style={{ width: "15%" }}
              />
              <Column
                field="uuid"
                header="Ação"
                body={acoesTemplate}
                className="text-center"
                style={{ width: "20%" }}
              />
            </DataTable>

            <Paginator
              first={firstPage}
              rows={10}
              totalRecords={count}
              template="PrevPageLink PageLinks NextPageLink"
              onPageChange={onPageChange}
              alwaysShow={false}
            />
          </div>
        </div>
        <hr></hr>
      </>
    )
  );
};
