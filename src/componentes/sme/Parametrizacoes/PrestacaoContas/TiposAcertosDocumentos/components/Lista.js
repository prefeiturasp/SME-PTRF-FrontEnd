import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { useGetAcertosDocumentos } from "../hooks/useGetAcertosDocumentos";
import { usePostAcertosDocumentos } from "../hooks/usePostAcertosDocumentos";
import { usePatchAcertosDocumentos } from "../hooks/usePatchAcertosDocumentos";
import { useDeleteAcertosDocumentos } from "../hooks/useDeleteAcertosDocumentos";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";
import { EditIconButton } from "../../../../../Globais/UI/Button";

export const Lista = () => {
    const { 
        setShowModalForm, 
        stateFormModal, 
        setStateFormModal, 
        setBloquearBtnSalvarForm,
        showModalForm,
        showModalConfirmacaoExclusao,
        setShowModalConfirmacaoExclusao,
        setShowModalInfoNaoPodeGravar,
        setShowModalInfoNaoPodeExcluir,
        tabelas
    } = useContext(AcertosDocumentosContext);

    const { selectedRecurso } = useAbasPorRecursoContext();

    const { isLoading, data = [], totalAcertos } = useGetAcertosDocumentos();
    const { mutationPost } = usePostAcertosDocumentos();
    const { mutationPatch } = usePatchAcertosDocumentos();
    const { mutationDelete } = useDeleteAcertosDocumentos();

    const { categorias, documentos } = tabelas || { categorias: [], documentos: [] };

    const rowsPerPage = 10;

    const categoriaTemplate = (rowData) => {
        const categoria = categorias.find(cat => cat.id === rowData.categoria);
        return categoria ? categoria.nome : rowData.categoria;
    };

    const documentoTemplate = (rowData) => {
        let listDocumentos = []
        if (rowData) {
            rowData.tipos_documento_prestacao.forEach(element => {
                listDocumentos.push(element.nome)
            })
            return listDocumentos.map(item => <p style={{ 'textAlign': 'start' }} key={item}>{item}</p>)
        }
    };

    const ativoTemplate = (rowData) => {
        return rowData.ativo ? "Sim" : "Não";
    };

    const editDocumentosTemplate = (rowData) => {
        return (
            <EditIconButton
                onClick={() => handleEditarDocumentos(rowData)}
            />
        );
    };

    const handleEditarDocumentos = (rowData) => {
        setStateFormModal({
            uuid: rowData.uuid,
            id: rowData.id,
            recurso: rowData.recurso,
            nome: rowData.nome,
            categoria: rowData.categoria,
            tipos_documento_prestacao: rowData.tipos_documento_prestacao.map(v => v.id),
            ativo: rowData.ativo,
            pode_alterar_saldo_conciliacao: rowData.pode_alterar_saldo_conciliacao,
            operacao: "edit",
        });
        setShowModalForm(true)
    };

    const onHandleClose = () => {
        setStateFormModal({
            uuid: '',
            id: '',
            recurso: selectedRecurso?.uuid || '',
            nome: "",
            categoria: "",
            tipos_documento_prestacao: [],
            ativo: false,
            pode_alterar_saldo_conciliacao: false,
            operacao: 'create',
        });
        setShowModalForm(false);
    };

    const handleSubmitFormModal = async (values) => {
        setBloquearBtnSalvarForm(true);

        const payload = {
            nome: values.nome,
            categoria: values.categoria,
            tipos_documento_prestacao: values.tipos_documento_prestacao,
            ativo: values.ativo,
            pode_alterar_saldo_conciliacao: values.pode_alterar_saldo_conciliacao,
            recurso: values.recurso
        };

        if (payload.tipos_documento_prestacao.includes('all')) {
            payload.tipos_documento_prestacao = documentos.map(item => item.id)
        }

        if (values.operacao === 'create') {
            mutationPost.mutate({ payload });
        } else if (values.operacao === 'edit') {
            mutationPatch.mutate({ uuid: values.uuid, payload });
        }

        onHandleClose();
    };

    const handleServiceCrudDocumentos = () => {
        mutationDelete.mutate(stateFormModal.uuid);
        setShowModalConfirmacaoExclusao(false);
        onHandleClose();
    };

    const handleShowModalExcluir = () => {
        setShowModalConfirmacaoExclusao(true);
    };

    const handleCloseModalExcluir = () => {
        setShowModalConfirmacaoExclusao(false);
    };

    const handleCloseInfoNaoPodeGravar = () => {
        setShowModalInfoNaoPodeGravar(false);
    };

    const handleCloseInfoNaoPodeExcluir = () => {
        setShowModalInfoNaoPodeExcluir(false);
    };

    return (
        <>
            {/* <p>
                Exibindo <span className="total">{totalAcertos}</span> tipos de acertos em documentos
            </p> */}

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
                <DataTable
                    value={data}
                    paginator={data.length > rowsPerPage}
                    paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    rows={rowsPerPage}
                >
                    <Column field="nome" header="Nome do tipo" />
                    <Column 
                        field="categoria"
                        header="Categoria de acerto"
                        body={categoriaTemplate}
                    />
                    <Column 
                        field="tipos_documento_prestacao"
                        header="Tipo de documento de prestação"
                        body={documentoTemplate}
                    />
                    <Column 
                        field="ativo"
                        header="Ativo"
                        body={ativoTemplate}
                    />
                    <Column 
                        field="uuid"
                        header="Ações"
                        body={editDocumentosTemplate}
                        style={{ width: '5%', textAlign: 'center' }}
                    />
                </DataTable>
            ) : (
                <div className="p-2">
                    <p><strong>Nenhum resultado encontrado.</strong></p>
                </div>
            )}

            <ModalForm
                show={showModalForm}
                handleClose={onHandleClose}
                stateFormModal={stateFormModal}
                handleSubmitModalFormDocumentos={handleSubmitFormModal}
                serviceCrudDocumentos={handleServiceCrudDocumentos}
                handleShowModalExcluir={handleShowModalExcluir}
                categoriaTabela={categorias}
                documentoTabela={documentos}
            />

            <ModalConfirmacaoExclusao
                open={showModalConfirmacaoExclusao}
                onCancel={handleCloseModalExcluir}
                onOk={handleServiceCrudDocumentos}
                titulo="Excluir tipo de acerto em documento"
                bodyText="Deseja realmente excluir esse tipo de acerto em documento?"
            />
        </>
    );
};
