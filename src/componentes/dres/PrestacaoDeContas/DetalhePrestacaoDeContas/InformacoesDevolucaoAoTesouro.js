import React from "react";
import {Formik, FieldArray} from "formik";

export const InformacoesDevolucaoAoTesouro = ({formRef, informacoesPrestacaoDeContas, initialValues}) =>{
    //console.log("InformacoesDevolucaoAoTesouro ", initialValues)
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
                        onSubmit={(values, { metodoSalvarAnalise }) => {
                            console.log({ values });
                            //setSubmitting(false);
                        }}
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
                                <form onSubmit={props.handleSubmit}>

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


                                                            <div className="col-12 mt-2">
                                                                <div className='row'>
                                                                    <div className='col-6'>
                                                                        <label htmlFor="busca_por_cpf_cnpj">Busque por CNPJ ou CPF</label>

                                                                        <input
                                                                            name={`devolucoes_ao_tesouro[${index}].busca_por_cpf_cnpj`}
                                                                            value={devolucao.busca_por_cpf_cnpj}
                                                                            onChange={async (e) => {
                                                                                props.handleChange(e);
                                                                                //await handleChangeFormDevolucaoAoTesouro(values);
                                                                            }
                                                                            }
                                                                            type="text"
                                                                            className='form-control'
                                                                            placeholder="Digite o nº do CNPJ ou CPF"
                                                                        />
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
                                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                                        onClick={async () => {
                                                                            await remove(index)
                                                                        }}

                                                                    >
                                                                        - Remover Despesa
                                                                    </button>
                                                                </div>
                                                            )}

                                                        </div>

                                                    )
                                                })}
                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                        onClick={async () =>  {
                                                            push(
                                                                {
                                                                    busca_por_cpf_cnpj: "",
                                                                    tipo_devolucao: "",
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        + Adicionar despesa parcial
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