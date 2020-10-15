import React from "react";
import {Formik, FieldArray, Field} from "formik";
import {ReceitaSchema} from "../../../escolas/Receitas/Schemas";
import MaskedInput from "react-text-mask";
import {cpfMaskContitional} from "../../../../utils/ValidacoesAdicionaisFormularios";

export const InformacoesDevolucaoAoTesouro = ({informacoesPrestacaoDeContas, initialValues}) =>{
    console.log("InformacoesDevolucaoAoTesouro ", initialValues)
    return(
        <>
            {informacoesPrestacaoDeContas && informacoesPrestacaoDeContas.devolucao_ao_tesouro === "Sim" &&
                <>
                    <h1>devolucaoAoTesouro</h1>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validateOnBlur={true}
                        //onSubmit={onSubmit}
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
                                        render={() => (
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
                                                                            name={`devolucao[${index}].busca_por_cpf_cnpj`}
                                                                            value={devolucao.busca_por_cpf_cnpj}
                                                                            onChange={(e) => {
                                                                                props.handleChange(e);
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
                                                                    <label htmlFor="banco_nome">Tipo de devolução</label>
                                                                    <input
                                                                        name={`devolucao[${index}].banco_nome`}
                                                                        value={devolucao.banco_nome}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    {props.errors.banco_nome && <span className="text-danger mt-1">{props.errors.banco_nome}</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        )}
                                    >
                                    </FieldArray>

                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button onClick={props.handleReset} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                        <button type="submit" className="btn btn-success mt-2">Salvar</button>
                                    </div>

                                </form>
                            )
                        }}
                    </Formik>
                </>
            }

        </>
    )
};