import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getTodosPeriodos, getFiltrosPeriodos, getDatasAtendemRegras, getPeriodoPorUuid, postCriarPeriodo, patchUpdatePeriodo, deletePeriodo} from "../../../../../services/sme/Parametrizacoes.service";
import TabelaPeriodos from "./TabelaPeriodos";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye, faPlus} from "@fortawesome/free-solid-svg-icons";
import ModalFormPeriodos from "./ModalFormPeriodos";
import {ModalConfirmDeletePeriodo} from "./ModalConfirmDeletePeriodo";
import {Filtros} from "./Filtros";
import {BtnAddPeriodos} from "./BtnAddPeriodoss";
import {ModalInfoExclusaoNaoPermitida} from "./ModalInfoExclusaoNaoPermitida";

export const Periodos = () =>{

    const [count, setCount] = useState(0);
    const [listaDePeriodos, setListaDePeriodos] = useState([]);

    const carregaTodosPeriodos =  useCallback( async ()=>{
        let periodos = await getTodosPeriodos();
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

    const handleSubmitFiltros = async () => {
        let periodos_filtrados = await getFiltrosPeriodos(stateFiltros.filtrar_por_referencia);
        setListaDePeriodos(periodos_filtrados);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaTodosPeriodos();
    };

    // TabelaPeriodos
    const rowsPerPage = 20;

    const dataTemplate = useCallback((rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : ''}
            </div>
        )
    }, []);

    // Modal
    const initialStateFormModal = {
        referencia: "",
        data_prevista_repasse: "",
        data_inicio_realizacao_despesas: "",
        data_fim_realizacao_despesas: "",
        data_inicio_prestacao_contas: "",
        data_fim_prestacao_contas: "",
        editavel:true,
        uuid:"",
        id:"",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [showModalConfirmDeletePeriodo, setShowModalConfirmDeletePeriodo] = useState(false);
    const [showModalInfoExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [erroDatasAtendemRegras, setErroDatasAtendemRegras] = useState(false);
    const [erroExclusaoNaoPermitida, setErroExclusaoNaoPermitida] = useState(false);

    const handleEditFormModalPeriodos = useCallback( async (rowData) =>{
        let periodo_por_uuid = await getPeriodoPorUuid(rowData.uuid);

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
            id: periodo_por_uuid.id,
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
        setErroDatasAtendemRegras(false);
        setStateFormModal(initialStateFormModal);
        setShowModalForm(false)
    }, [initialStateFormModal]);

    const handleCloseConfirmDeletePeriodo = useCallback(()=>{
        setShowModalConfirmDeletePeriodo(false)
    }, []);

    const handleCloseModalInfoExclusaoNaoPermitida = useCallback(()=>{
        setShowModalInfoExclusaoNaoPermitida(false);
        setErroExclusaoNaoPermitida(false);
        setShowModalConfirmDeletePeriodo(false)
    }, []);


    const salvarPeriodo = useCallback(async (payload, operacao, _periodo_uuid)=>{

        if (operacao === 'create'){
            try {
                await postCriarPeriodo(payload);
                console.log("Pedido criado com sucesso!");
                await carregaTodosPeriodos();
            }catch (e) {
                console.log("Erro ao Criar Pedido ", e)
            }
        }else{
            try {
                await patchUpdatePeriodo(_periodo_uuid, payload);
                console.log("Pedido atualizado com sucesso!");
                await carregaTodosPeriodos();
            }catch (e) {
                console.log("Erro ao Atualizar Pedido ", e)
            }
        }
    }, [carregaTodosPeriodos]);

    const handleSubmitModalFormPeriodos = useCallback(async (values)=>{

        let _periodo_uuid = values.uuid ? values.uuid : '';
        let _referencia = values.referencia;
        let _data_prevista_repasse = values.data_prevista_repasse ? moment(values.data_prevista_repasse).format("YYYY-MM-DD") : null;
        let _data_inicio_realizacao_despesas = values.data_inicio_realizacao_despesas ? moment(values.data_inicio_realizacao_despesas).format("YYYY-MM-DD") : null;
        let _data_fim_realizacao_despesas = values.data_fim_realizacao_despesas ? moment(values.data_fim_realizacao_despesas).format("YYYY-MM-DD") : null;
        let _data_inicio_prestacao_contas = values.data_inicio_prestacao_contas ? moment(values.data_inicio_prestacao_contas).format("YYYY-MM-DD") : null;
        let _data_fim_prestacao_contas = values.data_fim_prestacao_contas ? moment(values.data_fim_prestacao_contas).format("YYYY-MM-DD") : null;
        let _periodo_anterior_uuid = values.periodo_anterior ? values.periodo_anterior : '';

        let datas_atendem = await getDatasAtendemRegras(_data_inicio_realizacao_despesas, _data_fim_realizacao_despesas, _periodo_anterior_uuid, _periodo_uuid);

        if (!datas_atendem.valido){
            setErroDatasAtendemRegras(datas_atendem.mensagem)
        }else {
            setErroDatasAtendemRegras(false);
            setShowModalForm(false);

            const payload = {
                referencia: _referencia,
                data_prevista_repasse: _data_prevista_repasse,
                data_inicio_realizacao_despesas: _data_inicio_realizacao_despesas,
                data_fim_realizacao_despesas: _data_fim_realizacao_despesas,
                data_inicio_prestacao_contas: _data_inicio_prestacao_contas,
                data_fim_prestacao_contas: _data_fim_prestacao_contas,
                periodo_anterior: _periodo_anterior_uuid,
            };
            salvarPeriodo(payload, values.operacao, _periodo_uuid)
        }
    }, [salvarPeriodo]);

    const onDeletePeriodoTrue = useCallback(async ()=>{
        try {
            let delete_periodo = await deletePeriodo(stateFormModal.uuid);
            console.log("DELETE PERIODO ", delete_periodo);
            console.log("Período excluído com sucesso");
        }catch (e) {
            console.log("Erro ao excluir período ", e.response);
            if (e.response.data && e.response.data.mensagem){
                setErroExclusaoNaoPermitida(e.response.data.mensagem)
                setShowModalInfoExclusaoNaoPermitida(true)
            }
        }
    }, [stateFormModal]);


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
                <button onClick={()=>setCount(prevState => prevState+1)}>Botão Sem Use Calback - {count}</button>
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
        </PaginasContainer>
    );
};