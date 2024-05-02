import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import "../../associacoes.scss"
import {DeleteFilled} from '@ant-design/icons';
import {Button, Tooltip} from 'antd';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";

import Img404 from "../../../../../assets/img/img-404.svg";
import Loading from "../../../../../utils/Loading";
import {MsgImgLadoDireito} from "../../../../Globais/Mensagens/MsgImgLadoDireito";

import {getProcessosAssociacao} from "../../../../../services/dres/Associacoes.service";
import {
    createProcessoAssociacao,
    deleteProcessoAssociacao,
    getPeriodosDisponiveis,
    updateProcessoAssociacao
} from "../../../../../services/dres/ProcessosAssociacao.service";

import {ProcessoSeiPrestacaoDeContaForm} from "./ProcessoSeiPrestacaoDeContaForm";
import {ConfirmaDeleteProcesso} from "./ConfirmaDeleteProcessoDialog";
import {visoesService} from "../../../../../services/visoes.service";
import {ModalConfirm} from "../../../../Globais/Modal/ModalConfirm";
import {toastCustom} from "../../../../Globais/ToastCustom";

export const ProcessosSeiPrestacaoDeContas = ({dadosDaAssociacao}) => {
    const dispatch = useDispatch();

    const rowsPerPage = 7;

    const initProcessoForm = {
        uuid: "",
        numero_processo: "",
        ano: "",
        periodos: [],
    };

    const [loading, setLoading] = useState(true);

    const [stateProcessoForm, setStateProcessoForm] = useState(initProcessoForm);

    const [processosList, setProcessosList] = useState([]);

    const [periodosDisponiveis, setPeriodosDisponiveis] = useState([]);

    const [showProcessoForm, setShowProcessoForm] = useState(false);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [customNumeroProcessoError, setCustomNumeroProcessoError] = useState('');

    const associacaoUuid = dadosDaAssociacao.dados_da_associacao.uuid;

    const [loadingPeriodos, setLoadingPeriodos] = useState(false);

    const carregaProcessos = async () => {
        let processos = await getProcessosAssociacao(associacaoUuid);
        setProcessosList(processos)
    };

    useEffect(() => {
        carregaProcessos()
        setLoading(false)
    }, []);

    const carregaPeriodosDisponiveis = async () => {
        let periodosDisponiveis = await getPeriodosDisponiveis(associacaoUuid, stateProcessoForm.ano, stateProcessoForm.uuid)
        setPeriodosDisponiveis(periodosDisponiveis)
        setLoadingPeriodos(false);
    }

    useEffect(() => {
        if (associacaoUuid && stateProcessoForm && stateProcessoForm.ano && stateProcessoForm.ano.replaceAll("_","").length >= 4){
            carregaPeriodosDisponiveis()
        }
    }, [associacaoUuid, stateProcessoForm]);

    const deleteProcesso = async () => {
        setLoading(true);
        if (stateProcessoForm.uuid) {
            try {
                const response = await deleteProcessoAssociacao(stateProcessoForm.uuid);
                if (response.status === 204) {
                    toastCustom.ToastCustomSuccess('Exclusão de Processo SEI', `Processo SEI excluído com sucesso.`)
                    console.log("Operação realizada com sucesso!");
                    await carregaProcessos();
                } else {
                    toastCustom.ToastCustomError('Exclusão de Processo SEI', `Erro ao excluir Processo SEI.`)
                    console.log("Erro ao excluir Processo")
                }
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)

    };

    const handleAddProcessoAction = () => {
        setStateProcessoForm(initProcessoForm);
        setShowProcessoForm(true);
    };

    const handleEditProcessoAction = (processo) => {
        setLoadingPeriodos(true);
        let lista_uuids_periodos = []
        for(let i=0; i<=processo.periodos.length-1; i++){
            lista_uuids_periodos.push(processo.periodos[i].uuid)
        }

        const initFormProcesso = {
            uuid: processo.uuid,
            numero_processo: processo.numero_processo,
            ano: processo.ano,
            periodos: lista_uuids_periodos,
        };
        setShowProcessoForm(true);
        setStateProcessoForm(initFormProcesso);
    };

    const handleDeleteProcessoAction = (processo) => {
        const initFormProcesso = {
            uuid: processo.uuid,
            numero_processo: processo.numero_processo,
            ano: processo.ano,
            periodos: processo.periodos,
        };
        setStateProcessoForm(initFormProcesso);
        setShowConfirmDelete(true);
    };

    const handleCloseProcessoForm = () => {
        setCustomNumeroProcessoError(false);
        setShowProcessoForm(false);
    };

    const handleSubmitProcesso = async () => {
        setLoading(true);
        setCustomNumeroProcessoError('');
        let payload
        if (visoesService.featureFlagAtiva('periodos-processo-sei')){
            payload = {
                'associacao': associacaoUuid,
                'numero_processo': stateProcessoForm.numero_processo,
                'ano': stateProcessoForm.ano,
                'periodos': stateProcessoForm.periodos
            };
        }else {
            payload = {
                'associacao': associacaoUuid,
                'numero_processo': stateProcessoForm.numero_processo,
                'ano': stateProcessoForm.ano,
            };
        }

        if (stateProcessoForm.uuid) {
            try {
                const response = await updateProcessoAssociacao(stateProcessoForm.uuid, payload);
                if (response.status === 200) {
                    toastCustom.ToastCustomSuccess('Alteração de Processo SEI', `Processo SEI alterado com sucesso.`)
                    console.log("Processo atualizado com sucesso!");
                    setShowProcessoForm(false);
                    await carregaProcessos();
                } else {
                    toastCustom.ToastCustomError('Alteração de Processo SEI', `Erro ao alterar Processo SEI.`)
                    console.log("Erro ao atualizar Processo")
                    if(response.status === 400 && response.data && response.data.numero_processo) {
                        setCustomNumeroProcessoError(response.data.numero_processo[0]);
                    } else {
                        setShowProcessoForm(false);
                    }
                }
            } catch (error) {
                console.log(error)
                setShowProcessoForm(false);
            }
        } else {
            try {
                const response = await createProcessoAssociacao(payload);
                if (response.status === 201) {
                    toastCustom.ToastCustomSuccess('Inclusão de Processo SEI', `Processo SEI adicionado com sucesso.`)
                    console.log("Processo criado com sucesso!");
                    setShowProcessoForm(false);
                    await carregaProcessos();
                } else {
                    toastCustom.ToastCustomError('Processo SEI já cadastrado', `Esse processo SEI já foi cadastrado em uma unidade educacional.`)
                    console.log("Erro ao criar Processo")
                    if(response.status === 400 && response.data && response.data.numero_processo) {
                        setCustomNumeroProcessoError(response.data.numero_processo[0]);
                    } else {
                        setShowProcessoForm(false);
                    }
                }
            } catch (error) {
                console.log(error)
                setShowProcessoForm(false);
            }
        }
        setLoading(false)
    };

    const handleConfirmSubmitProcessoForm = async (values) => {
        if(values.uuid){
            ModalConfirm({
                dispatch,
                title: 'Atenção!',
                message: 'A alteração desse número do processo SEI será exibida em todas as prestações de contas a ele vinculadas.',
                cancelText: 'Cancelar',
                confirmText: 'Confirmar',
                dataQa: 'modal-confirmar-salvar-processo-SEI',
                onConfirm: () => handleSubmitProcesso()
            })
        } else {
            handleSubmitProcesso()
        }
    };

    const handleChangesInProcessoForm = async (name, value) => {
        // Limpando o campo Período quando alterar o campo Ano
        if (name ==='ano'){

            let lista_uuids_periodos_pre_selecao = []

            if (associacaoUuid && value && value.replaceAll("_","").length >= 4){
                let periodosDisponiveis = await getPeriodosDisponiveis(associacaoUuid, value, stateProcessoForm.uuid)
                for(let i= 0; i<= periodosDisponiveis.length-1; i++){
                    lista_uuids_periodos_pre_selecao.push(periodosDisponiveis[i].uuid)
                }
            }
            setStateProcessoForm({
                ...stateProcessoForm,
                [name]: value,
                periodos: lista_uuids_periodos_pre_selecao
            });
        }else {
            setStateProcessoForm({
                ...stateProcessoForm,
                [name]: value
            });
        }

    };

    const handleChangeSelectPeriodos =  async (value) => {
        let name = "periodos"

        setStateProcessoForm({
            ...stateProcessoForm,
            [name]: value
        });
    }

    const validateProcessoForm = async () => {
        return {}
    };


    const handleDeleteConfirmation = () => {
        setShowConfirmDelete(false);
        deleteProcesso();
    };

    const closeConfirmDeleteDialog = () => {
        setShowConfirmDelete(false);
    };

    const tableActionsTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleEditProcessoAction(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0"}}
                        icon={faEdit}
                    />                   
                </button>
                <Tooltip title={rowData.permite_exclusao ? '' : rowData.tooltip_exclusao}>
                    <Button
                        type="text"
                            icon={<DeleteFilled style={{fontSize: '20px'}}/>}
                            disabled={!visoesService.getPermissoes(['change_processo_sei']) || !rowData.permite_exclusao}
                            danger={visoesService.getPermissoes(['change_processo_sei']) && rowData.permite_exclusao}
                            onClick={() => handleDeleteProcessoAction(rowData)}
                    />
                </Tooltip>                
            </div>
        )
    };
    
    const periodosTemplate = (rowData) => {
        if (rowData && rowData.periodos && rowData.periodos.length > 0){
            return(
                rowData.periodos.map((periodo)=>
                    <span key={periodo.uuid} className='span-periodos'>{periodo.referencia}</span>
                )
            )
        }
    }

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                associacaoUuid !== undefined ? (

                    <div>
                        <div className="row">
                            <div className="col-10">
                                <label><strong>Processos SEI de prestação de contas</strong></label>
                            </div>
                            <div className="col-2">
                                <button className="link-green float-right btn-sem-borda-fundo" onClick={visoesService.getPermissoes(['change_processo_sei']) ? () => handleAddProcessoAction() : null}>
                                    <FontAwesomeIcon
                                        style={{fontSize: '15px', marginRight: "0"}}
                                        icon={faPlus}
                                    />
                                    <strong> adicionar</strong>
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {processosList.length > 0 ? (<DataTable
                                        value={processosList}
                                        className="mt-3 datatable-footer-coad"
                                        paginator={processosList.length > rowsPerPage}
                                        rows={rowsPerPage}
                                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                                        autoLayout={true}
                                        selectionMode="single"
                                    >
                                        <Column field='numero_processo' header='Número do processo'/>
                                        <Column field='ano' header='Ano'/>
                                        {visoesService.featureFlagAtiva('periodos-processo-sei') &&
                                            <Column
                                                field='periodos'
                                                header='Períodos'
                                                body={periodosTemplate}
                                            />
                                        }
                                        <Column body={tableActionsTemplate} style={{textAlign: 'center', width: '8em'}}/>
                                    </DataTable>)
                                    : (
                                        <MsgImgLadoDireito
                                            texto='Não há nenhum processo cadastrado ainda, clique em "+adicionar" para incluir um.'
                                            img={Img404}
                                        />
                                    )
                                }
                            </div>

                        </div>

                        <section>
                            <ProcessoSeiPrestacaoDeContaForm
                                show={showProcessoForm}
                                handleClose={handleCloseProcessoForm}
                                onSubmit={handleConfirmSubmitProcessoForm}
                                handleChange={handleChangesInProcessoForm}
                                handleChangeSelectPeriodos={handleChangeSelectPeriodos}
                                validateForm={validateProcessoForm}
                                initialValues={stateProcessoForm}
                                periodosDisponiveis={periodosDisponiveis}
                                customNumeroProcessoError={customNumeroProcessoError}
                                setCustomNumeroProcessoError={setCustomNumeroProcessoError}
                                loadingPeriodos={loadingPeriodos}
                            />
                        </section>

                        <section>
                            <ConfirmaDeleteProcesso
                                show={showConfirmDelete}
                                onCancelDelete={closeConfirmDeleteDialog}
                                onConfirmDelete={handleDeleteConfirmation}
                            />
                        </section>
                    </div>
                ) : null}
        </>
    );
};