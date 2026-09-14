import React, { useCallback, useMemo, useState } from "react";
import moment from "moment";
import { extraiMensagemDeErro } from "./extraiMensagemDeErro";
import { PaginasContainer } from "../../../paginas/PaginasContainer";
import Img404 from "../../../assets/img/img-404.svg";
import Tabela from "./Tabela";
import { Filtros } from "./Filtros";
import { BtnAdd } from "./BtnAdd";
import ModalForm from "./ModalForm";
import { ModalConfirmarExclusao } from "../Parametrizacoes/componentes/ModalConfirmarExclusao";
import Loading from "../../../utils/Loading";
import { MsgImgCentralizada } from "../../Globais/Mensagens/MsgImgCentralizada";
import { useGetMandatosVacancia } from "./hooks/useGetMandatosVacancia";
import { usePostMandatoVacancia } from "./hooks/usePostMandatoVacancia";
import { usePatchMandatoVacancia } from "./hooks/usePatchMandatoVacancia";
import { useDeleteMandatoVacancia } from "./hooks/useDeleteMandatoVacancia";
import { Paginacao } from './Paginacao'
import { toastCustom } from "../../Globais/ToastCustom";

const initialStateFormModal = {
    referencia_mandato: "",
    data_inicial: "",
    data_final: "",
    editavel: true,
    uuid: "",
    id: "",
    limite_min_data_inicial: null,
};

const initialStateFiltros = {
    filtrar_por_referencia: "",
};

export const MandatosVacancia = () => {
    const [referenciaAplicada, setReferenciaAplicada] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(0);
    const { isLoading, data } = useGetMandatosVacancia(referenciaAplicada, currentPage);
    const listaDeMandatos = data?.results;

    const { mutationPost } = usePostMandatoVacancia();
    const { mutationPatch } = usePatchMandatoVacancia();
    const { mutationDelete } = useDeleteMandatoVacancia();

    const totalDeMandatos = useMemo(() => (listaDeMandatos || []).length, [listaDeMandatos]);

    // Filtros
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const handleSubmitFiltros = useCallback(() => {
        setReferenciaAplicada(stateFiltros.filtrar_por_referencia || undefined);
        setCurrentPage(1);
        setFirstPage(0);
    }, [stateFiltros]);

    const limpaFiltros = useCallback(() => {
        setStateFiltros(initialStateFiltros);
        setReferenciaAplicada(undefined);
        setCurrentPage(1);
        setFirstPage(0);
    }, []);

    const onPageChange = useCallback((page, first) => {
        setCurrentPage(page);
        setFirstPage(first);
    }, []);

    // Modal de formulário
    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const handleEditFormModal = useCallback((rowData) => {
        setStateFormModal({
            ...initialStateFormModal,
            referencia_mandato: rowData.referencia_mandato,
            data_inicial: rowData.data_inicial,
            data_final: rowData.data_final,
            editavel: rowData.editavel,
            uuid: rowData.uuid,
            id: rowData.id,
            limite_min_data_inicial: rowData.limite_min_data_inicial,
        });
        setShowModalForm(true);
    }, []);

    const handleSubmitModalForm = useCallback(async (values) => {
        const payload = {
            referencia_mandato: values.referencia_mandato,
            data_inicial: values.data_inicial ? moment(values.data_inicial).format("YYYY-MM-DD") : values.data_inicial,
            data_final: values.data_final ? moment(values.data_final).format("YYYY-MM-DD") : values.data_final,
        };

        const tituloErro = values.uuid ? "Alteração não permitida" : "Inclusão não permitida";

        if (!values.uuid) {
            mutationPost.mutate({ payload }, {
                onSuccess: () => setShowModalForm(false),
                onError: (error) => {
                    toastCustom.ToastCustomError(tituloErro, extraiMensagemDeErro(error));
                },
            });
        } else {
            mutationPatch.mutate({ uuidMandato: values.uuid, payload }, {
                onSuccess: () => setShowModalForm(false),
                onError: (error) => {
                    toastCustom.ToastCustomError(tituloErro, extraiMensagemDeErro(error));
                },
            });
        }
    }, [mutationPost, mutationPatch]);

    const onDeleteTrue = useCallback(async () => {
        setShowModalConfirmDelete(false);
        mutationDelete.mutate({ uuid: stateFormModal.uuid }, {
            onSuccess: () => {
                setShowModalForm(false);
                setCurrentPage(1);
                setFirstPage(0);
            },
            onError: (error) => {
                toastCustom.ToastCustomError(
                    "Não foi possível excluir o período de mandato",
                    extraiMensagemDeErro(error)
                );
            },
        });
    }, [stateFormModal, mutationDelete]);

    const handleCloseFormModal = useCallback(() => {
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false);
    }, []);

    return (
        <PaginasContainer>
            <div className="MandatosVacancia" data-qa="pagina-mandatos-vacancia">

                <h1 className="titulo-itens-painel mt-5">Período de mandato</h1>
                {isLoading ? (
                    <div className="mt-5">
                        <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0" />
                    </div>
                ) : (
                    <>
                        <div className="page-content-inner">
                            <BtnAdd
                                setShowModalForm={setShowModalForm}
                                initialStateFormModal={initialStateFormModal}
                                setStateFormModal={setStateFormModal}
                            />
                            <Filtros
                                stateFiltros={stateFiltros}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleSubmitFiltros}
                                limpaFiltros={limpaFiltros}
                            />
                            {(listaDeMandatos || []).length ? (
                                <>
                                    <p>
                                        Exibindo <span className="total-acoes">{totalDeMandatos}</span> de <span className="total-acoes">{data.count}</span> período(s) de mandato
                                    </p>
                                    <Tabela
                                        lista={listaDeMandatos}
                                        handleEditFormModal={handleEditFormModal}
                                    />
                                    <Paginacao
                                        count={data.count}
                                        firstPage={firstPage}
                                        onPageChange={onPageChange}
                                    />
                                </>
                            ) : (
                                <MsgImgCentralizada
                                    data-qa="imagem-lista-sem-mandatos-vacancia"
                                    texto="Nenhum resultado encontrado."
                                    img={Img404}
                                    dataQa=""
                                />
                            )}
                        </div>
                        <section>
                            <ModalForm
                                show={showModalForm}
                                stateFormModal={stateFormModal}
                                handleClose={handleCloseFormModal}
                                handleSubmitModalForm={handleSubmitModalForm}
                                setShowModalConfirmDelete={setShowModalConfirmDelete}
                            />
                        </section>
                        <section>
                            <ModalConfirmarExclusao
                                open={showModalConfirmDelete}
                                onOk={onDeleteTrue}
                                okText="Excluir"
                                onCancel={() => setShowModalConfirmDelete(false)}
                                cancelText="Cancelar"
                                cancelButtonProps={{ className: "btn-base-verde-outline" }}
                                titulo="Excluir período de mandato"
                                bodyText={<p>Tem certeza que deseja excluir esse período de mandato?</p>}
                            />
                        </section>
                    </>
                )}
            </div>
        </PaginasContainer>
    );
};
