import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodosPeriodos} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaPeriodos from "./TabelaPeriodos";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalFormPeriodos from "./ModalFormPeriodos";
import {Filtros} from "./Filtros";
import {BtnAddPeriodos} from "./BtnAddPeriodoss";

export const Periodos = () =>{

    const [count, setCount] = useState(0);
    const [listaDePeriodos, setListaDePeriodos] = useState([]);

    const carregaTodosPeriodos =  useCallback( async ()=>{
        let periodos = await getTodosPeriodos();
        console.log('carregaTodosPeriodos ', periodos);
        setListaDePeriodos(periodos);
    }, []);

    useEffect(()=>{
        carregaTodosPeriodos();
    }, [carregaTodosPeriodos]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDePeriodos = useMemo(() => listaDePeriodos.length, [listaDePeriodos]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_referencia: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = useCallback(async () => {

    }, []);

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodosPeriodos();
    };

    // TabelaPeriodos
    const rowsPerPage = 20;

    const initialStateFormModal = {
        referencia: "",
        data_prevista_repasse: "",
        data_inicio_realizacao_despesas: "",
        data_fim_realizacao_despesas: "",
        data_inicio_prestacao_contas: "",
        data_fim_prestacao_contas: "",
        editavel:"",
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);

    const dataTemplate = useCallback((rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : ''}
            </div>
        )
    }, []);

    const handleEditFormModalPeriodos = useCallback( async (rowData) =>{
        console.log("handleEditFormModalPeriodos ", rowData);
        setStateFormModal({
            ...stateFormModal,
            referencia: rowData.referencia,
            data_prevista_repasse: rowData.data_prevista_repasse,
            data_inicio_realizacao_despesas: rowData.data_inicio_realizacao_despesas,
            data_fim_realizacao_despesas: rowData.data_fim_realizacao_despesas,
            data_inicio_prestacao_contas: rowData.data_inicio_prestacao_contas,
            data_fim_prestacao_contas: rowData.data_fim_prestacao_contas,
            periodo_anterior: rowData.periodo_anterior && rowData.periodo_anterior.uuid ? rowData.periodo_anterior.uuid : null,
            editavel: rowData.editavel,
            uuid: rowData.uuid,
            id:"Não é retornado pela API",
            operacao: 'edit',
        });
        setShowModalForm(true)
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) =>{
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModalPeriodos(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                        icon={rowData.editavel ? faEdit : faEye}
                    />
                </button>
            </div>
        )
    }, [handleEditFormModalPeriodos]);

    const handleCloseFormModal = useCallback(()=>{
        console.log('handleCloseFormModal');
        setShowModalForm(false)
    }, []);

    const handleSubmitModalFormPeriodos = useCallback((values)=>{
        setShowModalForm(false);
        console.log("handleSubmitModalFormPeriodos ", values)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Períodos</h1>
            <div className="page-content-inner">
                <BtnAddPeriodos
                    FontAwesomeIcon={FontAwesomeIcon}
                    faPlus={faPlus}
                    setShowModalForm={setShowModalForm}
                    initialStateFormModal={initialStateFormModal}
                    setStateFormModal={setStateFormModal}
                />
                {/*<button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>*/}
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
                    />
                </section>
            </div>
        </PaginasContainer>
    );
};