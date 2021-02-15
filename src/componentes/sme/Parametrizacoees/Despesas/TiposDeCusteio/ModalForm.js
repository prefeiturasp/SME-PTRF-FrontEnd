import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaTags} from "./YupSignupSchemaTags";

const ModalForm = ({show, stateFormModal, handleClose, handleSubmitModalForm, setShowModalConfirmDelete}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaTags}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}
                >
                    {props => {
                        const {
                            values,
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
                                            <button onClick={()=>setShowModalConfirmDelete(true)} type="button" className="btn btn btn-danger mt-2 mr-2">
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
            titulo={stateFormModal && stateFormModal.uuid ? 'Editar tipo de custeio' : 'Adicionar tipo de custeio'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)