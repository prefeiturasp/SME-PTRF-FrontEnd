import React, { useContext, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { faEdit, faTimesCircle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MateriaisServicosContext } from "../context/MateriaisServicos";

import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { usePatch } from "../hooks/usePatch";
import { useDelete } from "../hooks/useDelete";

import { Tooltip as ReactTooltip } from "react-tooltip";
import Loading from "../../../../../../utils/Loading";
import { ModalForm } from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";


export const Lista = () => {

    const { setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm } = useContext(MateriaisServicosContext)
    const { isLoading, data, count } = useGet()

    const { mutationPost } = usePost();
    const { mutationPatch } = usePatch();
    const { mutationDelete } = useDelete();

    // Necessária pela paginação
    const {results} = data

    const handleEditFormModal = (rowData) => {

        setStateFormModal({
            ...stateFormModal,
            uuid: rowData.uuid,
            descricao: rowData.descricao,
            aplicacao_recurso: rowData.aplicacao_recurso,
            tipo_custeio: rowData.tipo_custeio ?? '', // ?? '' para evitar erro de mensagem de validação Yup, assume string vazia quando null
            ativa: rowData.ativa,
            id: rowData.id,
        });
        setShowModalForm(true)
    };

    const handleSubmitFormModal = async (values) => {
        setBloquearBtnSalvarForm(true)
        let payload = {
            descricao: values.descricao,
            aplicacao_recurso: values.aplicacao_recurso,
            tipo_custeio: values.tipo_custeio ?? null, // assume null quando string é vazia
            ativa: values.ativa,
        };

        if(!values.uuid){
            mutationPost.mutate({payload: payload})
        }
        else{
            mutationPatch.mutate({uuid: values.uuid, payload: payload})
        }
    };

    const handleExcluir = async (uuid) => {
        if (!uuid) {
            console.log(`Erro ao tentar excluir a especificação.`)
        } else {
            mutationDelete.mutate(uuid)
        }
    }

    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-especificacoes btn-editar-membro" onClick={() => handleEditFormModal(rowData)}>
                    <span data-tooltip-content="Editar" data-html={true}>
                        <FontAwesomeIcon
                            style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                            icon={faEdit}
                        />
                        <ReactTooltip/>
                    </span>
                </button>
            </div>
        )
    };

    const statusTemplate = (rowData) => {
        return booleanTemplate(rowData.ativa)
    }

    const booleanTemplate = (value) => {
        const opcoes = {
            true: {icone: faCheckCircle, cor: "#297805", texto: "Sim"},
            false: {icone: faTimesCircle, cor: "#B40C02", texto: "Não"}
        }
        const iconeData = opcoes[value]
        const estiloFlag = {fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: iconeData.cor}
        return (
            <div style={estiloFlag}>
                <FontAwesomeIcon
                    style={{fontSize: '16px', marginRight: "5px", color: iconeData.cor}}
                    icon={iconeData.icone}/>
            </div>
        )
    }

    const aplicacaoTemplate = (rowData) => {
        switch (rowData.aplicacao_recurso) {
            case 'CUSTEIO':
                return 'Custeio'
            case 'CAPITAL':
                return 'Capital'
            default:
                return '-'
        }
    }

    const tipoCusteioTemplate = (rowData) => {
        return rowData.tipo_custeio_objeto?.nome ?? '--'
    }

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }
    return (
        <>
            {results && results.length > 0 ? (
                <>
                    <p className='mb-0'>Exibindo <span className='total'>{ count }</span> especificações de materiais e serviços</p>
                    <div className="mt-2">
                        <DataTable
                            value={ results }
                            className='tabela-listagem'
                            autoLayout={true}>
                            <Column field="descricao" header="Descrição" />
                            <Column field="aplicacao_recurso" header="Tipo de aplicação de recurso" body={aplicacaoTemplate} style={{width: '150px'}}/>
                            <Column field="tipo_custeio_objeto.nome" header="Tipo custeio" body={tipoCusteioTemplate} style={{width: '15%'}}/>
                            <Column field="ativa" header="Ativa" body={statusTemplate}/>
                            <Column
                                field="acao"
                                header="Ações"
                                body={acoesTemplate}
                                style={{width: '10%', textAlign: "center",}}
                            />
                        </DataTable>
                    </div>
                </>)
            :
                <div className="p-2">
                    <p><strong>Nenhum resultado encontrado.</strong></p>
                </div>
            }

            <section>
                <ModalForm handleSubmitFormModal={handleSubmitFormModal}/>
            </section>

            <section>
                <ModalConfirmacaoExclusao handleExcluir={handleExcluir}/>
            </section>
        </>
    )
}
