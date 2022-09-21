import React from "react";
import {Formik, FieldArray} from "formik";
import {exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {visoesService} from "../../../../../services/visoes.service";


export const InformacoesDevolucaoAoTesouro = ({formRef, informacoesPrestacaoDeContas, initialValues, despesas, validateFormDevolucaoAoTesouro}) =>{

    const exibeDevolucoesAoTesouro = (index, despesas, valor_devolucao, data_devolucao, props, setDataDevolucaoValue) => {

        if (despesas) {
            /* eslint-disable-next-line no-eval */
            let devolucao = eval('despesas.devolucao_' + index);
            let despesa = devolucao[0]
            return (
                <>
                    <table className="table table-bordered tabela-devolucoes-ao-tesouro">
                        <thead>
                        <tr>
                            <th scope="col">Razão Social</th>
                            <th scope="col">CNPJ ou CPF</th>
                            <th scope="col">Tipo de Doc.</th>
                            <th scope="col">Nº do Doc.</th>
                            <th scope="col">Data Doc.</th>
                            <th scope="col">Vr. Devolução</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr key="xxx">
                            <td>{despesa.nome_fornecedor}</td>
                            <td>{despesa.cpf_cnpj_fornecedor}</td>
                            <td>{despesa.tipo_documento?.nome}</td>
                            <td>{despesa.numero_documento}</td>
                            <td>{despesa.data_documento ? exibeDataPT_BR(despesa.data_documento) : ''}</td>
                            <td>{valor_devolucao ? valor_devolucao : ''}</td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="row">
                        <div
                            className="col-12 col-sm-5 col-md-5 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                            <label htmlFor="data">Insira a data de realização da devolução:</label>
                        </div>
                        <div className="col-12 col-sm-7 col-md-3 pl-0">
                            <div className="form-group">
                                <DatePickerField
                                    name={`devolucoes_ao_tesouro_da_prestacao[${index}].data`}
                                    value={data_devolucao}
                                    placeholderText='dd/mm/aaaa'
                                    onChange={setDataDevolucaoValue}
                                    disabled={visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE'}
                                />
                                {props.errors.data && <span className="text-danger mt-1">{props.errors.data}</span>}
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    };

    return(
        <>
            {informacoesPrestacaoDeContas && informacoesPrestacaoDeContas.devolucao_ao_tesouro !== "Não" &&
            <>
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

                                                        <div className='col-12 mt-3 mb-4'>
                                                            <div className='col-12'>
                                                                {/* eslint-disable-next-line no-eval */}
                                                                {values.devolucoes_ao_tesouro_da_prestacao[index].despesa !== "" && despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0?
                                                                exibeDevolucoesAoTesouro(index, despesas, devolucao.valor, devolucao.data, props, setFieldValue) : false}
                                                            </div>
                                                        </div>
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