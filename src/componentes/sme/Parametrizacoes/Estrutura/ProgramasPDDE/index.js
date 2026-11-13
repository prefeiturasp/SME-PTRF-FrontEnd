import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { IconButton } from "../../../../Globais/UI/Button/IconButton";
import Loading from "../../../../../utils/Loading";
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";
import { MenuInterno } from "../../../../Globais/MenuInterno";
import { ModalConfirmarExclusao as ModalConfirmar } from "../../componentes/ModalConfirmarExclusao";
import Img404 from "../../../../../assets/img/img-404.svg"
import { UrlsMenuInterno } from "../AcoesPDDE/UrlsMenuInterno";
import { useProgramasPDDE, initialStateFiltros, rowsPerPage } from "./hooks/useProgramasPDDE";
import { Filtros } from "./Filtros";
import Tabela from "./Tabela";
import ModalForm from "./ModalForm";
import { Paginacao } from "./Paginacao";

export const ProgramasPDDE = () => {
    const {
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        modalForm,
        stateFiltros,
        isLoading,
        programas,
        firstPage,
        setCurrentPage,
        setFirstPage,
        showModalConfirmDelete,
        setShowModalConfirmDelete,
        handleOpenCreateModal,
        handleOpenModalForm,
        handleClose,
        handleSubmitFormModal,
        handleDelete,
        handleSubmitFiltros,
        limpaFiltros,
    } = useProgramasPDDE();

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações PDDE</h1>
            <div className="page-content-inner pb-0">
                <MenuInterno caminhos_menu_interno={UrlsMenuInterno}/>
            </div>
            <div className="page-content-inner">
                <div className="d-flex justify-content-end pb-4 mt-2">
                    <IconButton
                        icon="faPlus"
                        iconProps={{ style: {fontSize: '15px', marginRight: "5", color: "#fff"} }}
                        label="Adicionar Programa"
                        onClick={handleOpenCreateModal}
                        variant="success"
                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                    />
                </div>

                <Filtros
                    stateFiltros={stateFiltros}
                    initialStateFiltros={initialStateFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                />

                {isLoading ? (
                    <div className="mt-5">
                        <Loading corGrafico="black" corFonte="dark" marginTop="0" marginBottom="0"/>
                    </div>
                ) : programas.count > 0 ? (
                    <Tabela data={programas} handleOpenModalForm={handleOpenModalForm}/>
                ) : (
                    <MsgImgCentralizada
                        texto="Nenhum resultado encontrado."
                        img={Img404}
                        dataQa="imagem-lista-sem-programas-pdde"
                    />
                )}

                <Paginacao
                    programas={programas}
                    rowsPerPage={rowsPerPage}
                    setCurrentPage={setCurrentPage}
                    firstPage={firstPage}
                    setFirstPage={setFirstPage}
                    isLoading={isLoading}
                />

                <ModalForm
                    show={modalForm.open}
                    stateFormModal={modalForm}
                    onHandleClose={handleClose}
                    onSubmit={handleSubmitFormModal}
                    setShowModalConfirmDelete={setShowModalConfirmDelete}
                    temPermissaoEdicao={TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                />

                <ModalConfirmar
                    open={showModalConfirmDelete}
                    onOk={() => {
                        setShowModalConfirmDelete(false);
                        handleDelete(modalForm.uuid);
                    }}
                    okText="Excluir"
                    okButtonProps={{className: "btn-danger"}}
                    onCancel={() => setShowModalConfirmDelete(false)}
                    cancelText="Cancelar"
                    cancelButtonProps={{className: "btn-base-verde-outline"}}
                    titulo="Excluir Programa"
                    bodyText={<p>Tem certeza que deseja excluir esse Programa?</p>}
                />
            </div>
        </PaginasContainer>
    );
};
