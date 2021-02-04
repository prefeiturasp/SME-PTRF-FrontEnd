import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";

const ModalFormPeriodos = ({show, stateFormModal, handleClose, handleSubmitModalFormTags}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    //validationSchema={YupSignupSchemaPeriodos}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormTags}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome</label>
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
                                        <label htmlFor="status">Status</label>
                                        <select
                                            value={props.values.status}
                                            onChange={(e)=>{
                                                props.handleChange(e);
                                            }}
                                            name="status"
                                            id="status"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione o status</option>
                                            <option value='ATIVO'>Ativo</option>
                                            <option value='INATIVO'>Inativo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' ? (
                                            <button type="button" className="btn btn btn-danger mt-2 mr-2">
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
            titulo={stateFormModal && !stateFormModal.editavel ? 'Visualizar período' : stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar período' : 'Adicionar período'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormPeriodos)