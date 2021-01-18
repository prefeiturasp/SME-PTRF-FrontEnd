import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodosPeriodos} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaPeriodos from "./TabelaPeriodos";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye} from "@fortawesome/free-solid-svg-icons";
import ModalFormPeriodos from "./ModalFormPeriodos";
import {ModalFormAcoesDaAssociacao} from "../AcoesDasAssociacoes/ModalFormAcoesDasAssociacoes";

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

    // TabelaPeriodos
    const rowsPerPage = 20;

    const initialStateFormModal = {
        referencia: "",
        data_inicio_realizacao_despesas: "",
        data_fim_realizacao_despesas: "",
        data_inicio_prestacao_contas: "",
        data_fim_prestacao_contas: "",
        data_prevista_repasse: "",
        operacao: 'create',
        editavel:"",
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
        console.log("handleEditFormModalPeriodos ", rowData)
        setStateFormModal({
            ...stateFormModal,
            referencia: rowData.referencia,
            data_inicio_realizacao_despesas: rowData.data_inicio_realizacao_despesas,
            data_fim_realizacao_despesas: rowData.data_inicio_realizacao_despesas,
            data_inicio_prestacao_contas: rowData.data_inicio_realizacao_despesas,
            data_fim_prestacao_contas: rowData.data_inicio_realizacao_despesas,
            data_prevista_repasse: rowData.data_inicio_realizacao_despesas,
            editavel: rowData.editavel,
            operacao: 'create',
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
        setShowModalForm(false)
    }, []);

    const handleSubmitModalFormPeriodos = useCallback(()=>{
        setShowModalForm(false)
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Períodos</h1>
            <div className="page-content-inner">
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
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
                        handleClose={handleCloseFormModal}
                        handleSubmitModalFormPeriodos={handleSubmitModalFormPeriodos}
                        stateFormModal={stateFormModal}
                    />
                </section>
            </div>
        </PaginasContainer>
    );
};