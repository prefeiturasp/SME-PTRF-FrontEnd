import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ModalForm from "./ModalForm";
import { Filtros } from "./Filtros";
import Tabela from "./Tabela";
import { IconButton } from "../../../../Globais/UI";
import Loading from "../../../../../utils/Loading";
import { ModalBootstrap } from "../../../../Globais/ModalBootstrap";
import { useAcoesPDDE } from "./hooks/useAcoesPDDE";
import { Paginacao } from "./Paginacao"
import {ModalConfirmarExclusao as ModalConfirmar} from "../../componentes/ModalConfirmarExclusao";
import Img404 from "../../../../../assets/img/img-404.svg"
import { MsgImgCentralizada } from "../../../../Globais/Mensagens/MsgImgCentralizada";

export const AcoesPDDE = ()=>{
    const {
        modalForm,
        setModalForm,
        showModalConfirmDelete,
        showModalInfoExclusaoNaoPermitida,
        erroExclusaoNaoPermitida,
        stateFiltros,
        initialStateFiltros,
        isLoading,
        categorias,
        acoes,
        currentPage,
        firstPage,
        setCurrentPage,
        setFirstPage,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal,
        handleClose,
        handleOpenModalForm,
        handleDelete,
        handleDeleteCategoria,
        handleSubmitFormModal,
        handleSubmitFiltros,
        limpaFiltros,
        setShowModalConfirmDelete,
        setShowModalInfoExclusaoNaoPermitida,
    } = useAcoesPDDE();

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Ações PDDE</h1>
            {isLoading ? (
                <div className="mt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                </div>
            ) : (
                <div className="page-content-inner">

                <div className="d-flex  justify-content-end pb-4 mt-2">
                    <IconButton
                        icon="faPlus"
                        iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                        label="Adicionar Ação PDDE"
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
                    categorias={categorias}
                />

                { acoes.count > 0 ?
                    <>
                    <Tabela
                        rowsPerPage={20}
                        data={acoes}
                        handleOpenModalForm={handleOpenModalForm}
                    />
                    </>
                    :
                    <MsgImgCentralizada
                        data-qa="imagem-lista-sem-acoes-pdde"
                        texto='Nenhum resultado encontrado.'
                        img={Img404}
                        dataQa=""
                    />
                }

                <ModalForm
                    show={modalForm.open}
                    stateFormModal={modalForm}
                    onHandleClose={handleClose}
                    onSubmit={handleSubmitFormModal}
                    categorias={categorias}
                    setShowModalConfirmDelete={setShowModalConfirmDelete}
                    setModalForm={setModalForm}
                />

                {/* Modal de Exclusão de Ação PDDE */}
                <ModalConfirmar
                    open={showModalConfirmDelete}
                    onOk={()=> {
                        setShowModalConfirmDelete(false)
                        handleDelete(modalForm.uuid)
                    }}
                    okText="Excluir"
                    okButtonProps={{className: "btn-danger"}}
                    onCancel={() => setShowModalConfirmDelete(false)}
                    cancelText="Cancelar"
                    cancelButtonProps={{className: "btn-base-verde-outline"}}
                    titulo="Excluir Ação PDDE"
                    bodyText={<p>Tem certeza que deseja excluir essa Ação PDDE?</p>}
                />

                <ModalBootstrap
                    show={showModalInfoExclusaoNaoPermitida}
                    // onHide={() => setShowModalInfoExclusaoNaoPermitida(false)}
                    titulo="Exclusão não permitida"
                    bodyText={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                    primeiroBotaoOnclick={() => setShowModalInfoExclusaoNaoPermitida(false)}
                />
                <Paginacao
                    acoes={acoes}
                    setCurrentPage={setCurrentPage}
                    firstPage={firstPage}
                    setFirstPage={setFirstPage}
                    isLoading={isLoading}
                />
            </div>
            )}
        </PaginasContainer>
    )
}