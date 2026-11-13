import React, {memo} from "react";
import { Formik, Field, Form } from "formik";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {FormProgramaPDDEValidacao} from "./FormValidacao";

const ModalForm = ({
    show,
    stateFormModal,
    onSubmit,
    onHandleClose,
    setShowModalConfirmDelete,
    temPermissaoEdicao,
}) => {

    const bodyTextarea = () => (
        <Formik
            initialValues={stateFormModal}
            validationSchema={FormProgramaPDDEValidacao}
            enableReinitialize={true}
            onSubmit={onSubmit}
        >
            {props => {
                const {values} = props;
                return (
                    <Form>
                        <div className="row">
                            <div className="col-12">
                                <p className="text-right mb-2"><strong>* Preenchimento obrigatório</strong></p>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="nome_programa">Nome *</label>
                                    <Field
                                        data-qa="input-nome-programa"
                                        type="text"
                                        name="nome"
                                        id="nome_programa"
                                        className="form-control"
                                        maxLength={160}
                                        disabled={!temPermissaoEdicao}
                                    />
                                    {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                </div>
                            </div>
                        </div>

                        {values.operacao === 'edit' &&
                            <div className="row mt-2">
                                <div className="col">
                                    <p className="mb-2">ID</p>
                                    <p className="mb-2">{values.id}</p>
                                </div>
                            </div>
                        }

                        <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                {values.operacao === 'edit' &&
                                    <button
                                        data-qa="btn-excluir-programa"
                                        data-testid="btn-excluir-programa"
                                        onClick={() => setShowModalConfirmDelete(true)}
                                        type="button"
                                        className="btn btn-danger mt-2 mr-2"
                                        disabled={!temPermissaoEdicao}
                                    >
                                        Excluir
                                    </button>
                                }
                            </div>
                            <div className="p-Y bd-highlight">
                                <button
                                    data-qa="btn-cancelar-programa"
                                    onClick={onHandleClose}
                                    type="button"
                                    className="btn btn-outline-success mt-2 mr-2"
                                >
                                    Cancelar
                                </button>
                            </div>
                            <div className="p-Y bd-highlight">
                                <button
                                    data-qa="btn-salvar-programa"
                                    data-testid="btn-salvar-programa"
                                    type="submit"
                                    className="btn btn-success mt-2"
                                    disabled={!temPermissaoEdicao}
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );

    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal.operacao === 'edit' ? 'Editar Programa' : 'Adicionar Programa'}
            onHide={onHandleClose}
            size="lg"
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)
