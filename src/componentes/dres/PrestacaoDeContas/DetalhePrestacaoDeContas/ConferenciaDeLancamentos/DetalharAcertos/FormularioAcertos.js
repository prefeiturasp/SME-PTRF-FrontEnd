import React from 'react';
import {Formik, FieldArray} from 'formik';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {FormularioAcertosBasico} from "./FormularioAcertosBasico";
import {FormularioAcertosDevolucaoAoTesouro} from "./FormularioAcertosDevolucaoAoTesouro";
import {YupSignupSchemaDetalharAcertos} from './YupSignupSchemaDetalharAcertos'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const FormularioAcertos = ({solicitacoes_acerto, listaTiposDeAcertoLancamentosAgrupado, onSubmitFormAcertos, formRef, handleChangeTipoDeAcertoLancamento, exibeCamposCategoriaDevolucao, tiposDevolucao, bloqueiaSelectTipoDeAcerto, removeBloqueiaSelectTipoDeAcertoJaCadastrado, textoCategoria, corTextoCategoria, removeTextoECorCategoriaTipoDeAcertoJaCadastrado, adicionaTextoECorCategoriaVazio, ehSolicitacaoCopiada}) => {

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
                                                            className={`btn btn-link ${ehSolicitacaoCopiada(acerto) ? 'btn-remover-ajuste-lancamento-copia' : 'btn-remover-ajuste-lancamento'} mr-2 p-0 d-flex align-items-center`}
                                                            onClick={() => {
                                                                remove(index)
                                                                removeBloqueiaSelectTipoDeAcertoJaCadastrado(index)
                                                                removeTextoECorCategoriaTipoDeAcertoJaCadastrado(index)
                                                            }}
                                                        >
                                                            <FontAwesomeIcon
                                                                style={{
                                                                    fontSize: '17px',
                                                                    marginRight: "4px",
                                                                    color: ehSolicitacaoCopiada(acerto) ? "#297805" : "#B40C02"
                                                                }}
                                                                icon={ ehSolicitacaoCopiada(acerto) ? faCheckCircle : faTimesCircle }
                                                            />
                                                            { ehSolicitacaoCopiada(acerto) ? "Considerar correto" : "Remover item" }
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
                                                                
                                                                {listaTiposDeAcertoLancamentosAgrupado && listaTiposDeAcertoLancamentosAgrupado.length > 0 && listaTiposDeAcertoLancamentosAgrupado.map(item => (
                                                                    <optgroup key={item.id} label={item.nome}>
                                                                        {item.tipos_acerto_lancamento && item.tipos_acerto_lancamento.length > 0 && item.tipos_acerto_lancamento.map(tipo_acerto => (
                                                                            <option key={tipo_acerto.uuid} value={tipo_acerto.uuid} data-categoria={item.id} data-objeto={JSON.stringify({...tipo_acerto})}>{tipo_acerto.nome}</option>
                                                                        ))}
                                                                    </optgroup>
                                                                ))}
                                                            </select>
                                                            <p className='mt-1 mb-0'><span className="text-danger">{errors && errors.solicitacoes_acerto && errors.solicitacoes_acerto[index] && errors.solicitacoes_acerto[index].tipo_acerto ? errors.solicitacoes_acerto[index].tipo_acerto : ''}</span></p>
                                                            {textoCategoria[index] &&
                                                                <p className='mt-2 mb-0'>
                                                                    <FontAwesomeIcon
                                                                        style={{fontSize: '17px', marginRight:'4px'}}
                                                                        icon={faExclamationCircle}
                                                                        className={corTextoCategoria[index]}
                                                                    />

                                                                    <span className={corTextoCategoria[index]}>{textoCategoria[index]}</span>
                                                                </p>
                                                            }
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
                                                        uuid: null,
                                                        copiado: false,
                                                        tipo_acerto: '',
                                                        detalhamento: '',
                                                        devolucao_tesouro: {
                                                            tipo: '',
                                                            data: '',
                                                            devolucao_total: '',
                                                            valor: '',
                                                        }
                                                    });
                                                    adicionaTextoECorCategoriaVazio();
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
