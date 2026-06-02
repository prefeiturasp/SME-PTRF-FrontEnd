import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import Loading from "../../../../../utils/Loading";
import TabelaTiposConta from "./TabelaTiposConta";
import {Filtros} from "./Filtros";
import ModalAddEditTipoConta from "./ModalAddEditTipoConta";

import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { ModalConfirmarExclusao } from "../../../../../componentes/Globais/ModalAntDesign/ModalConfirmarExclusao";
import { useTiposContas } from "./hooks/useTiposdeContas";
import { TopoComBotoes } from "./TopoComBotoes";

export const TiposConta = () => {

    const {
        draftFiltros, 
        handleChangeFiltros, 
        handleSubmitFiltros, 
        handleLimparFiltros, 
        rowsPerPage,
        acoesTemplate, 
        handleOpenCreateModal, 
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES, 
        showModalForm, 
        stateFormModal, 
        handleCloseFormModal, 
        handleSubmitModalFormTiposConta, 
        setShowModalConfirmDeleteTipoConta, 
        showModalConfirmDeleteTipoConta, 
        onDeleteTipoContaTrue, 
        handleCloseConfirmDeleteTipoConta,
        results,
        isLoading
    } = useTiposContas();

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Tipos de conta</h1>
            {isLoading ? (
                <div className="mt-5">
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                </div>
            ) :
            <>
                <div className="page-content-inner">
                    <AbasPorRecurso />

                    <TopoComBotoes
                        handleOpenCreateModal={handleOpenCreateModal}
                        tem_permissao_edicao_painel_parametrizacoes={TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                    />
                    
                    <Filtros
                        stateFiltros={draftFiltros}
                        handleChangeFiltros={handleChangeFiltros}
                        handleSubmitFiltros={handleSubmitFiltros}
                        handleLimparFiltros={handleLimparFiltros}
                    />

                    <TabelaTiposConta
                        rowsPerPage={rowsPerPage}
                        listaDeTiposContas={results}
                        acoesTemplate={acoesTemplate}
                    />
                </div>
                <section>
                    <ModalAddEditTipoConta
                        show={showModalForm}
                        stateFormModal={stateFormModal}
                        handleClose={handleCloseFormModal}
                        handleSubmitModalFormTiposConta={handleSubmitModalFormTiposConta}
                        setShowModalConfirmDeleteTipoConta={setShowModalConfirmDeleteTipoConta}
                    />
                </section>
                <section>
                    <ModalConfirmarExclusao 
                        open={showModalConfirmDeleteTipoConta}
                        onOk={() => {
                            onDeleteTipoContaTrue();
                            handleCloseConfirmDeleteTipoConta();
                        }}
                        okText="Excluir"
                        onCancel={handleCloseConfirmDeleteTipoConta}
                        cancelText="Cancelar"
                        titulo="Excluir Tipo de Conta"
                        bodyText="Deseja realmente excluir este tipo de conta?"
                    />
                </section>
            </>
            }
        </PaginasContainer>
    )
};