import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Spin, Button, Tooltip, Checkbox } from "antd";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Img404 from "../../../../assets/img/img-404.svg";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";

import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";
import { CustomModalConfirm } from "../../../Globais/Modal/CustomModalConfirm";
import { useGetUnidadesVinculadas } from "../hooks/useGet";
import { useDesvincularUnidade, useDesvincularUnidadeEmLote, useVincularTodasUnidades } from "../hooks/useVinculoUnidade";

import { Filtros } from "../Filtros";
import { Paginacao } from "../Paginacao";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "antd";

export const UnidadesVinculadas = ({
    instanceUUID,
    instanceLabel="",  /** Apenas para fins de exibição de label em modal de confirmação */
    apiServiceGetUnidadesVinculadas,
    apiServiceDesvincularUnidade,
    apiServiceDesvincularUnidadeEmLote,
    apiServiceVincularTodasUnidades,
    exibirUnidadesVinculadas=true,  /** Exibe a tabela de unidades vinculadas. Diferencia de data.results.length > 0 quando há filtros */
    header=null,
    onDesvincular=()=>{},
    }) => {

    const dispatch = useDispatch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);
    const [filtros, setFiltros] = useState({});

    const rowsPerPage = 10
    
    const [selectedUnidades, setSelectedUnidades] = useState([]);
    const [vincularTodas, setVincularTodas] = useState(false);

    const formatStyleTextModal = { color: "var(--color-primary)", fontWeight: "bold" };

    const {
        data: unidadesVinculadas,
        isLoading: isLoadingUnidadesVinculadas,
        isError, error
    } = useGetUnidadesVinculadas(
        apiServiceGetUnidadesVinculadas, instanceUUID,
        { page: currentPage, ...filtros, page_size: rowsPerPage});

    useEffect(() => {
        // tratamento para cenário quando a página atual não existe mais após novo filtro aplicado
        if (isError && error?.response.status === 404) {
            setCurrentPage(1);
            setFirstPage(0);
        }
    }, [isError]);

    const onPageChange = (currentPage, firstPage) => {
        setCurrentPage(currentPage);
        setFirstPage(firstPage);
    };
    const onFilterChange = (filtrosAplicados)=> {
        setFiltros(filtrosAplicados)
    }

    const limpaFiltros = (filtrosAplicados)=> {
        setFiltros(filtrosAplicados)
    }

    const mutationDesvincularUnidade = useDesvincularUnidade(
        apiServiceDesvincularUnidade,
        onDesvincular
    );
    
    const mutationDesvincularUnidadeEmLote = useDesvincularUnidadeEmLote(
        apiServiceDesvincularUnidadeEmLote,
        onDesvincular
    );

    const mutationVincularTodasUnidades = useVincularTodasUnidades(
        apiServiceVincularTodasUnidades,
        () => {
            setVincularTodas(true);
            onDesvincular();
        }
    );

    const textoModalDesvincularUnidade = (unidade) => {
        const unidadeLabel = unidade.nome_com_tipo
        return <>
            <p style={{fontSize: "14px"}}>
                Deseja realmente desvincular unidade <span style={formatStyleTextModal}>{unidadeLabel}</span> de <span style={formatStyleTextModal}>{instanceLabel}</span>?
            </p>
        </>
    }
 
    const handleDesvincular = async (unidade_uuid, confirmado=false) => {
        try {
            await mutationDesvincularUnidade.mutateAsync({uuid: instanceUUID, unidade_uuid, payload: {confirmado}})
            setSelectedUnidades([])
        } catch (error) {
            if (error?.response?.data?.confirmar) {
                const confirmarDesvinculo = true
                ModalConfirm({
                    dispatch,
                    title: "Confirmação de desvinculação",
                    message: (error?.response?.data?.confirmar||'').replace('\n', '<br>'),
                    cancelText: "Cancelar",
                    confirmText: "Confirmar desvinculação",
                    confirmButtonClass: "btn-success",
                    dataQa: "modal-confirmar-desvincular-unidade",
                    onConfirm: () => handleDesvincular(unidade_uuid, confirmarDesvinculo),
                });
            } else {
                CustomModalConfirm({
                    dispatch,
                    title: "Erro ao desvincular unidade",
                    message: error?.response?.data?.mensagem ||
                                error?.response?.data?.detail ||
                                error?.response?.data?.non_field_errors ||
                                error?.response?.data ||
                                "Falha ao tentar desvincular unidade",
                    cancelText: "Ok",
                    dataQa: "modal-erro-desvincular-unidade",
                });
            }
        }
    };

    const handleConfirmarDesvincularUnidade = (rowData) => {
        const textoModal = textoModalDesvincularUnidade(rowData);
        ModalConfirm({
            dispatch,
            title: "Confirmação de desvinculação",
            children: <>{textoModal}</>,
            cancelText: "Cancelar",
            confirmText: "Confirmar desvinculação",
            confirmButtonClass: "btn-success",
            dataQa: "modal-confirmar-desvincular-unidade",
            onConfirm: () => handleDesvincular(rowData.uuid),
        });
    };

    const handleDesvincularEmLote = async (unidade_uuids, confirmado=false) => {
        try {
            await mutationDesvincularUnidadeEmLote.mutateAsync({uuid: instanceUUID, unidade_uuids, payload: {confirmado}})
            setSelectedUnidades([]);
        } catch (error) {
            if (error?.response?.data?.confirmar) {
                const confirmarDesvinculo = true
                ModalConfirm({
                    dispatch,
                    title: "Confirmação de desvinculação",
                    message: (error?.response?.data?.confirmar||'').replace('\n', '<br>'),
                    cancelText: "Cancelar",
                    confirmText: "Confirmar desvinculação",
                    confirmButtonClass: "btn-success",
                    dataQa: "modal-confirmar-desvincular-unidade",
                    onConfirm: () => handleDesvincularEmLote(unidade_uuids, confirmarDesvinculo),
                });
            } else {
                CustomModalConfirm({
                    dispatch,
                    title: "Erro ao desvincular unidade",
                    message: error?.response?.data?.mensagem ||
                                error?.response?.data?.detail ||
                                error?.response?.data?.non_field_errors ||
                                error?.response?.data ||
                                "Falha ao tentar desvincular unidades em lote",
                    cancelText: "Ok",
                    dataQa: "modal-erro-desvincular-unidade-em-lote",
                });
            }
        }
    };

    const textoModalDesvincularUnidadeEmLote = (qtde) => {
        const selecao = `${qtde} unidade${qtde === 1 ? "" : "s"} selecionada${qtde === 1 ? "" : "s"}`;
        return <>
            <p style={{fontSize: "14px"}}>
                Você está prestes a desvincular <span style={formatStyleTextModal}>{selecao}</span> de <span style={formatStyleTextModal}>{instanceLabel}</span>.
            </p>
            <p>
                Após confirmar, todas as unidades selecionadas não terão mais acesso a ele, deseja prosseguir com a desvinculação?
            </p>
        </>
    }

    const handleConfirmarDesvincularUnidadeEmLote = () => {
        const uuids = selectedUnidades.map((item) => item.uuid);
        const textoModal = textoModalDesvincularUnidadeEmLote(uuids.length);
        ModalConfirm({
            dispatch,
            title: "Confirmação de desvinculação",
            children: <>{textoModal}</>,
            cancelText: "Cancelar",
            confirmText: "Confirmar desvinculação",
            confirmButtonClass: "btn-success",
            dataQa: "modal-confirmar-desvincular-unidade-em-lote",
            onConfirm: () => handleDesvincularEmLote(uuids),
        });
    };

    const textoModalDesvincularTodas = () => {
        return <>
            <p>
                Você está prestes a vincular <span style={formatStyleTextModal}>todas as unidades</span> ao recurso <span style={formatStyleTextModal}>{instanceLabel}</span>.
            </p>
            <p>
                Ao marcar "Vincular todas", todas as unidades terão vínculo com este recurso. Deseja prosseguir?
            </p>
        </>
    }

    const handleVincularTodasUnidades = async () => {
        try {
            const response = await apiServiceGetUnidadesVinculadas(instanceUUID, { 
                pagination: 'false'
            });
            const todasUnidadesLista = response?.results || [];
            const uuids = todasUnidadesLista.map((unidade) => unidade.uuid);
            
            if (uuids.length === 0) {
                setVincularTodas(true);
                return;
            }
            mutationVincularTodasUnidades.mutate({uuid: instanceUUID});
        } catch (error) {
            console.error("Erro ao buscar unidades vinculadas:", error);
        }
    };

    const handleConfirmarDesvincularTodas = () => {
        const textoModal = textoModalDesvincularTodas();
        ModalConfirm({
            dispatch,
            title: "Confirmação de vinculação",
            children: <>{textoModal}</>,
            cancelText: "Cancelar",
            confirmText: "Confirmar vinculação",
            confirmButtonClass: "btn-success",
            dataQa: "modal-confirmar-desvincular-todas",
            onConfirm: () => {
                handleVincularTodasUnidades();
            },
            onCancel: () => {
                setVincularTodas(unidadesVinculadas?.count === 0);
            },
        });
    };

    const handleVincularTodasChange = (e) => {
        const checked = e.target.checked;
        if (checked) {
            handleConfirmarDesvincularTodas();
        } else {
            if (unidadesVinculadas?.count === 0) {
                return;
            }
            setVincularTodas(false);
        }
    };

    const unidadeEscolarTemplate = (rowData) => {
        return (
            <div>
                {rowData?.["nome_com_tipo"] ? (
                <strong>{rowData["nome_com_tipo"]}</strong>
                ) : (
                ""
                )}
            </div>
        );
    };

  const montarBarraAcoesEmLote = () => {
    return (
      <div className="row mt-2">
        <div className="col-12" style={{
            background: "var(--color-primary)",
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
                { selectedUnidades.length === 1 ? "unidade selecionada" : "unidades selecionadas" }
              </span>
            </div>
            <div className="col-7">
              <div className="row">
                <div className="col-12">
                  <a className="float-right" style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setSelectedUnidades([])}>
                    <FontAwesomeIcon style={{ color: "white", fontSize: "15px", marginRight: "2px" }}
                      icon={faTimesCircle}/>
                    <strong>Cancelar</strong>
                  </a>
                  <div className="float-right" style={{ padding: "0px 10px" }}>
                    |
                  </div>
                  <a className="float-right" style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => handleConfirmarDesvincularUnidadeEmLote()}>
                    <FontAwesomeIcon style={{ color: "white", fontSize: "15px", marginRight: "2px"}}
                      icon={faPlusCircle}/>
                    <strong data-testid="action-desvincular-unidades">Desvincular unidades</strong>
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
                    onClick={() => handleConfirmarDesvincularUnidade(rowData)}
                    disabled={selectedUnidades.length > 0}
                    icon={<FontAwesomeIcon
                            style={{ fontSize: "20px", marginRight: 3, color: "#B40C02"}}
                            icon={faTimesCircle}/>}
                    />
            </Tooltip>
        );
  };

  return (
    <>
    {exibirUnidadesVinculadas &&
        <>
        <div style={{ marginBottom: "16px" }}>
            { header }
            {apiServiceVincularTodasUnidades && (
                <div style={{ marginTop: "8px" }}>
                    <Checkbox
                        checked={vincularTodas}
                        onChange={handleVincularTodasChange}
                        disabled={mutationVincularTodasUnidades?.isPending || isLoadingUnidadesVinculadas}
                    >
                        Todas as unidades
                    </Checkbox>
                </div>
            )}
        </div>

        <Filtros
            filtros={filtros}
            onFilterChange={onFilterChange}
            limpaFiltros={limpaFiltros} />

        <Spin spinning={isLoadingUnidadesVinculadas}>
            <>
            {selectedUnidades.length ? montarBarraAcoesEmLote() : null}
            {unidadesVinculadas?.count > 0 ? (
                <>
                    <p className='mb-2'>
                        Exibindo <span className='total'>{ (unidadesVinculadas?.results||[]).length }</span> de <span className='total'>{ unidadesVinculadas?.count }</span> unidades vinculadas
                    </p>
                    <DataTable
                        value={unidadesVinculadas?.results}
                        autoLayout={true}
                        selection={selectedUnidades}
                        onSelectionChange={(e) => setSelectedUnidades(e.value)}
                        >
                        <Column selectionMode="multiple" style={{ width: "3em", textAlign: "center" }} />
                        <Column
                            field="codigo_eol"
                            header="Código EOL"
                            align="center"
                            style={{ width: "110px" }}
                        />
                        <Column
                            field="nome_com_tipo"
                            header="Unidade educacional"
                            body={unidadeEscolarTemplate}
                        />
                        <Column
                            field="uuid"
                            header="Ação"
                            align={'center'}
                            body={acoesTemplate}
                            className="text-center"
                            style={{ width: "100px", textAlign: "center" }}
                        />
                    </DataTable>

                    <Paginacao
                        onPageChange={onPageChange}
                        data={unidadesVinculadas}
                        firstPage={firstPage}
                        rowsPerPage={rowsPerPage}
                        />
                </>) : (
                    <MsgImgCentralizada
                        texto={"Use os filtros para localizar a unidade vinculada."}
                        img={Img404}
                        width={250}
                        />
                    )
                }
            </>
        </Spin>
        <Divider/>
        </>
    }
    </>
  );
};
