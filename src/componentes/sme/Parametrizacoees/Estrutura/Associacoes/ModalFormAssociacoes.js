import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";

const ModalFormAssociacoes = ({show, stateFormModal, handleClose, handleSubmitModalFormAssociacoes}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    //validationSchema={YupSignupSchemaPeriodos}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormAssociacoes}
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
                                            <label htmlFor="referencia">Referencia</label>
                                            <input
                                                type="text"
                                                value={props.values.referencia}
                                                name="referencia"
                                                id="referencia"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.referencia && props.errors.referencia && <span className="span_erro text-danger mt-1"> {props.errors.referencia} </span>}
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
                                        {values.operacao === 'edit' && values.editavel ? (
                                            <button type="button" className="btn btn btn-danger mt-2 mr-2">
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className={`btn btn${values.editavel ? '-outline-success' : '-success'} mt-2 mr-2`}>{values.editavel ? 'Cancelar' : 'Voltar'}</button>
                                    </div>
                                    {values.operacao === 'create' || (values.operacao === 'edit' && values.editavel) ? (
                                        <div className="p-Y bd-highlight">
                                            <button type="submit" className="btn btn btn-success mt-2">Salvar</button>
                                        </div>
                                    ):null}
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

export default memo(ModalFormAssociacoes)