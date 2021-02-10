import React, {memo} from "react";
import {ModalFormBodyText} from "../ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaArquivosDeCarga} from "./YupSignupSchemaArquivosDeCarga";

const ModalFormArquivosDeCarga = ({show, stateFormModal, handleClose, handleSubmitModalForm, tabelaArquivos, statusTemplate}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaArquivosDeCarga}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit} >
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="identificador">Identificador</label>
                                            <input
                                                type="text"
                                                value={props.values.identificador}
                                                name="identificador"
                                                id="identificador"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.identificador && props.errors.identificador && <span className="span_erro text-danger mt-1"> {props.errors.identificador} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="conteudo">Conteúdo</label>
                                            <input
                                                accept=".csv"
                                                className="form-control-file"
                                                id="conteudo"
                                                name="conteudo"
                                                type="file"
                                                //value={props.values.conteudo}
                                                onChange={(event) => {
                                                    setFieldValue("conteudo", event.currentTarget.files[0]);
                                                }}
                                            />
                                            {props.touched.conteudo && props.errors.conteudo && <span className="span_erro text-danger mt-1"> {props.errors.conteudo} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="tipo_delimitador">Tipo delimitador</label>
                                        <select
                                            value={props.values.tipo_delimitador && props.values.tipo_delimitador ? props.values.tipo_delimitador : ""}
                                            onChange={props.handleChange}
                                            name="tipo_delimitador"
                                            id="tipo_delimitador"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione um período</option>
                                            {tabelaArquivos && tabelaArquivos.tipos_delimitadores && tabelaArquivos.tipos_delimitadores.length > 0 &&  tabelaArquivos.tipos_delimitadores.map((delimitador) =>
                                                <option key={delimitador.id} value={delimitador.id}>{delimitador.nome}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="ultima_execucao">Última execução</label>
                                            <input
                                                type="text"
                                                value={props.values.ultima_execucao}
                                                name="ultima_execucao"
                                                id="ultima_execucao"
                                                className="form-control"
                                                readOnly={true}
                                            />
                                            {props.touched.ultima_execucao && props.errors.ultima_execucao && <span className="span_erro text-danger mt-1"> {props.errors.ultima_execucao} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="status">Status</label>
                                            <input
                                                type="text"
                                                value={statusTemplate('', props.values.status)}
                                                name="status"
                                                id="status"
                                                className="form-control"
                                                readOnly={true}
                                            />
                                            {props.touched.status && props.errors.status && <span className="span_erro text-danger mt-1"> {props.errors.status} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>Log</p>
                                        <p className='mb-2'>{props.values.log ? props.values.log : '-'}</p>
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

                                <div className="d-flex justify-content-end mt-2">
                                    <button onClick={()=>handleClose()} type="button" className='btn btn-outline-success mt-2 mr-2'>Cancelar</button>
                                    <button type="submit" className="btn btn-success mt-2">Salvar e enviar</button>
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
            titulo={stateFormModal && stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar associação' : 'Adicionar associação'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormArquivosDeCarga)