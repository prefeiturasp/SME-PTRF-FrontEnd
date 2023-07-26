import React, {useContext} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import {useGetMandatos} from "../hooks/useGetMandatos";
import Loading from "../../../../utils/Loading";
import useDataTemplate from "../../../../hooks/Globais/useDataTemplate";
import {MandatosContext} from "../context/Mandatos";
import {ModalForm} from "./ModalForm";
import {usePostMandato} from "../hooks/usePostMandato";
import moment from "moment/moment";
import {ModalInfo} from "./ModalInfo";
import {usePatchMandato} from "../hooks/usePatchMandato";

export const Lista = () => {

    const {setShowModalForm, stateFormModal, setStateFormModal} = useContext(MandatosContext)
    const {isLoading, data} = useGetMandatos()
    const {mutationPost} = usePostMandato()
    const {mutationPatch} = usePatchMandato()

    // Necessária pela paginação
    const {results} = data
    const dataTemplate = useDataTemplate()
    const acoesTemplate = (rowData) => {
        return (
            <div>
                <button className="btn-editar-membro" onClick={()=>handleEditFormModal(rowData)}>
                    <span data-tip="Editar mandato" data-html={true}>
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

    const handleEditFormModal = (rowData) =>{
        setStateFormModal({
            ...stateFormModal,
            referencia: rowData.referencia_mandato,
            data_inicial: rowData.data_inicial,
            data_final: rowData.data_final,
            uuid: rowData.uuid,
            id: rowData.id,
        });
        setShowModalForm(true)
    };

    const handleSubmitFormModal = async (values)=>{
        let payload = {
            referencia_mandato: values.referencia,
            data_inicial: moment(values.data_inicial).format('YYYY-MM-DD'),
            data_final: moment(values.data_final).format('YYYY-MM-DD'),
        };

        if (!values.uuid){
            mutationPost.mutate({payload: payload})
        }else {
            mutationPatch.mutate({uuidMandato: values.uuid, payload:payload})
        }
    };

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

    if (results && results.length > 0) {
        return (
            <>
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
                <section>
                    <ModalForm
                        handleSubmitFormModal={handleSubmitFormModal}
                    />
                    <ModalInfo/>
                </section>
            </>
        )
    }else {
        return (
            <div className="p-2">
                <p><strong>Nenhum resultado encontrado.</strong></p>
            </div>
        )
    }
}