import React, {memo, useEffect} from "react";
import {ModalFormBodyText} from "../ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaArquivosDeCarga} from "./YupSignupSchemaArquivosDeCarga";

const ModalFormArquivosDeCarga = ({show, stateFormModal, handleClose, handleSubmitModalForm, tabelaArquivos, statusTemplate, dadosDeOrigem, periodos, arquivoRequerPeriodo, tiposDeContas, arquivoRequerTipoDeConta}) => {    
    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaArquivosDeCarga(arquivoRequerPeriodo, arquivoRequerTipoDeConta)}
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
                                <div className="mb-3" style={{ textAlign: 'right' }}>
                                    <span>* Campos obrigatórios</span>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="identificador">Identificador *</label>
                                            <input
                                                type="text"
                                                value={props.values.identificador}
                                                name="identificador"
                                                id="identificador"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.identificador && props.errors.identificador && <small className="span_erro text-danger mt-1"> * {props.errors.identificador} </small>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label className='mb-0' htmlFor="conteudo">Conteúdo *</label>
                                            {props.values.nome_arquivo && props.values.operacao === 'edit' &&
                                            <p className='mb-1'><small><strong>Atualmente: </strong>{props.values.nome_arquivo.split('/').pop()}</small></p>
                                            }
                                            <input
                                                accept=".csv"
                                                className="form-control-file"
                                                id="conteudo"
                                                name="conteudo"
                                                type="file"
                                                onChange={(event) => {
                                                    setFieldValue("conteudo", event.currentTarget.files[0]);
                                                }}
                                            />
                                            {props.touched.conteudo && props.errors.conteudo && <small className="span_erro text-danger mt-1"> * {props.errors.conteudo} </small>}
                                        </div>
                                    </div>
                                </div>
                                {arquivoRequerPeriodo && <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="tipo_periodo">Período *</label>
                                        <select
                                            value={props.values.periodo && props.values.periodo ? props.values.periodo : ""}
                                            onChange={props.handleChange}
                                            name="periodo"
                                            id="periodo"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione o período</option>
                                            {periodos && periodos.length > 0 && periodos.map((periodo) =>
                                                <option key={periodo.uuid} value={periodo.uuid}>{periodo.referencia}</option>
                                            )}
                                        </select>
                                        {props.errors && props.errors.periodo && props.errors.periodo && <small className="span_erro text-danger mt-1"> * {props.errors.periodo} </small>}
                                    </div>
                                </div>}
                                {arquivoRequerTipoDeConta && <div className='row mt-3'>
                                    <div className='col'>
                                        <label htmlFor="tipo_de_conta">Tipo de conta *</label>
                                        <select
                                            value={props.values.tipo_de_conta && props.values.tipo_de_conta ? props.values.tipo_de_conta : ""}
                                            onChange={props.handleChange}
                                            name="tipo_de_conta"
                                            id="tipo_de_conta"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione o tipo de conta</option>
                                            {tiposDeContas && tiposDeContas.length > 0 && tiposDeContas.map((tipoDeConta) =>
                                                <option key={tipoDeConta.uuid} value={tipoDeConta.uuid}>{tipoDeConta.nome}</option>
                                            )}
                                        </select>
                                        {props.errors && props.errors.tipo_de_conta && props.errors.tipo_de_conta && <small className="span_erro text-danger mt-1"> * {props.errors.tipo_de_conta} </small>}
                                    </div>
                                </div>}
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <label htmlFor="tipo_delimitador">Tipo delimitador</label>
                                        <select
                                            value={props.values.tipo_delimitador && props.values.tipo_delimitador ? props.values.tipo_delimitador : ""}
                                            onChange={props.handleChange}
                                            name="tipo_delimitador"
                                            id="tipo_delimitador"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione delimitador</option>
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
            titulo={stateFormModal && stateFormModal && stateFormModal.operacao === 'edit' ? `Editar ${dadosDeOrigem.titulo_modal}` : `Adicionar ${dadosDeOrigem.titulo_modal}`}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormArquivosDeCarga)