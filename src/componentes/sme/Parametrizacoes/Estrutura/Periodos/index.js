import React from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ModalFormPeriodos from "./ModalFormPeriodos";
import { Filtros } from "./Filtros";
import Tabela from "./Tabela";
import { IconButton } from "../../../../Globais/UI";
import Loading from "../../../../../utils/Loading";
import { ModalBootstrap } from "../../../../Globais/ModalBootstrap";
import { usePeriodos } from "./hooks/usePeriodos";

export const Periodos = ()=>{
    const {
        modalForm,
        showModalConfirmDeletePeriodo,
        showModalInfoExclusaoNaoPermitida,
        erroDatasAtendemRegras,
        erroExclusaoNaoPermitida,
        stateFiltros,
        isLoading,
        results,
        count,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES,
        handleOpenCreateModal,
        handleClose,
        handleOpenModalForm,
        handleDelete,
        handleSubmitFormModal,
        handleChangeFiltros,
        handleSubmitFiltros,
        limpaFiltros,
        setShowModalConfirmDeletePeriodo,
        setShowModalInfoExclusaoNaoPermitida,
        setErroDatasAtendemRegras
    } = usePeriodos();

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Períodos</h1>
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
                        label="Adicionar período"
                        onClick={handleOpenCreateModal}
                        variant="success"
                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                    />
                </div>

                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                />

                <Tabela 
                    rowsPerPage={20} 
                    data={results} 
                    count={count}
                    handleOpenModalForm={handleOpenModalForm}
                />

                <ModalFormPeriodos
                    show={modalForm.open}
                    stateFormModal={modalForm}
                    onHandleClose={handleClose}
                    onSubmit={handleSubmitFormModal}
                    deveValidarPeriodoAnterior={results.length > 0 ? true : false}
                    periodos={results}
                    setErroDatasAtendemRegras={setErroDatasAtendemRegras}
                    erroDatasAtendemRegras={erroDatasAtendemRegras}
                    setShowModalConfirmDeletePeriodo={setShowModalConfirmDeletePeriodo}
                />

                <ModalBootstrap
                    show={showModalConfirmDeletePeriodo}
                    onHide={() => setShowModalConfirmDeletePeriodo(false)}
                    primeiroBotaoOnclick={() => setShowModalConfirmDeletePeriodo(false)}
                    segundoBotaoOnclick={()=> {
                        setShowModalConfirmDeletePeriodo(false)
                        handleDelete(modalForm.uuid)
                    }}
                    titulo="Excluir Período"
                    bodyText="<p>Deseja realmente excluir este período?</p>"
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="danger"
                    segundoBotaoTexto="Excluir"
                />

                <ModalBootstrap
                    show={showModalInfoExclusaoNaoPermitida}
                    onHide={() => setShowModalInfoExclusaoNaoPermitida(false)}
                    titulo="Exclusão não permitida"
                    bodyText={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                    primeiroBotaoOnclick={() => setShowModalInfoExclusaoNaoPermitida(false)}
                />
            </div>
            )}
        </PaginasContainer>
    )
}