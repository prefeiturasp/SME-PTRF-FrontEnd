import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg";
import ModalForm from "./ModalForm";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useGetMotivosEstorno } from "../hooks/useGetMotivosEstorno";
import { usePostMotivoEstorno } from "../hooks/usePostMotivoEstorno";
import { usePatchMotivoEstorno } from "../hooks/usePatchMotivoEstorno";
import { useDeleteMotivoEstorno } from "../hooks/useDeleteMotivoEstorno";
import Loading from "../../../../../../utils/Loading";
import { toastCustom } from "../../../../../Globais/ToastCustom";

export const Lista = () => {
    const {
        stateFormModal,
        setStateFormModal,
        rowsPerPage,
        showModalConfirmacaoExclusao,
        handleCloseModalConfirmacaoExclusao,
    } = useMotivosEstornoContext();

    const { isLoading, data: results, count } = useGetMotivosEstorno();

    const { mutationPost } = usePostMotivoEstorno();
    const { mutationPatch } = usePatchMotivoEstorno();
    const { mutationDelete } = useDeleteMotivoEstorno();

    const acoesTemplate = (rowData) => {
        return (
            <div className="d-flex justify-content-center">
                <EditIconButton
                    onClick={() => handleEditFormModal(rowData)}
                    data-testid="btn-editar-motivos-estorno"
                />
            </div>
        );
    };

    const handleEditFormModal = (rowData) => {
        setStateFormModal({
            ...stateFormModal,
            motivo: rowData.motivo,
            uuid: rowData.uuid,
            id: rowData.id,
            isOpen: true,
            recurso_uuid: rowData?.recurso,
        });
    };

    const handleSubmitFormModal = async (values) => {
        let payload = {
            motivo: values.motivo,
            recurso: values.recurso_uuid,
        };

        if (values.uuid) {
            mutationPatch.mutate({
                uuidMotivoEstorno: values.uuid,
                payload: payload,
            });
        } else {
            mutationPost.mutate({ payload: payload });
        }
    };

    const handleExcluirMotivo = async (uuid) => {
        if (!uuid) {
            toastCustom.ToastCustomError(
                "Erro ao apagar o motivo de estorno",
                "Informe os campos corretamente e tente novamente.",
            );
        }

        mutationDelete.mutate(uuid);
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
        <>
            <div className="mt-3">
                {results && results.length > 0 ? (
                    <DataTable
                        value={results}
                        className="mt-3 container-tabela-associacoes"
                        paginator={count > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        autoLayout={true}
                        selectionMode="single"
                    >
                        <Column field="motivo" header="Motivo" />
                        <Column
                            field="acoes"
                            header="Ações"
                            body={acoesTemplate}
                            style={{ width: "10%", textAlign: "center" }}
                        />
                    </DataTable>
                ) : (
                    <MsgImgCentralizada
                        data-qa="imagem-lista-contas-de-associacoes-vazia"
                        texto="Nenhum resultado encontrado."
                        img={Img404}
                    />
                )}
            </div>

            <ModalForm handleSubmitFormModal={handleSubmitFormModal} />

            <ModalConfirmarExclusao
                open={showModalConfirmacaoExclusao.is_open}
                onOk={() => {
                    handleExcluirMotivo(
                        showModalConfirmacaoExclusao.motivo_uuid,
                    );
                    handleCloseModalConfirmacaoExclusao();
                }}
                okText="Excluir"
                onCancel={() => handleCloseModalConfirmacaoExclusao()}
                cancelText="Cancelar"
                titulo="Excluir Motivo"
                bodyText="Deseja realmente excluir este motivo de estorno?"
            />
        </>
    );
};
