import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {YupSchemaTipoConta} from "./YupSchemaTipoConta";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

const ModalAddEditTipoConta = ({show, stateFormModal, handleClose, handleSubmitModalFormTiposConta, setShowModalConfirmDeleteTipoConta}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSchemaTipoConta}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormTiposConta}
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
                                            <label htmlFor="nome">Nome do tipo de conta *</label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="banco_nome">Nome do banco</label>
                                            <input
                                                type="text"
                                                value={props.values.banco_nome}
                                                name="banco_nome"
                                                id="banco_nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.banco_nome && props.errors.banco_nome && <span className="span_erro text-danger mt-1"> {props.errors.banco_nome} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="agencia">Nº da agência</label>
                                            <input
                                                type="text"
                                                value={props.values.agencia}
                                                name="agencia"
                                                id="agencia"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.agencia && props.errors.agencia && <span className="span_erro text-danger mt-1"> {props.errors.agencia} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="numero_conta">Nº da conta</label>
                                            <input
                                                type="text"
                                                value={props.values.numero_conta}
                                                name="numero_conta"
                                                id="numero_conta"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.numero_conta && props.errors.numero_conta && <span className="span_erro text-danger mt-1"> {props.errors.numero_conta} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="numero_cartao">Nº do cartão</label>
                                            <input
                                                type="text"
                                                value={props.values.numero_cartao}
                                                name="numero_cartao"
                                                id="numero_cartao"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.numero_cartao && props.errors.numero_cartao && <span className="span_erro text-danger mt-1"> {props.errors.numero_cartao} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col ml-4'>
                                        <div className="form-group">
                                            <input
                                                checked={props.values.apenas_leitura}
                                                type="checkbox"
                                                name="apenas_leitura"
                                                id="apenas_leitura"
                                                className="form-check-input"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label className="form-check-label marcar-como-lida"
                                                style={{ color: "#42474A" }}
                                                htmlFor="apenas_leitura">Exibir os dados da conta somente leitura</label>
                                        </div>
                                    </div>
                                    <div className='col ml-4'>
                                        <div className="form-group">
                                            <input
                                                checked={props.values.permite_inativacao}
                                                type="checkbox"
                                                name="permite_inativacao"
                                                id="permite_inativacao"
                                                className="form-check-input"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label className="form-check-label marcar-como-lida"
                                                style={{ color: "#42474A" }}
                                                htmlFor="permite_inativacao">Conta permite encerramento</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr />

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
                                            <button onClick={()=>setShowModalConfirmDeleteTipoConta(true)} type="button" className="btn btn-base-vermelho mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className={`btn btn-base-verde-outline mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn-base-verde mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
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
            titulo={stateFormModal && stateFormModal.uuid ? 'Editar tipo de conta' : 'Adicionar tipo de conta'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalAddEditTipoConta)