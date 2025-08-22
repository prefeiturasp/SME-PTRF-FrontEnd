import React, { useContext } from "react";
import { Formik } from "formik";
import { YupSchemaMotivosDevolucaoTesouro } from "../YupSchemaMotivosDevolucaoTesouro";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {showModalForm, setShowModalForm, stateFormModal, bloquearBtnSalvarForm, setShowModalConfirmacaoExclusao} = useContext(MotivosDevolucaoTesouroContext)

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSchemaMotivosDevolucaoTesouro}
                    enableReinitialize={true}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={handleSubmitFormModal}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-right mb-0'><small> * Preenchimento obrigatório</small></p>
                                        <div className="form-group">
                                            <span data-tooltip-content="Preencher com um motivo de devolução ao tesouro" data-html={true}>
                                                <label htmlFor="nome">Motivo *</label>
                                                <ReactTooltip/>
                                            </span>

                                            <input
                                                type="text"
                                                maxlength={160}
                                                value={values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col-6'>
                                        <p className='mb-2'>ID</p>
                                        <p id='id'>{values.id}</p>
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
                                            disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            {stateFormModal.uuid ? "Salvar" : "Adicionar" }
                                        </button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    }

    return (
        <ModalFormBodyText
            show={showModalForm}
            titulo={`${stateFormModal && stateFormModal.uuid ? "Editar motivo" : "Adicionar motivo"}`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}