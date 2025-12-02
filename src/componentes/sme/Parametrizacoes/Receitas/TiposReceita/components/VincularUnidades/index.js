import React, { useEffect, useState } from "react";
import {
  Spin,
} from "antd";
import Img404 from "../../../../../../../assets/img/img-404.svg";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { useDispatch } from "react-redux";
import Loading from "../../../../../../../utils/Loading";
import { ModalConfirm } from "../../../../../../Globais/Modal/ModalConfirm";
import { useGetUnidadesNaoVinculadas } from "./hooks/useGetUnidadesNaoVinculadas";
import { useVincularUnidade } from "./hooks/useVincularUnidade";
import { Filtros } from "../Filtros";
import { MsgImgCentralizada } from "../../../../../../Globais/Mensagens/MsgImgCentralizada";

const filtroInicial ={
  nome_ou_codigo: "",
  dre: ""
}

export const VincularUnidades = ({tipoContaUUID}) => {
  const dispatch = useDispatch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(0);
  const [selectedUnidades, setSelectedUnidades] = useState([]);
  const [filtros, setFiltros] = useState(filtroInicial);

  const { data, refetch, isLoading, error, isError } = useGetUnidadesNaoVinculadas(
    tipoContaUUID,
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

  const { mutationVincularUnidade, mutationVincularUnidadeEmLote } = useVincularUnidade();

   useEffect(() => {
    refetch();
  }, [currentPage]);

  const onPageChange = (event) => {
    setFirstPage(event.first);
    setCurrentPage(event.page + 1);
  };

  function handleVincular(rowData) {
    mutationVincularUnidade.mutate({uuid: tipoContaUUID, unidadeUUID: rowData["uuid"]})
  }

  const handleVincularEmLote = async () => {
    try {
      const uuids = selectedUnidades.map((item) => item.uuid);
      mutationVincularUnidadeEmLote.mutate({uuid: tipoContaUUID, unidadeUUID: uuids})
      setSelectedUnidades([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarVincularUnidade = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Vincular unidade ao tipo de crédito",
      message:
        "<p>Deseja realmente vincular unidade ao tipo de crédito?</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-vincular-unidade-ao-tipo-de-credito",
      onConfirm: () => handleVincular(rowData),
    });
  };

  const handleConfirmarVincularUnidadeEmLote = (rowData) => {
    ModalConfirm({
      dispatch,
      title: "Confirmação vincular unidades em lote",
      message:
       "<p>Deseja realmente vincular as unidades selecionadas ao tipo de crédito?</p>",
      cancelText: "Não",
      confirmText: "Sim",
      confirmButtonClass: "btn-danger",
      dataQa: "modal-confirmar-vincular-unidade-ao-tipo-de-credito-em-lote",
      onConfirm: () => handleVincularEmLote(),
    });
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
                    onClick={() => handleConfirmarVincularUnidadeEmLote()}
                  >
                    <FontAwesomeIcon
                      style={{
                        color: "white",
                        fontSize: "15px",
                        marginRight: "2px",
                      }}
                      icon={faPlusCircle}
                    />
                    <strong>Vincular unidades</strong>
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
      <Tooltip title="Vincular unidade">
        <Button
          type="text"
          className="btn btn-link link-green"
          aria-label="Vincular unidade"
          onClick={() => handleConfirmarVincularUnidade(rowData)}
          disabled={selectedUnidades.length > 0}
          icon={
            <FontAwesomeIcon
              style={{
                fontSize: "20px",
                marginRight: 3,
                color: "#00585e",
              }}
              icon={faPlusCircle}
            />
          }
        ></Button>
      </Tooltip>
    );
  };

  const onFilterChange = ()=> {
    refetch()
  }

  const limpaFiltros = ()=> {
    setFiltros(filtroInicial)
    setTimeout(() => refetch(), 0);
  }

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
    <div>
      <div style={{ position: "relative" }}>
        <Filtros 
          onFilterChange={() => onFilterChange()} 
          limpaFiltros={limpaFiltros} 
          setFiltros={setFiltros}
          filtros={filtros}
        />
        <Spin spinning={mutationVincularUnidade.isPending || mutationVincularUnidadeEmLote.isPending}>
        {selectedUnidades.length ? montarBarraAcoesEmLote() : null}
        {data.count > 0 ? (
            <>
              <p className='mb-2'>Exibindo <span className='total'>{ data.count }</span> unidades</p>
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
                totalRecords={data.count}
                template="PrevPageLink PageLinks NextPageLink"
                onPageChange={onPageChange}
                alwaysShow={false}
              />
            </>
          ) : (
            <MsgImgCentralizada
              texto={"Use os filtros para localizar a unidade que será vinculada ao tipo de crédito."}
              img={Img404}
            />
          )
        }
        </Spin>
      </div>
    </div>
  );
};
