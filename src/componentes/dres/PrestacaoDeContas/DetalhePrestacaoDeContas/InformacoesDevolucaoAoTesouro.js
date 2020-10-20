import React, {Fragment} from "react";
import {Formik, FieldArray, Field} from "formik";
import {cpfMaskContitional, exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import MaskedInput from "react-text-mask";

export const InformacoesDevolucaoAoTesouro = (
    {
        formRef,
        informacoesPrestacaoDeContas,
        initialValues,
        despesas,
        buscaDespesaPorFiltros,
        valorTemplate,
        despesasTabelas,
        tiposDevolucao,
        validateFormDevolucaoAoTesouro,
    }) =>{
    return(
        <>
            {informacoesPrestacaoDeContas && informacoesPrestacaoDeContas.devolucao_ao_tesouro !== "Não" &&
            <>
                <h1>devolucaoAoTesouro</h1>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    validate={validateFormDevolucaoAoTesouro}
                    innerRef={formRef}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return (
                            <form>
                                <FieldArray
                                    name="devolucoes_ao_tesouro_da_prestacao"
                                    render={({remove, push}) => (
                                        <>
                                            {values.devolucoes_ao_tesouro_da_prestacao && values.devolucoes_ao_tesouro_da_prestacao.length > 0 && values.devolucoes_ao_tesouro_da_prestacao.map((devolucao, index) => {
                                                return (
                                                    <div className="row" key={index}>
                                                        <div className={`col-12 mt-3`}>
                                                            <p className="mb-0">
                                                                <strong>Devolução {index + 1}</strong>
                                                            </p>
                                                            <hr className="mt-0 mb-1"/>
                                                        </div>
                                                        <div className="col-12 col mt-2">
                                                            <div className='row'>
                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_cpf_cnpj">Busque por CNPJ ou CPF</label>
                                                                    <MaskedInput
                                                                        mask={(valor) => cpfMaskContitional(valor)}
                                                                        value={devolucao.busca_por_cpf_cnpj ? devolucao.busca_por_cpf_cnpj : ''}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_cpf_cnpj`}
                                                                        type="text"
                                                                        className='form-control'
                                                                        placeholder="Digite o nº do CNPJ ou CPF"
                                                                    />
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_tipo_documento">Busque por tipo de documento</label>
                                                                    <select
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_tipo_documento`}
                                                                        value={devolucao.busca_por_tipo_documento ? devolucao.busca_por_tipo_documento : '' }
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        className='form-control'
                                                                    >
                                                                        <option value="">Selecione o tipo</option>
                                                                        {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                                                        )
                                                                        }

                                                                    </select>
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_numero_documento">Busque por número do documento</label>
                                                                    <input
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_numero_documento`}
                                                                        value={devolucao.busca_por_numero_documento ? devolucao.busca_por_numero_documento : ''}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        type="text"
                                                                        className='form-control'
                                                                        //placeholder=""
                                                                    />
                                                                </div>

                                                                <div className='col-12 text-right'>
                                                                    <button name='btnFiltrar' type='button' onClick={()=>buscaDespesaPorFiltros(index)} className='btn btn-success mt-2'>Filtrar</button>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='col-12 mt-3 mb-4'>
                                                            <div className='col-12 py-2 container-tabela-despesas'>
                                                                <table className={`table tabela-despesas mb-0 ${despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ? 'table-bordered' : ''}`}>
                                                                    <tbody>
                                                                    {despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ?
                                                                        eval('despesas.devolucao_'+index).map((despesa, index_interno)=>
                                                                            <Fragment key={index_interno}>
                                                                                <tr className='divisao'>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}><Field type="radio" name={`devolucoes_ao_tesouro_da_prestacao[${index}].despesa`} value={despesa.uuid} /></td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.nome_fornecedor}</td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.cpf_cnpj_fornecedor}</td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.tipo_documento && despesa.tipo_documento.nome ? despesa.tipo_documento.nome : ''}</td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.numero_documento}</td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>R$ {valorTemplate(despesa.valor_total)}</td>
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.data_documento ? exibeDataPT_BR(despesa.data_documento) : ''}</td>
                                                                                </tr>
                                                                            </Fragment>
                                                                        ):
                                                                        <tr>
                                                                            <td className='td-sem-despesas'><p className='mb-3'>Não existem itens para essa pesquisa</p></td>
                                                                        </tr>
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-9 mt-2'>
                                                            <div className="form-group">
                                                                <label htmlFor="tipo">Tipo de devolução</label>
                                                                <select
                                                                    name={`devolucoes_ao_tesouro_da_prestacao[${index}].tipo`}
                                                                    value={devolucao.tipo}
                                                                    onChange={async (e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    className='form-control'
                                                                >
                                                                    <option value="">Selecione o tipo de devolução</option>
                                                                    {tiposDevolucao && tiposDevolucao.map(item =>
                                                                        <option key={item.id} value={item.uuid}>{item.nome}</option>
                                                                    )
                                                                    }
                                                                 </select>
                                                                {props.errors.tipo && <span className="text-danger mt-1">{props.errors.tipo}</span>}
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-3 mt-2'>
                                                            <div className="form-group">
                                                                <label htmlFor="data">Data da devolução</label>
                                                                <DatePickerField
                                                                    name={`devolucoes_ao_tesouro_da_prestacao[${index}].data`}
                                                                    value={devolucao.data}
                                                                    onChange={setFieldValue}
                                                                    placeholderText='Selecione data'
                                                                />
                                                                {props.errors.data && <span className="text-danger mt-1">{props.errors.data}</span>}
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-6'>
                                                            <label className='labels-filtros' htmlFor="devolucao_total">Valor total ou parcial da despesa</label>
                                                             <select
                                                                name={`devolucoes_ao_tesouro_da_prestacao[${index}].devolucao_total`}
                                                                value={devolucao.devolucao_total}
                                                                onChange={async (e) => {
                                                                    props.handleChange(e);
                                                                }
                                                                }
                                                                className='form-control'
                                                            >
                                                                <option value="">Selecione o tipo</option>
                                                                <option value='true'>Valor total</option>
                                                                <option value='false'>Valor parcial</option>
                                                            </select>
                                                        </div>

                                                        <div className='col-12 col-md-6'>
                                                            <label className='labels-filtros' htmlFor="valor">Valor</label>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                prefix='R$'
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={devolucao.valor}
                                                                name={`devolucoes_ao_tesouro_da_prestacao[${index}].valor`}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                }}
                                                                className={`form-control`}
                                                                selectAllOnFocus={true}
                                                                placeholder='Digite o valor'
                                                            />
                                                        </div>
                                                        <div className='col-12 mt-2'>
                                                            <label htmlFor="motivo">Motivo:</label>
                                                            <textarea
                                                                value={devolucao.motivo}
                                                                name={`devolucoes_ao_tesouro_da_prestacao[${index}].motivo`}
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                }}
                                                                className="form-control"
                                                                rows="3"
                                                                placeholder='Escreva o motivo da devolução'
                                                            >
                                                            </textarea>
                                                        </div>

                                                        {index >= 1 && values.devolucoes_ao_tesouro_da_prestacao.length > 1 && (
                                                            <div className='col-12'>
                                                                <div className="d-flex  justify-content-start mt-2 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mr-2"
                                                                        onClick={async () => {
                                                                            await remove(index)
                                                                        }}
                                                                    >
                                                                        - Remover Despesa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}

                                            {props.errors.campos_obrigatorios &&
                                                <div className="row">
                                                    <div className="col-12 mt-2">
                                                        <span className="text-danger"> <strong>{props.errors.campos_obrigatorios}</strong></span>
                                                    </div>
                                                </div>
                                            }
                                            <div className="d-flex justify-content-start mt-3 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-success mr-2"
                                                    onClick={async () =>  {
                                                        push(
                                                            {
                                                                busca_por_cpf_cnpj: "",
                                                                busca_por_tipo_documento: "",
                                                                busca_por_numero_documento: "",
                                                                despesa: "",
                                                                tipo: "",
                                                                data: "",
                                                                devolucao_total: "",
                                                                valor: "",
                                                                motivo: "",
                                                            }
                                                        );
                                                    }}
                                                >
                                                    + Adicionar outra devolução
                                                </button>
                                            </div>
                                        </>
                                    )}
                                >
                                </FieldArray>
                            </form>
                        )
                    }}
                </Formik>
            </>
            }
        </>
    )
};