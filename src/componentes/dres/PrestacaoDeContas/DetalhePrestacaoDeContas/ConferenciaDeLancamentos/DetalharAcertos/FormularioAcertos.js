import React from 'react';
import {Formik, FieldArray} from 'formik';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FormularioAcertosBasico} from "./FormularioAcertosBasico";
import {FormularioAcertosDevolucaoAoTesouro} from "./FormularioAcertosDevolucaoAoTesouro";
import {YupSignupSchemaDetalharAcertos} from './YupSignupSchemaDetalharAcertos'

export const FormularioAcertos = ({solicitacoes_acerto, listaTiposDeAcertoLancamentos, onSubmitFormAcertos, formRef, handleChangeTipoDeAcertoLancamento, exibeCamposCategoriaDevolucao, tiposDevolucao, bloqueiaSelectTipoDeAcerto, removeBloqueiaSelectTipoDeAcertoJaCadastrado}) => {

    return (
        <div className='mt-3'>
            <Formik
                initialValues={solicitacoes_acerto}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={YupSignupSchemaDetalharAcertos}
                onSubmit={onSubmitFormAcertos}
                innerRef={formRef}
            >
                {props => {
                    const {
                        values,
                        errors
                    } = props;
                    return (
                        <>
                        <form onSubmit={props.handleSubmit}>
                            <FieldArray
                                name="solicitacoes_acerto"
                                render={({remove, push}) => (
                                    <>
                                        {values.solicitacoes_acerto && values.solicitacoes_acerto.length > 0 && values.solicitacoes_acerto.map((acerto, index) => {
                                            return (
                                                <div key={index}>
                                                    <div
                                                        className='d-flex justify-content-between titulo-row-expanded-conferencia-de-lancamentos mt-4'>
                                                        <p className='mb-0 font-weight-bold'>
                                                            <strong>Item {index + 1}</strong></p>
                                                        <button
                                                            type="button"
                                                            className="btn btn-link btn-remover-despesa mr-2 p-0 d-flex align-items-center"
                                                            onClick={() => {
                                                                remove(index)
                                                                removeBloqueiaSelectTipoDeAcertoJaCadastrado(index)
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                style={{
                                                                    fontSize: '17px',
                                                                    marginRight: "4px",
                                                                    color: "#B40C02"
                                                                }}
                                                                icon={faTimesCircle}
                                                            />
                                                            Remover item
                                                        </button>
                                                    </div>

                                                    <div className="form-row container-campos-dinamicos">
                                                        <div className="col-12 mt-4">
                                                            <label htmlFor={`tipo_acerto_[${index}]`}>Tipo de acerto</label>
                                                            <select
                                                                value={acerto.tipo_acerto}
                                                                name={`solicitacoes_acerto[${index}].tipo_acerto`}
                                                                id={`tipo_acerto_[${index}]`}
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                    handleChangeTipoDeAcertoLancamento(e, index)
                                                                }}
                                                                disabled={bloqueiaSelectTipoDeAcerto[index]}
                                                            >
                                                                <option key='' value="">Selecione a especificação do acerto</option>
                                                                {listaTiposDeAcertoLancamentos && listaTiposDeAcertoLancamentos.length > 0 && listaTiposDeAcertoLancamentos.map(item => (
                                                                    <option key={item.uuid} value={item.uuid} data-objeto={JSON.stringify({...item})}>{item.nome}</option>
                                                                ))}
                                                            </select>
                                                            <p className='mt-1 mb-0'><span className="text-danger">{errors && errors.solicitacoes_acerto && errors.solicitacoes_acerto[index] && errors.solicitacoes_acerto[index].tipo_acerto ? errors.solicitacoes_acerto[index].tipo_acerto : ''}</span></p>
                                                        </div>
                                                        {exibeCamposCategoriaDevolucao[acerto.tipo_acerto] || acerto.devolucao_tesouro.uuid ? (
                                                                <>
                                                                    <FormularioAcertosDevolucaoAoTesouro
                                                                        formikProps={props}
                                                                        acerto={acerto}
                                                                        index={index}
                                                                        tiposDevolucao={tiposDevolucao}
                                                                    />
                                                                    <FormularioAcertosBasico
                                                                        formikProps={props}
                                                                        acerto={acerto}
                                                                        solicitacoes_acerto={values.solicitacoes_acerto}
                                                                        index={index}
                                                                        label='Motivo:'
                                                                        placeholder='Utilize esse campo para detalhar o motivo'
                                                                    />
                                                                </>
                                                            ) :
                                                            <FormularioAcertosBasico
                                                                formikProps={props}
                                                                acerto={acerto}
                                                                index={index}
                                                                label='Detalhamento do acerto (opcional):'
                                                                placeholder='Utilize esse campo para detalhar o acerto caso necessário.'
                                                            />
                                                        }
                                                    </div>
                                                </div> /*div key*/
                                            )
                                        })}

                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => {
                                                    push({
                                                        tipo_acerto: '',
                                                        detalhamento: '',
                                                        devolucao_tesouro: {
                                                            tipo: '',
                                                            data: '',
                                                            devolucao_total: '',
                                                            valor: '',
                                                        }
                                                    });
                                                }}
                                            >
                                                + Adicionar novo item
                                            </button>
                                        </div>
                                    </>
                                )}
                            />
                        </form>
                        </>
                    )
                }}
            </Formik>

        </div>
    )
};
