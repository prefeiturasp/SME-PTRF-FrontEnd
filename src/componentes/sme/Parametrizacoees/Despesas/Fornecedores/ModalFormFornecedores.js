import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaFornecedores} from "./YupSignupSchemaFornecedores";
import MaskedInput from "react-text-mask";
import {cpfMaskContitional} from "../../../../../utils/ValidacoesAdicionaisFormularios";

const ModalFormFornecedores = ({show, stateFormModal, handleClose, handleSubmitModalFormFornecedores, setShowModalConfirmDeleteFornecedor}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaFornecedores}
                    validateOnBlur={false}
                    validateOnChange={false}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormFornecedores}
                >
                    {props => {
                        const {
                            values,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome do Fornecedor</label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="cpf_cnpj">CPF / CNPJ</label>
                                        {/*<input
                                            type="text"
                                            value={props.values.cpf_cnpj}
                                            name="cpf_cnpj"
                                            id="cpf_cnpj"
                                            className="form-control"
                                            onChange={props.handleChange}
                                        />*/}
                                        <MaskedInput
                                            mask={(valor) => cpfMaskContitional(valor)}
                                            type="text"
                                            value={props.values.cpf_cnpj}
                                            name="cpf_cnpj"
                                            id="cpf_cnpj"
                                            className="form-control"
                                            onChange={props.handleChange}
                                        />
                                        {props.touched.cpf_cnpj && props.errors.cpf_cnpj && <span className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj} </span>}

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
                                        {values.operacao === 'edit' ? (
                                            <button onClick={()=>setShowModalConfirmDeleteFornecedor(true)} type="button" className="btn btn btn-danger mt-2 mr-2">
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className={`btn btn-outline-success mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn btn-success mt-2">Salvar</button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    };

    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && stateFormModal.uuid ? 'Editar fornecedor' : 'fornecedor'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormFornecedores)