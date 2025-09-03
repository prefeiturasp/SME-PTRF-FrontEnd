import React, {useContext} from "react";
import {useDispatch} from "react-redux";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faEye} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {useGetMandatos} from "../hooks/useGetMandatos";
import Loading from "../../../../utils/Loading";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {MandatosContext} from "../context/Mandatos";
import {ModalForm} from "./ModalForm";
import {usePostMandato} from "../hooks/usePostMandato";
import moment from "moment/moment";
import {ModalInfo} from "./ModalInfo";
import {usePatchMandato} from "../hooks/usePatchMandato";
import {useDeleteMandato} from "../hooks/useDeleteMandato";
import {ModalConfirm} from "../../../Globais/Modal/ModalConfirm";

export const Lista = () => {
    const dispatch = useDispatch();

    const {setShowModalForm, stateFormModal, setStateFormModal, setBloquearBtnSalvarForm, forceLoading} = useContext(MandatosContext)
    const {isLoading, data} = useGetMandatos()
    const {mutationPost} = usePostMandato()
    const {mutationPatch} = usePatchMandato()
    const {mutationDelete} = useDeleteMandato()

    // Necessária pela paginação
    const {results} = data
    const dataTemplate = useDataTemplate()
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={() => handleEditFormModal(rowData)}>
                    {rowData && rowData.editavel ? (
                        <div data-tooltip-content="Editar mandato" data-html={true}>
                            <FontAwesomeIcon
                                style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                                icon={faEdit}
                            />
                            <ReactTooltip/>
                        </div>
                    ) : (
                        <div data-tooltip-content="Visualizar mandato" data-html={true}>
                            <FontAwesomeIcon
                                style={{fontSize: '20px', marginRight: "0", color: "#00585E"}}
                                icon={faEye}
                            />
                            <ReactTooltip/>
                        </div>
                    )}
                </button>
           </div>
        )
    };

    const handleEditFormModal = (rowData) => {
        setStateFormModal({
            ...stateFormModal,
            referencia: rowData.referencia_mandato,
            data_inicial: rowData.data_inicial,
            data_final: rowData.data_final,
            editavel: rowData.editavel,
            data_inicial_proximo_mandato: rowData.data_inicial_proximo_mandato,
            uuid: rowData.uuid,
            id: rowData.id,
            limite_min_data_inicial: rowData.limite_min_data_inicial
        });
        setShowModalForm(true)
    };

    const handleSubmitFormModal = async (values) => {
        // Libera o botão somente após ter resolvido a mutation em usePostMandato e usePatchMandato
        setBloquearBtnSalvarForm(true)
        let payload = {
            referencia_mandato: values.referencia,
            data_inicial: moment(values.data_inicial).format('YYYY-MM-DD'),
            data_final: moment(values.data_final).format('YYYY-MM-DD'),
        };

        if (!values.uuid) {
            mutationPost.mutate({payload: payload})
        } else {
            mutationPatch.mutate({uuidMandato: values.uuid, payload: payload})
        }
    };

    const handleConfirmDeleteMandato = (uuid) => {
        ModalConfirm({
            dispatch,
            title: 'Tem certeza que deseja deletar período de mandato?',
            message: 'Essa ação não poderá ser desfeita.',
            onConfirm: () => mutationDelete.mutate({uuid})
        })
    };

    if (isLoading || forceLoading) {
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
                            className='tabela-lista-usuarios'
                        >
                            <Column
                                field="referencia_mandato"
                                header="Referencia Mandato"
                            />
                            <Column
                                field="data_inicial"
                                header="Data inicial"
                                body={dataTemplate}
                            />
                            <Column
                                field="data_final"
                                header="Data Final"
                                body={dataTemplate}
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
                    handleConfirmDeleteMandato={handleConfirmDeleteMandato}
                />
                <ModalInfo/>
            </section>
        </>
    )
}