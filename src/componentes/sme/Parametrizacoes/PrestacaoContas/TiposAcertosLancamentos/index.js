import React, {} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";


export const ParametrizacoesTiposAcertosLancamentos = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Tipos de Acertos Lançamentos</h1>
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                <div className="page-content-inner">
                    <BtnAddPeriodos
                        FontAwesomeIcon={FontAwesomeIcon}
                        faPlus={faPlus}
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
                    <p>Exibindo <span className='total-acoes'>{totalDePeriodos}</span> períodos</p>
                    <TabelaPeriodos
                        rowsPerPage={rowsPerPage}
                        listaDePeriodos={listaDePeriodos}
                        acoesTemplate={acoesTemplate}
                        dataTemplate={dataTemplate}
                        handleEditFormModalPeriodos={handleEditFormModalPeriodos}
                    />
                    <section>
                        <ModalFormPeriodos
                            show={showModalForm}
                            stateFormModal={stateFormModal}
                            handleClose={handleCloseFormModal}
                            handleSubmitModalFormPeriodos={handleSubmitModalFormPeriodos}
                            listaDePeriodos={listaDePeriodos}
                            setErroDatasAtendemRegras={setErroDatasAtendemRegras}
                            erroDatasAtendemRegras={erroDatasAtendemRegras}
                            setShowModalConfirmDeletePeriodo={setShowModalConfirmDeletePeriodo}
                        />
                    </section>
                    <section>
                        <ModalConfirmDeletePeriodo
                            show={showModalConfirmDeletePeriodo}
                            handleClose={handleCloseConfirmDeletePeriodo}
                            onDeletePeriodoTrue={onDeletePeriodoTrue}
                            titulo="Excluir Período"
                            texto="<p>Deseja realmente excluir este período?</p>"
                            primeiroBotaoTexto="Cancelar"
                            primeiroBotaoCss="outline-success"
                            segundoBotaoCss="danger"
                            segundoBotaoTexto="Excluir"
                        />
                    </section>
                    <section>
                        <ModalInfoExclusaoNaoPermitida
                            show={showModalInfoExclusaoNaoPermitida}
                            handleClose={handleCloseModalInfoExclusaoNaoPermitida}
                            titulo="Exclusão não permitida"
                            texto={`<p class="mb-0"> ${erroExclusaoNaoPermitida}</p>`}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="success"
                        />
                    </section>
                </div>
            }
        </PaginasContainer>
    )
};