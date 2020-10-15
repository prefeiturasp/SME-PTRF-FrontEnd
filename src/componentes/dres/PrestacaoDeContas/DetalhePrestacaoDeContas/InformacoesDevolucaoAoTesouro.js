import React from "react";
import {Formik, FieldArray} from "formik";

export const InformacoesDevolucaoAoTesouro = (
    {
        formRef,
        informacoesPrestacaoDeContas,
        initialValues,
        handleChangeCpfBuscaDespesa,
        despesas,
        buscaDespesaPorFiltros,
        valoresIniciaisPush,
    }) =>{
    console.log("InformacoesDevolucaoAoTesouro ", despesas)
    return(
        <>
            {informacoesPrestacaoDeContas && informacoesPrestacaoDeContas.devolucao_ao_tesouro === "Sim" &&
                <>
                    <h1>devolucaoAoTesouro</h1>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        //onSubmit={metodoSalvarAnalise}
                        innerRef={formRef}
                    >
                        {props => {
                            const {
                                values,
                                setFieldValue,
                                resetForm,
                                errors,
                            } = props;

                            return (
                                <form>

                                    <FieldArray
                                        name="devolucoes_ao_tesouro"
                                        render={({remove, push}) => (
                                            <>
                                                {values.devolucoes_ao_tesouro && values.devolucoes_ao_tesouro.length > 0 && values.devolucoes_ao_tesouro.map((devolucao, index) => {
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
                                                                        <label htmlFor="busca_por_cpf_cnpj">Busque por CNPJ ou CPF</label>

                                                                        <input
                                                                            name={`devolucoes_ao_tesouro[${index}].busca_por_cpf_cnpj`}
                                                                            value={devolucao.busca_por_cpf_cnpj}
                                                                            onChange={async (e) => {
                                                                                props.handleChange(e);
                                                                                //await handleChangeFormDevolucaoAoTesouro(values);
                                                                                //handleChangeCpfBuscaDespesa(e.target.value, index)
                                                                            }
                                                                            }
                                                                            type="text"
                                                                            className='form-control'
                                                                            placeholder="Digite o nº do CNPJ ou CPF"
                                                                        />
                                                                    </div>

                                                                    <div className='col'>
                                                                        <label htmlFor="busca_por_tipo_documento">Busque por tipo de documento</label>
                                                                        <input
                                                                            name={`devolucoes_ao_tesouro[${index}].busca_por_tipo_documento`}
                                                                            value={devolucao.busca_por_tipo_documento}
                                                                            onChange={async (e) => {
                                                                                props.handleChange(e);
                                                                                //await handleChangeFormDevolucaoAoTesouro(values);
                                                                                //handleChangeCpfBuscaDespesa(e.target.value, index)
                                                                            }
                                                                            }
                                                                            type="text"
                                                                            className='form-control'
                                                                            //placeholder=""
                                                                        />
                                                                    </div>

                                                                    <div className='col'>
                                                                        <label htmlFor="busca_por_numero_documento">Busque por número do documento</label>

                                                                        <input
                                                                            name={`devolucoes_ao_tesouro[${index}].busca_por_numero_documento`}
                                                                            value={devolucao.busca_por_numero_documento}
                                                                            onChange={async (e) => {
                                                                                props.handleChange(e);
                                                                                //await handleChangeFormDevolucaoAoTesouro(values);
                                                                                //handleChangeCpfBuscaDespesa(e.target.value, index)
                                                                            }
                                                                            }
                                                                            type="text"
                                                                            className='form-control'
                                                                            //placeholder=""
                                                                        />
                                                                    </div>
                                                                    <div className='col'>
                                                                        <button type='button' onClick={()=>buscaDespesaPorFiltros(index)} className='btn btn-success'>Filtrar</button>
                                                                    </div>


                                                                </div>

                                                            </div>


                                                            <div className='col-12 mt-2'>
                                                                <div className="form-group">
                                                                    <label htmlFor="tipo_devolucao">Tipo de devolução</label>
                                                                    <input
                                                                        name={`devolucoes_ao_tesouro[${index}].tipo_devolucao`}
                                                                        value={devolucao.tipo_devolucao}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                            //await handleChangeFormDevolucaoAoTesouro(values);
                                                                        }
                                                                        }
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    {props.errors.tipo_devolucao && <span className="text-danger mt-1">{props.errors.tipo_devolucao}</span>}
                                                                </div>
                                                            </div>


                                                            {index >= 1 && values.devolucoes_ao_tesouro.length > 1 && (
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
                                                <div className="d-flex justify-content-start mt-2 mb-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn btn-success mr-2"
                                                        onClick={async () =>  {
                                                            push(
                                                                {
                                                                    busca_por_cpf_cnpj: "",
                                                                    busca_por_tipo_documento: "",
                                                                    busca_por_numero_documento: "",
                                                                    tipo_devolucao: "",
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