import React, {memo, useContext} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import { YupSignupSchemaMotivosEstorno } from "./YupSignupSchemaMotivosEstorno";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { MotivosEstornoContext } from "./context/MotivosEstorno";

const ModalForm = ({handleSubmitFormModal}) => {
    const {
        showModalForm, 
        setShowModalForm, 
        stateFormModal, 
        setShowModalConfirmacaoExclusao
    } = useContext(MotivosEstornoContext);
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSignupSchemaMotivosEstorno}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmitFormModal}
            >
                {props => {
                    const {
                        values,
                    } = props;
                    return(
                        <form onSubmit={props.handleSubmit}>

                            <div className='row'>
                                <div className='col-12'>
                                    <p>* Preenchimento obrigatório</p>
                                </div>
                                <div className='col'>
                                    <div className="form-group">
                                        <label htmlFor="motivo">Nome *</label>
                                        <input
                                            type="text"
                                            value={props.values.motivo}
                                            name="motivo"
                                            id="motivo"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.touched.motivo && props.errors.motivo && <span className="span_erro text-danger mt-1"> {props.errors.motivo} </span>}
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col'>
                                    <p className='mb-2'>Uuid</p>
                                    <p className='mb-2'>{values.uuid}</p>
                                </div>
                                <div className='col'>
                                    <p className='mb-2'>ID</p>
                                    <p className='mb-2'>{values.id}</p>
                                </div>
                            </div>
                            <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.uuid &&
                                        <button
                                            onClick={()=>setShowModalConfirmacaoExclusao(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            Apagar
                                        </button>
                                    }
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        onClick={()=>setShowModalForm(false)}
                                        type="button"
                                        className={`btn btn-outline-success mt-2 mr-2`}
                                    >
                                        Cancelar
                                    </button>
                                </div>

                                <div className="p-Y bd-highlight">
                                    <button
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                        {stateFormModal.uuid ? "Salvar" : "Adicionar" }
                                    </button>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        )
    };

    return (
        <ModalFormBodyText
            show={showModalForm}
            titulo={`${stateFormModal.uuid ? "Editar motivo" : "Adicionar motivo" }`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)