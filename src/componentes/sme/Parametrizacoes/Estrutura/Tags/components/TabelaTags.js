import React, { memo, useCallback } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Loading from "../../../../../../utils/Loading";
import { EditIconButton } from "../../../../../Globais/UI/Button";
import { useTagsContext } from "../hooks/useTagsContext";
import { ModalConfirmarExclusao } from "../../../componentes/ModalConfirmarExclusao";
import { TotalRegistros } from "../../../componentes/TotalRegistros";

const TabelaTags = () => {
    const { 
        results,
        handleOpenModalForm,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        showModalConfirmDeleteTag,
        handleDelete,
        handleCloseModalConfirmDeleteTag,
        isLoading
    } = useTagsContext();

    const statusTemplate = useCallback((rowData) => {
        return rowData.status && rowData.status === 'ATIVO' ? 'Ativo' : 'Inativo'
    }, []);

    const rowsPerPage = 10;

    const acoesTemplate = useCallback((rowData) => {
        return (
            <EditIconButton
                onClick={() => handleOpenModalForm(rowData)}
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        )
    }, [handleOpenModalForm, TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES]);

    return (
        <>
            { isLoading ? (
                <div className="mt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                </div>
            ) : (
                <>
                    <TotalRegistros
                        total_registros={results?.length}
                        titulo="Etiqueta(s)/Tag(s)"
                    />
                    <DataTable
                        value={results}
                        rows={rowsPerPage}
                        paginator={(results || []).length > rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                    >
                        <Column field="nome" header="Nome" />
                        <Column
                            field="status"
                            header="Status"
                            body={statusTemplate}
                        />
                        <Column
                            field="acoes"
                            header="Ações"
                            body={acoesTemplate}
                            style={{ width: '100px' }}
                        />
                    </DataTable>
                </>
            )}
    
            <ModalConfirmarExclusao
                open={showModalConfirmDeleteTag.open}
                onOk={() => {
                    handleDelete(showModalConfirmDeleteTag.tag_uuid)
                    handleCloseModalConfirmDeleteTag()
                }}
                okText="Excluir"
                onCancel={() => handleCloseModalConfirmDeleteTag()}
                cancelText="Cancelar"
                titulo="Excluir etiqueta/tag"
                bodyText="Deseja realmente excluir esta etiqueta/tag?"
            />
        </>
    );
};
export default memo(TabelaTags)

