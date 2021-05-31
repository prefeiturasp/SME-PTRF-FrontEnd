import React, {useEffect, useState} from "react";

import "../../associacoes.scss"

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash, faPlus} from "@fortawesome/free-solid-svg-icons";

import Img404 from "../../../../../assets/img/img-404.svg";
import Loading from "../../../../../utils/Loading";
import {MsgImgLadoDireito} from "../../../../Globais/Mensagens/MsgImgLadoDireito";

import {getProcessosAssociacao} from "../../../../../services/dres/Associacoes.service";
import {
    updateProcessoAssociacao,
    createProcessoAssociacao,
    deleteProcessoAssociacao
} from "../../../../../services/dres/ProcessosAssociacao.service";

import {ProcessoSeiPrestacaoDeContaForm} from "./ProcessoSeiPrestacaoDeContaForm";
import {ConfirmaDeleteProcesso} from "./ConfirmaDeleteProcessoDialog";
import {visoesService} from "../../../../../services/visoes.service";

export const ProcessosSeiPrestacaoDeContas = ({dadosDaAssociacao}) => {

    const rowsPerPage = 7;

    const initProcessoForm = {
        uuid: "",
        numero_processo: "",
        ano: "",
    };

    const [loading, setLoading] = useState(true);

    const [stateProcessoForm, setStateProcessoForm] = useState(initProcessoForm);

    const [associacaoUuid, setAssociacaoUuid] = useState(dadosDaAssociacao.dados_da_associacao.uuid);

    const [processosList, setProcessosList] = useState([]);

    const [showProcessoForm, setShowProcessoForm] = useState(false);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const carregaProcessos = async () => {
        let processos = await getProcessosAssociacao(associacaoUuid);
        setProcessosList(processos)
    };

    const deleteProcesso = async () => {
        setLoading(true);
        if (stateProcessoForm.uuid) {
            try {
                const response = await deleteProcessoAssociacao(stateProcessoForm.uuid);
                if (response.status === 204) {
                    console.log("Operação realizada com sucesso!");
                    await carregaProcessos();
                } else {
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
        const initFormProcesso = {
            uuid: processo.uuid,
            numero_processo: processo.numero_processo,
            ano: processo.ano,
        };
        setShowProcessoForm(true);
        setStateProcessoForm(initFormProcesso)
    };

    const handleDeleteProcessoAction = (processo) => {
        const initFormProcesso = {
            uuid: processo.uuid,
            numero_processo: processo.numero_processo,
            ano: processo.ano,
        };
        setStateProcessoForm(initFormProcesso);
        setShowConfirmDelete(true);
    };

    const handleCloseProcessoForm = () => {
        setShowProcessoForm(false);
    };

    const handleSubmitProcessoForm = async () => {
        setLoading(true);
        setShowProcessoForm(false);
        const payload = {
            'associacao': associacaoUuid,
            'numero_processo': stateProcessoForm.numero_processo,
            'ano': stateProcessoForm.ano
        };

        if (stateProcessoForm.uuid) {
            try {
                const response = await updateProcessoAssociacao(stateProcessoForm.uuid, payload);
                if (response.status === 200) {
                    console.log("Processo atualizado com sucesso!");
                    await carregaProcessos();
                } else {
                    console.log("Erro ao atualizar Processo")
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const response = await createProcessoAssociacao(payload);
                if (response.status === 201) {
                    console.log("Processo criado com sucesso!");
                    await carregaProcessos();
                } else {
                    console.log("Erro ao criar Processo")
                }
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    };

    const handleChangesInProcessoForm = (name, value) => {
        setStateProcessoForm({
            ...stateProcessoForm,
            [name]: value
        });
    };

    const validateProcessoForm = async (values) => {
        const errors = {};
        return errors
    };


    const handleDeleteConfirmation = () => {
        setShowConfirmDelete(false);
        deleteProcesso();
    };

    const closeConfirmDeleteDialog = () => {
        setShowConfirmDelete(false);
    };

    const tableActionsTemplate = (rowData, column) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleEditProcessoAction(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0"}}
                        icon={faEdit}
                    />
                </button>
                <button disabled={!visoesService.getPermissoes(['change_processo_sei'])} className="btn-editar-membro" onClick={() => handleDeleteProcessoAction(rowData)}>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "red"}}
                        icon={faTrash}
                    />
                </button>
            </div>
        )
    };

    useEffect(() => {
        carregaProcessos()
        setLoading(false)
    }, []);

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
                                onSubmit={handleSubmitProcessoForm}
                                handleChange={handleChangesInProcessoForm}
                                validateForm={validateProcessoForm}
                                initialValues={stateProcessoForm}
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