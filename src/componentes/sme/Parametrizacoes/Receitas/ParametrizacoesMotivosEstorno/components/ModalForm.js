import React, { memo } from "react";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Formik } from "formik";
import { YupSignupSchemaMotivosEstorno } from "../YupSignupSchemaMotivosEstorno";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalForm = ({ handleSubmitFormModal }) => {
    const {
        stateFormModal,
        handleCloseModalForm,
        handleOpenModalConfirmacaoExclusao,
    } = useMotivosEstornoContext();

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES =
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

    const { recursos } = useRecursoSelecionadoContext();

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
                {(props) => {
                    const { values } = props;
                    return (
                        <form onSubmit={props.handleSubmit}>
                            <div className="row">
                                <div className="col-12">
                                    <p>* Preenchimento obrigatório</p>
                                </div>
                                <div className="col-12 mb-2">
                                    <label htmlFor="recurso_uuid">
                                        Recurso *
                                    </label>
                                    <select
                                        data-qa="input-recurso"
                                        name="recurso_uuid"
                                        id="recurso_uuid"
                                        value={
                                            values.recurso_uuid
                                                ? values.recurso_uuid
                                                : ""
                                        }
                                        disabled
                                        className="form-control"
                                        required
                                    >
                                        <option
                                            data-qa="option-recurso-vazio"
                                            value=""
                                        >
                                            Selecione um recurso
                                        </option>
                                        {recursos?.map((recurso) => (
                                            <option
                                                data-qa={`option-recurso-${recurso.uuid}`}
                                                key={recurso.uuid}
                                                value={recurso.uuid}
                                            >
                                                {recurso.nome}
                                            </option>
                                        ))}
                                    </select>
                                    {props.touched.recurso_uuid &&
                                        props.errors.recurso_uuid && (
                                            <span className="span_erro text-danger mt-1">
                                                {" "}
                                                {props.errors.recurso_uuid}{" "}
                                            </span>
                                        )}
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="motivo">Nome *</label>
                                        <input
                                            type="text"
                                            value={props.values.motivo}
                                            name="motivo"
                                            id="motivo"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={
                                                !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
                                            }
                                        />
                                        {props.touched.motivo &&
                                            props.errors.motivo && (
                                                <span className="span_erro text-danger mt-1">
                                                    {" "}
                                                    {props.errors.motivo}{" "}
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <p className="mb-2">ID {values.id}</p>
                                </div>
                            </div>
                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.uuid && (
                                        <button
                                            onClick={() =>
                                                handleOpenModalConfirmacaoExclusao(
                                                    values.uuid,
                                                )
                                            }
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={
                                                !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                style={{
                                                    marginRight: "8px",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                }}
                                            />
                                            Excluir
                                        </button>
                                    )}
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        onClick={handleCloseModalForm}
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
                                        disabled={
                                            !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
                                        }
                                    >
                                        {stateFormModal.uuid
                                            ? "Salvar"
                                            : "Adicionar"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        );
    };

    return (
        <ModalFormBodyText
            show={stateFormModal.isOpen}
            titulo={`${stateFormModal.uuid ? "Editar motivo" : "Adicionar motivo"}`}
            onHide={handleCloseModalForm}
            size="lg"
            bodyText={bodyTextarea()}
        />
    );
};

export default memo(ModalForm);
