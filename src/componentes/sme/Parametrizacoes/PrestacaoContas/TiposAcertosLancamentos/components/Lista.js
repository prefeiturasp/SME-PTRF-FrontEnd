import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { useGetAcertosLancamentos } from "../hooks/useGetAcertosLancamentos";
import { usePostAcertosLancamentos } from "../hooks/usePostAcertosLancamentos";
import { usePatchAcertosLancamentos } from "../hooks/usePatchAcertosLancamentos";
import { useDeleteAcertosLancamentos } from "../hooks/useDeleteAcertosLancamentos";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { MsgImgCentralizada } from "../../../../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../../../../assets/img/img-404.svg"

export const Lista = () => {
    const { 
        setShowModalForm, 
        stateFormModal, 
        setStateFormModal, 
        setBloquearBtnSalvarForm,
        showModalForm,
        showModalConfirmacaoExclusao,
        setShowModalConfirmacaoExclusao,
        tabelas,
        initialStateFormModal
    } = useContext(AcertosLancamentosContext);

    const { isLoading, data = [] } = useGetAcertosLancamentos();
    const { mutationPost } = usePostAcertosLancamentos();
    const { mutationPatch } = usePatchAcertosLancamentos();
    const { mutationDelete } = useDeleteAcertosLancamentos();

    const { categorias } = tabelas || { categorias: [] };

    const rowsPerPage = 10;

    const categoriaTemplate = (rowData) => {
        const categoria = categorias.find(cat => cat.id === rowData.categoria);
        return categoria ? categoria.nome : rowData.categoria;
    };

    const ativoTemplate = (rowData) => {
        return rowData.ativo ? "Sim" : "Não";
    };

    const editLancamentosTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleEditarLancamentos(rowData)}
            />
        );
    };

    const handleEditarLancamentos = (rowData) => {
        setStateFormModal({
            uuid: rowData.uuid,
            id: rowData.id,
            recurso: rowData.recurso,
            nome: rowData.nome,
            categoria: rowData.categoria,
            ativo: rowData.ativo,
            pode_alterar_saldo_conciliacao: rowData.pode_alterar_saldo_conciliacao,
            operacao: "edit",
        });
        setShowModalForm(true)
    };

    const onHandleClose = () => {
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false);
    };

    const handleSubmitModalForm = async (formData) => {
        setBloquearBtnSalvarForm(true);
        
        const payload = {
            nome: formData.nome,
            categoria: formData.categoria,
            ativo: formData.ativo,
            pode_alterar_saldo_conciliacao: formData.pode_alterar_saldo_conciliacao
        };

        if (formData.operacao === "create") {
            mutationPost.mutate({ payload });
        } else {
            mutationPatch.mutate({ uuid: formData.uuid, payload });
        }
    };

    const handleDeleteLancamento = () => {
        setShowModalConfirmacaoExclusao(true);
    };

    const onConfirmDelete = () => {
        mutationDelete.mutate(stateFormModal.uuid);
        setShowModalConfirmacaoExclusao(false);
    };

    return (
        <>
            {isLoading ? (
                <div className="mt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                </div>
            ) : data.length > 0 ? (
                <>
                    <p>
                        Exibindo{" "}
                        <span className="total">{data.length}</span>{" "}
                        tipos de acertos em lançamentos
                    </p>
                    <DataTable
                        value={data}
                        paginator={data.length > rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        rows={rowsPerPage}
                    >
                        <Column field="nome" header="Nome do tipo"/>
                        <Column 
                            field="categoria"
                            header="Categoria de acerto"
                            body={categoriaTemplate}
                        />
                        <Column 
                            style={{width: '15%'}}
                            field="ativo"
                            header="Ativo"
                            className="text-center"
                            body={ativoTemplate}/>
                        <Column
                            style={{width: '10%'}}
                            field="acoes"
                            header="Ações"
                            className="text-center"
                            body={editLancamentosTemplate}
                        />
                    </DataTable>
                </>
            ) : (
                <MsgImgCentralizada
                    texto='Não há lançamentos'
                    img={Img404}
                />
            )}

            <ModalForm
                show={showModalForm}
                handleClose={onHandleClose}
                handleSubmit={handleSubmitModalForm}
                stateFormModal={stateFormModal}
                categoriaTabela={categorias}
                onDelete={handleDeleteLancamento}
            />

            <ModalConfirmacaoExclusao
                open={showModalConfirmacaoExclusao}
                onOk={onConfirmDelete}
                onCancel={() => setShowModalConfirmacaoExclusao(false)}
            />
        </>
    );
}
