import React, { useContext } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { usePostMotivoRejeicao } from "../hooks/usePostMotivoRejeicao";
import { usePatchMotivoRejeicao } from "../hooks/usePatchMotivoRejeicao";
import ReactTooltip from "react-tooltip";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../../../utils/Loading";
import {ModalForm} from "./ModalForm";
import { ModalConfirmacaoExclusao } from "./ModalConfirmacaoExclusao";
import { useDeleteMotivoRejeicao } from "../hooks/useDeleteMotivoRejeicao";

export const Lista = () => {

    const { setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm } = useContext(MotivosRejeicaoContext)
    const { isLoading, data } = useGetMotivosRejeicao()
    const { mutationPost } = usePostMotivoRejeicao()
    const { mutationPatch } = usePatchMotivoRejeicao()
    const { mutationDelete } = useDeleteMotivoRejeicao()

    // Necessária pela paginação
    const {results} = data
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleEditFormModal(rowData)}>
                    <span data-tip="Editar motivo" data-html={true}>
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

    const handleEditFormModal = (rowData) => {
        setStateFormModal({
            ...stateFormModal,
            nome: rowData.nome,
            uuid: rowData.uuid,
            id: rowData.id,
        });
        setShowModalForm(true)
    };

    const handleSubmitFormModal = async (values) => {
        // Libera o botão somente após ter resolvido a mutation em usePostMotivoRejeicao e usePatchMotivoRejeicao
        setBloquearBtnSalvarForm(true)
        let payload = {
            nome: values.nome,
        };

        if (!values.uuid) {
            mutationPost.mutate({payload: payload})
        } else {
            mutationPatch.mutate({uuidMotivoRejeicao: values.uuid, payload: payload})
        }
    };

    const handleExcluirMotivo = async (uuid) => {
        if (!uuid) {
            console.log("Erro ao tentar excluir o motivo.")
        } else {
            mutationDelete.mutate(uuid)
        }
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
                    <div className="p-2">
                        <DataTable
                            value={results}
                            className='tabela-lista-motivos-rejeicao'
                        >
                            <Column
                                field="nome"
                                header="Motivo"
                            />
                            <Column
                                field="acao"
                                header="Ação"
                                body={acoesTemplate}
                                style={{width: '10%', textAlign: "center",}}
                            />
                        </DataTable>
                    </div>
                ) :
                <div className="p-2">
                    <p><strong>Nenhum resultado encontrado.</strong></p>
                </div>
            }
            <section>
                <ModalForm
                    handleSubmitFormModal={handleSubmitFormModal}
                />
            </section>
            <section>
                <ModalConfirmacaoExclusao
                    handleExcluirMotivo={handleExcluirMotivo}
                />
            </section>
        </>
    )
}