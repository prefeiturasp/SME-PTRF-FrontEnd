import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ModalFormPeriodos from "./ModalFormPeriodos";
import { Filtros } from "./Filtros";
import Tabela from "./Tabela";
import Loading from "../../../../../utils/Loading";
import { usePeriodos } from "./hooks/usePeriodos";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { ModalConfirmarExclusao } from "../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";

export const Periodos = () => {
    const {
        modalForm,
        showModalConfirmDeletePeriodo,
        erroDatasAtendemRegras,
        stateFiltros,
        isLoading,
        results,
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
        setErroDatasAtendemRegras,
        handleCloseModalConfirmDeletePeriodo,
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

                <Filtros
                    stateFiltros={stateFiltros}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                />

                
                <AbasPorRecurso
                    handleChangeFiltros={handleChangeFiltros}
                />

                <Tabela 
                    rowsPerPage={10} 
                    data={results}
                    handleOpenModalForm={handleOpenModalForm}
                    handleOpenCreateModal={handleOpenCreateModal}
                    tem_permissao_edicao_painel_parametrizacoes={TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                />

                <ModalFormPeriodos
                    show={modalForm.open}
                    stateFormModal={modalForm}
                    onHandleClose={handleClose}
                    onSubmit={handleSubmitFormModal}
                    deveValidarPeriodoAnterior={results.length > 1 ? true : false}
                    periodos={results}
                    setErroDatasAtendemRegras={setErroDatasAtendemRegras}
                    erroDatasAtendemRegras={erroDatasAtendemRegras}
                    setShowModalConfirmDeletePeriodo={setShowModalConfirmDeletePeriodo}
                />

                <ModalConfirmarExclusao
                    open={showModalConfirmDeletePeriodo.open}
                    onOk={()=> {
                        handleDelete(showModalConfirmDeletePeriodo.periodo_uuid)
                        handleCloseModalConfirmDeletePeriodo()
                    }}
                    okText="Excluir"
                    onCancel={() => handleCloseModalConfirmDeletePeriodo()}
                    cancelText="Cancelar"
                    titulo="Excluir Período"
                    bodyText="Deseja realmente excluir este período?"
                />
            </div>
            )}
        </PaginasContainer>
    )
}