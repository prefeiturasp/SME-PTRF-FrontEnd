import React from "react";
import {Formik} from "formik";
import CurrencyInput from "react-currency-input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faCheckCircle, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";


export const ValoresReprogramadosFormFormik = ({
    valoresReprogramados, 
    formRef,
    editavelUE,
    editavelDRE,
    valoresSomadosUE,
    valoresSomadosDRE,
    handleOnKeyDown,
    handleChangeStatusConferencia,
    handleClickEstaCorreto,
    visao_selecionada,
    exibeAcao
}) => {
    
    return (
        <section>

            {valoresReprogramados &&
                <Formik
                    initialValues={valoresReprogramados}
                    enableReinitialize={true}
                    validateOnBlur={false}
                    validateOnChange={false}
                    innerRef={formRef}
                >
                    {props => {
                        const {
                            values,
                            errors,
                            setFieldValue
                        } = props;
                        return(
                            <>
                                
                                <form>
                                    {values.contas &&  values.contas.length > 0 && values.contas.map((dado, index_conta) => {
                                        return (
                                            <section className="form-row" key={index_conta}>
                                                <div className="col">
                                                    <p className="titulo-contas pt-4"><strong>Conta {dado.conta.tipo_conta}</strong></p>

                                                    <table className="tabela-valores-reprogramados table table-bordered border-0 mb-0 mt-2">
                                                        <thead>
                                                            <tr className="">
                                                                <th scope="col" style={{width: '20%'}} className="align-middle">Ação</th>
                                                                <th scope="col" style={{width: '20%'}} className="align-middle">Tipo de aplicação</th>
                                                                <th scope="col" style={{width: '30%'}} className="align-middle">
                                                                    <div className="row">
                                                                        <div className="col-2 mt-2 pr-0">
                                                                            <FontAwesomeIcon
                                                                                style={{fontSize: '30px', marginRight: "5px", color: '#b8b8ba', opacity: "0.5"}}
                                                                                icon={faFile}
                                                                            />
                                                                        </div>

                                                                        <div className="col-9 pl-1">
                                                                            <span>Preencha o valor reprogramado (Associação)</span>
                                                                        </div>
                                                                    </div>

                                                                </th>
                                                                <th scope="col" style={{width: '30%'}} className="align-middle">Conferência DRE</th>
                                                            </tr>
                                                        </thead>

                                                        {dado.conta.acoes &&  dado.conta.acoes.length > 0 && dado.conta.acoes.map((acao, index_acao) => {
                                                            return (
                                                                
                                                                <tbody key={index_acao}>
                                                                    {exibeAcao(acao) &&
                                                                        <tr>
                                                                            <td className="titulo-acoes" rowSpan={4}>{acao.nome}</td>
                                                                        </tr>
                                                                    }

                                                                    {acao.custeio &&
                                                                        <tr>
                                                                            <td>Custeio</td>
                                                                            <td className="tabela-valores-reprogramados-td-ue">
                                                                                <CurrencyInput
                                                                                    allowNegative={false}
                                                                                    prefix='R$'
                                                                                    decimalSeparator=","
                                                                                    thousandSeparator="."
                                                                                    value={acao.custeio.valor_ue}
                                                                                    name={`contas[${index_conta}].conta.acoes[${index_acao}].custeio.valor_ue`}
                                                                                    id={`contas[${index_conta}].conta.acoes[${index_acao}].custeio.valor_ue`}
                                                                                    className="form-control"
                                                                                    selectAllOnFocus={true}
                                                                                    onChangeEvent={(e) => {
                                                                                        props.handleChange(e);
                                                                                        valoresSomadosUE(dado);
                                                                                        handleChangeStatusConferencia(setFieldValue, e, acao.custeio, index_conta, index_acao, "UE")
                                                                                    }}
                                                                                    onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.custeio, index_conta, index_acao, "UE")}
                                                                                    placeholder=' '
                                                                                    allowEmpty={true}
                                                                                    disabled={!editavelUE()}
                                                                                />
                                                                            </td>

                                                                            <td className="tabela-valores-reprogramados-td-dre">
                                                                                <div className="row">
                                                                                    <div className="col">
                                                                                        {(acao.custeio.status_conferencia === "correto" || acao.custeio.status_conferencia === "incorreto") &&
                                                                                            <span><strong>{acao.custeio.status_conferencia === "correto" ? "Correto" : "Corrigir para:"}</strong></span>
                                                                                        }
                                                                                        
                                                                                        <CurrencyInput
                                                                                            allowNegative={false}
                                                                                            prefix='R$'
                                                                                            decimalSeparator=","
                                                                                            thousandSeparator="."
                                                                                            value={acao.custeio.valor_dre}
                                                                                            name={`contas[${index_conta}].conta.acoes[${index_acao}].custeio.valor_dre`}
                                                                                            id={`contas[${index_conta}].conta.acoes[${index_acao}].custeio.valor_dre`}
                                                                                            className="form-control"
                                                                                            selectAllOnFocus={true}
                                                                                            onChangeEvent={(e) => {
                                                                                                props.handleChange(e);
                                                                                                valoresSomadosDRE(dado);
                                                                                                handleChangeStatusConferencia(setFieldValue, e, acao.custeio, index_conta, index_acao, "DRE")
                                                                                            }}
                                                                                            onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.custeio, index_conta, index_acao, "DRE")}
                                                                                            placeholder=' '
                                                                                            allowEmpty={true}
                                                                                            disabled={!editavelDRE()}
                                                                                        />
                                                                                        
                                                                                        {!acao.custeio.status_conferencia && visao_selecionada === "DRE" &&
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    handleClickEstaCorreto(setFieldValue, acao.custeio, index_conta, index_acao)}
                                                                                                }
                                                                                                className={`link-esta-correto ${!editavelDRE() ? 'link-esta-correto-disabled' : ''} `}
                                                                                                disabled={!editavelDRE()}
                                                                                            >
                                                                                                <strong>Está correto</strong>
                                                                                            </button>
                                                                                        }

                                                                                    </div>
                                                                                        
                                                                                    {(acao.custeio.status_conferencia === "correto" || acao.custeio.status_conferencia === "incorreto") &&
                                                                                        <div className="col-2 status-conferencia">
                                                                                            <span>
                                                                                                <FontAwesomeIcon
                                                                                                    style={{
                                                                                                        fontSize: '20px',
                                                                                                        marginRight: "0",
                                                                                                        paddingRight: "4px",
                                                                                                        color: acao.custeio.status_conferencia === "correto" ? "#20AA73" : "#B40C02"
                                                                                                    }}
                                                                                                    icon={acao.custeio.status_conferencia === "correto" ? faCheckCircle : faExclamationTriangle}
                                                                                                />
                                                                                            </span>
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    }
                                                                    
                                                                    {acao.capital &&
                                                                        <tr>
                                                                            <td>Capital</td>
                                                                            <td className="tabela-valores-reprogramados-td-ue">
                                                                                <CurrencyInput
                                                                                    allowNegative={false}
                                                                                    prefix='R$'
                                                                                    decimalSeparator=","
                                                                                    thousandSeparator="."
                                                                                    value={acao.capital.valor_ue}
                                                                                    name={`contas[${index_conta}].conta.acoes[${index_acao}].capital.valor_ue`}
                                                                                    id={`contas[${index_conta}].conta.acoes[${index_acao}].capital.valor_ue`}
                                                                                    className="form-control"
                                                                                    selectAllOnFocus={true}
                                                                                    onChangeEvent={(e) => {
                                                                                        props.handleChange(e);
                                                                                        valoresSomadosUE(dado);
                                                                                        handleChangeStatusConferencia(setFieldValue, e, acao.capital, index_conta, index_acao, "UE")
                                                                                    }}
                                                                                    onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.capital, index_conta, index_acao, "UE")}
                                                                                    placeholder=' '
                                                                                    allowEmpty={true}
                                                                                    disabled={!editavelUE()}
                                                                                />
                                                                            </td>

                                                                            <td className="tabela-valores-reprogramados-td-dre">
                                                                                <div className="row">
                                                                                    <div className="col">
                                                                                        {(acao.capital.status_conferencia === "correto" || acao.capital.status_conferencia === "incorreto") &&
                                                                                            <span><strong>{acao.capital.status_conferencia === "correto" ? "Correto" : "Corrigir para:"}</strong></span>
                                                                                        }
                                                                                        
                                                                                        <CurrencyInput
                                                                                            allowNegative={false}
                                                                                            prefix='R$'
                                                                                            decimalSeparator=","
                                                                                            thousandSeparator="."
                                                                                            value={acao.capital.valor_dre}
                                                                                            name={`contas[${index_conta}].conta.acoes[${index_acao}].capital.valor_dre`}
                                                                                            id={`contas[${index_conta}].conta.acoes[${index_acao}].capital.valor_dre`}
                                                                                            className="form-control"
                                                                                            selectAllOnFocus={true}
                                                                                            onChangeEvent={(e) => {
                                                                                                props.handleChange(e);
                                                                                                valoresSomadosDRE(dado);
                                                                                                handleChangeStatusConferencia(setFieldValue, e, acao.capital, index_conta, index_acao, "DRE")
                                                                                            }}
                                                                                            onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.capital, index_conta, index_acao, "DRE")}
                                                                                            placeholder=' '
                                                                                            allowEmpty={true}
                                                                                            disabled={!editavelDRE()}
                                                                                        />

                                                                                        {!acao.capital.status_conferencia && visao_selecionada === "DRE" &&
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    handleClickEstaCorreto(setFieldValue, acao.capital, index_conta, index_acao)}
                                                                                                }
                                                                                                className={`link-esta-correto ${!editavelDRE() ? 'link-esta-correto-disabled' : ''} `}
                                                                                                disabled={!editavelDRE()}
                                                                                            >
                                                                                                <strong>Está correto</strong>
                                                                                            </button>
                                                                                        }

                                                                                    </div>
                                                                                        
                                                                                    {(acao.capital.status_conferencia === "correto" || acao.capital.status_conferencia === "incorreto") &&
                                                                                        <div className="col-2 status-conferencia">
                                                                                            <span>
                                                                                                <FontAwesomeIcon
                                                                                                    style={{
                                                                                                        fontSize: '20px',
                                                                                                        marginRight: "0",
                                                                                                        paddingRight: "4px",
                                                                                                        color: acao.capital.status_conferencia === "correto" ? "#20AA73" : "#B40C02"
                                                                                                    }}
                                                                                                    icon={acao.capital.status_conferencia === "correto" ? faCheckCircle : faExclamationTriangle}
                                                                                                />
                                                                                            </span>
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    }
                                                                    
                                                                    {acao.livre &&
                                                                        <tr>
                                                                            <td>Livre aplicação</td>
                                                                            <td className="tabela-valores-reprogramados-td-ue">
                                                                                <CurrencyInput
                                                                                    allowNegative={false}
                                                                                    prefix='R$'
                                                                                    decimalSeparator=","
                                                                                    thousandSeparator="."
                                                                                    value={acao.livre.valor_ue}
                                                                                    name={`contas[${index_conta}].conta.acoes[${index_acao}].livre.valor_ue`}
                                                                                    id={`contas[${index_conta}].conta.acoes[${index_acao}].livre.valor_ue`}
                                                                                    className="form-control"
                                                                                    selectAllOnFocus={true}
                                                                                    onChangeEvent={(e) => {
                                                                                        props.handleChange(e);
                                                                                        valoresSomadosUE(dado);
                                                                                        handleChangeStatusConferencia(setFieldValue, e, acao.livre, index_conta, index_acao, "UE")
                                                                                    }}
                                                                                    onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.livre, index_conta, index_acao, "UE")}
                                                                                    placeholder=' '
                                                                                    allowEmpty={true}
                                                                                    disabled={!editavelUE()}
                                                                                />
                                                                            </td>

                                                                            <td className="tabela-valores-reprogramados-td-dre">
                                                                                <div className="row">
                                                                                    <div className="col">
                                                                                        {(acao.livre.status_conferencia === "correto" || acao.livre.status_conferencia === "incorreto") &&
                                                                                            <span><strong>{acao.livre.status_conferencia === "correto" ? "Correto" : "Corrigir para:"}</strong></span>
                                                                                        }
                                                                                        
                                                                                        <CurrencyInput
                                                                                            allowNegative={false}
                                                                                            prefix='R$'
                                                                                            decimalSeparator=","
                                                                                            thousandSeparator="."
                                                                                            value={acao.livre.valor_dre}
                                                                                            name={`contas[${index_conta}].conta.acoes[${index_acao}].livre.valor_dre`}
                                                                                            id={`contas[${index_conta}].conta.acoes[${index_acao}].livre.valor_dre`}
                                                                                            className="form-control"
                                                                                            selectAllOnFocus={true}
                                                                                            onChangeEvent={(e) => {
                                                                                                props.handleChange(e);
                                                                                                valoresSomadosDRE(dado);
                                                                                                handleChangeStatusConferencia(setFieldValue, e, acao.livre, index_conta, index_acao, "DRE")
                                                                                            }}
                                                                                            onKeyDown={(e) => handleOnKeyDown(setFieldValue, e, acao.livre, index_conta, index_acao, "DRE")}
                                                                                            placeholder=' '
                                                                                            allowEmpty={true}
                                                                                            disabled={!editavelDRE()}
                                                                                        />

                                                                                        {!acao.livre.status_conferencia && visao_selecionada === "DRE" &&
                                                                                            <button
                                                                                                onClick={(e) => {
                                                                                                    handleClickEstaCorreto(setFieldValue, acao.livre, index_conta, index_acao)}
                                                                                                }
                                                                                                className={`link-esta-correto ${!editavelDRE() ? 'link-esta-correto-disabled' : ''} `}
                                                                                                disabled={!editavelDRE()}
                                                                                            >
                                                                                                <strong>Está correto</strong>
                                                                                            </button>
                                                                                        }

                                                                                    </div>
                                                                                        
                                                                                    {(acao.livre.status_conferencia === "correto" || acao.livre.status_conferencia === "incorreto") &&
                                                                                        <div className="col-2 status-conferencia">
                                                                                            <span>
                                                                                                <FontAwesomeIcon
                                                                                                    style={{
                                                                                                        fontSize: '20px',
                                                                                                        marginRight: "0",
                                                                                                        paddingRight: "4px",
                                                                                                        color: acao.livre.status_conferencia === "correto" ? "#20AA73" : "#B40C02"
                                                                                                    }}
                                                                                                    icon={acao.livre.status_conferencia === "correto" ? faCheckCircle : faExclamationTriangle}
                                                                                                />
                                                                                            </span>
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    }
                                                                </tbody>
                                                            )
                                                        })}

                                                        <tbody className="tbody-total">
                                                            <tr>
                                                                <td className="align-middle text-center total-titulo" colSpan={2}>
                                                                    Total
                                                                </td>

                                                                <td>
                                                                    <span className="total-subtitulo">Total</span>
                                                                    <br/>
                                                                    <span className="total-valor">{valoresSomadosUE(dado)}</span>
                                                                </td>

                                                                <td>
                                                                    <span className="total-subtitulo">Total</span>
                                                                    <br/>
                                                                    <span className="total-valor">{valoresSomadosDRE(dado)}</span>
                                                                </td>
                                                            </tr>
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </section>
                                        )
                                    })}
                                </form>
                            </>
                        )
                    }}

                </Formik>
            }

        </section>
        
    )
}