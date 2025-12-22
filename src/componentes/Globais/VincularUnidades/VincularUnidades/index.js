import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Spin, Button, Tooltip } from "antd";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Img404 from "../../../../assets/img/img-404.svg";
import { MsgImgCentralizada } from "../../../Globais/Mensagens/MsgImgCentralizada";

import { ModalConfirm } from "../../../Globais/Modal/ModalConfirm";
import { useGetUnidadesNaoVinculadas } from "../hooks/useGet";
import { useVincularUnidade, useVincularUnidadeEmLote } from "../hooks/useVinculoUnidade";
import { Filtros } from "../Filtros";
import { Paginacao } from "../Paginacao";


export const VincularUnidades = ({
    instanceUUID,
    instanceLabel="",  /** Apenas para fins de exibição de label em modal */
    apiServiceGetUnidadesNaoVinculadas,
    apiServiceVincularUnidade,
    apiServiceVincularUnidadeEmLote,
    extraButtonFilters=null,
    header,
    onVincular=()=>{},
    }) => {
    const dispatch = useDispatch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);
    const [filtros, setFiltros] = useState({});

    const rowsPerPage = 10
    
    const [selectedUnidades, setSelectedUnidades] = useState([]);

    const formatStyleTextModal = { color: "#00585E", fontWeight: "bold" };

    const {
        data: unidadesNaoVinculadas,
        isLoading: isLoadingUnidadesNaoVinculadas,
        isError, error
    } = useGetUnidadesNaoVinculadas(
        apiServiceGetUnidadesNaoVinculadas,
        instanceUUID, { page: currentPage, ...filtros, page_size: rowsPerPage});

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

    const mutationVincularUnidade = useVincularUnidade(
        apiServiceVincularUnidade,
        onVincular
    );
    
    const mutationVincularUnidadeEmLote = useVincularUnidadeEmLote(
        apiServiceVincularUnidadeEmLote,
        onVincular
    );

    const textoModalVincularUnidade = (unidade) => {
        const unidadeLabel = unidade.nome_com_tipo
        return <>
            <p style={{fontSize: "14px"}}>
                Deseja realmente vincular unidade <span style={formatStyleTextModal}>{unidadeLabel}</span> a <span style={formatStyleTextModal}>{instanceLabel}</span>?
            </p>
        </>
    }
    
    const handleVincular = async (unidade_uuid) => {
        try {
            mutationVincularUnidade.mutate({uuid: instanceUUID, unidade_uuid})
            setSelectedUnidades([])
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmarVincularUnidade = (rowData) => {
        const textoModal = textoModalVincularUnidade(rowData);
        ModalConfirm({
            dispatch,
            title: "Confirmação de vinculação",
            children: <>{textoModal}</>,
            cancelText: "Cancelar",
            confirmText: "Confirmar vinculação",
            confirmButtonClass: "btn-success",
            dataQa: "modal-confirmar-vincular-unidade",
            onConfirm: () => handleVincular(rowData.uuid),
        });
    };

    const handleVincularEmLote = async (unidade_uuids) => {
        try {
            mutationVincularUnidadeEmLote.mutate({uuid: instanceUUID, unidade_uuids})
            setSelectedUnidades([]);
        } catch (error) {
            console.error(error);
        }
    };

    const textoModalVincularUnidadeEmLote = (qtde) => {
        const selecao = `${qtde} unidade${qtde === 1 ? "" : "s"} selecionada${qtde === 1 ? "" : "s"}`;
        return <>
            <p style={{fontSize: "14px"}}>
                Você está prestes a vincular <span style={formatStyleTextModal}>{selecao}</span> em <span style={formatStyleTextModal}>{instanceLabel}</span>.
            </p>
            <p>
                Após confirmar, todas as unidades selecionadas terão acesso a ele, deseja prosseguir com a vinculação?
            </p>
        </>
    }

    const handleConfirmarVincularUnidadeEmLote = () => {
        const uuids = selectedUnidades.map((item) => item.uuid);
        const textoModal = textoModalVincularUnidadeEmLote(uuids.length);
        ModalConfirm({
            dispatch,
            title: "Confirmação de vinculação",
            children: <>{textoModal}</>,
            cancelText: "Cancelar",
            confirmText: "Confirmar vinculação",
            confirmButtonClass: "btn-success",
            dataQa: "modal-confirmar-vincular-unidade-em-lote",
            onConfirm: () => handleVincularEmLote(uuids),
        });
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
                <div className="col-12"
                    style={{
                        background: "#00585E",
                        color: "white",
                        padding: "15px",
                        margin: "0px 15px",
                        flex: "100%",
                    }}>
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
                                <a className="float-right"
                                    style={{ textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() => setSelectedUnidades([])}>
                                    <FontAwesomeIcon style={{ color: "white", fontSize: "15px", marginRight: "2px"}}
                                    icon={faTimesCircle}/>
                                    <strong>Cancelar</strong>
                                </a>
                                <div className="float-right" style={{ padding: "0px 10px" }}>
                                    |
                                </div>
                                <a className="float-right"
                                    style={{ textDecoration: "underline", cursor: "pointer" }}
                                    onClick={() => handleConfirmarVincularUnidadeEmLote()}>
                                    <FontAwesomeIcon
                                        style={{ color: "white", fontSize: "15px", marginRight: "2px" }}
                                        icon={faPlusCircle}/>
                                    <strong>Vincular unidades</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
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
                    <FontAwesomeIcon style={{
                        fontSize: "20px",
                        marginRight: 3,
                        color: "#00585e",
                    }}
                    icon={faPlusCircle}
                    />
                }
                />
            </Tooltip>
        );
    };

  return (
    <>
        { header }

        <Filtros
            filtros={filtros}
            onFilterChange={onFilterChange}
            limpaFiltros={limpaFiltros}
            extraButtons={extraButtonFilters}/>

        <div className="my-1">
            <Spin spinning={isLoadingUnidadesNaoVinculadas}>
                <>
                    {selectedUnidades.length ? montarBarraAcoesEmLote() : null}
                    {unidadesNaoVinculadas?.count > 0 ? (
                        <>
                            <p className='mb-2'>
                                Exibindo <span className='total'>{ (unidadesNaoVinculadas?.results||[]).length }</span> de <span className='total'>{ unidadesNaoVinculadas?.count }</span> unidades não vinculadas
                            </p>
                            <DataTable
                                value={unidadesNaoVinculadas?.results}
                                autoLayout={true}
                                selection={selectedUnidades}
                                onSelectionChange={(e) => setSelectedUnidades(e.value)}
                                >
                                <Column selectionMode="multiple" style={{ width: "3em" }} />
                                <Column
                                    field="codigo_eol"
                                    header="Código Eol"
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
                                data={unidadesNaoVinculadas}
                                firstPage={firstPage}
                                rowsPerPage={rowsPerPage}
                                />
                        </>
                        ) : (
                        <MsgImgCentralizada
                            texto={"Use os filtros para localizar a unidade que será vinculada."}
                            img={Img404}
                            width={250}
                            />
                        )
                    }
                </>
            </Spin>
        </div>
    </>
  );
};
