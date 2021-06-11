import React, {Fragment, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {cpfMaskContitional, exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../services/visoes.service";
import {ModalConfirmaRemocaoDevolucaoAoTesouro} from "../ModalConfirmaRemocaoDevolucaoAoTesouro";

export const InformacoesDevolucaoAoTesouro = ({formRef, informacoesPrestacaoDeContas, initialValues, despesas, buscaDespesaPorFiltros, valorTemplate, despesasTabelas, tiposDevolucao, validateFormDevolucaoAoTesouro,}) =>{

    const [showConfirmaRemocao, setShowConfirmaRemocao] = useState({abrir:false, indice:0});

    const setDisabledCampos = (devolucao) =>{
       return devolucao.visao_criacao === "DRE" && visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE'
    };

    const onClickRemoverDevolucao = async (remove, index) =>{
        await remove(index);
        setShowConfirmaRemocao(false);
    };

    const onHandleClose = () => {
        setShowConfirmaRemocao(false);
    };

    const clear = (index, setFieldValue) => {
        setFieldValue(`devolucoes_ao_tesouro_da_prestacao[${index}].despesa`, '');
        setFieldValue(`devolucoes_ao_tesouro_da_prestacao[${index}].devolucao_total`, '');
        setFieldValue(`devolucoes_ao_tesouro_da_prestacao[${index}].valor`, '0,00');
    }

    const exibeDespesaSelecionada = (index, values, despesas, devolucao) => {

        if (values.devolucoes_ao_tesouro_da_prestacao[index].despesa) {
            let uuid_despesa = values.devolucoes_ao_tesouro_da_prestacao[index].despesa;
            let desp = eval('despesas.devolucao_'+index).find(item => item.uuid === uuid_despesa);

            return (
                <Fragment key={0}>
                    {desp &&
                        <tr className='divisao'>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>
                                <Field disabled={setDisabledCampos(devolucao) } type="radio" name={`devolucoes_ao_tesouro_da_prestacao[${index}].despesa`} value={desp.uuid}/>
                            </td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>{desp.nome_fornecedor}</td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>{desp.cpf_cnpj_fornecedor}</td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>{desp.tipo_documento && desp.tipo_documento.nome ? desp.tipo_documento.nome : ''}</td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>{desp.numero_documento}</td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>R$ {valorTemplate(desp.valor_total)}</td>
                            {/* eslint-disable-next-line no-eval */}
                            <td className={`td-com-despesas `}>{desp.data_documento ? exibeDataPT_BR(desp.data_documento) : ''}</td>
                        </tr>
                    }
                </Fragment>
            )
        }
    }

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
                                                        <div className="col-12 col mt-2">
                                                            <div className='row'>
                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_cpf_cnpj">Busque por CNPJ ou CPF</label>
                                                                    <MaskedInput
                                                                        mask={(valor) => cpfMaskContitional(valor)}
                                                                        value={devolucao.busca_por_cpf_cnpj ? devolucao.busca_por_cpf_cnpj : ''}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_cpf_cnpj`}
                                                                        type="text"
                                                                        className='form-control'
                                                                        placeholder="Digite o nº do CNPJ ou CPF"
                                                                        disabled={setDisabledCampos(devolucao) }
                                                                    />
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_tipo_documento">Busque por tipo de documento</label>
                                                                    <select
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_tipo_documento`}
                                                                        value={devolucao.busca_por_tipo_documento ? devolucao.busca_por_tipo_documento : '' }
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        className='form-control'
                                                                        disabled={setDisabledCampos(devolucao) }
                                                                    >
                                                                        <option value="">Selecione o tipo</option>
                                                                        {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                                                        )}
                                                                    </select>
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_numero_documento">Busque por nº do documento</label>
                                                                    <input
                                                                        name={`devolucoes_ao_tesouro_da_prestacao[${index}].busca_por_numero_documento`}
                                                                        value={devolucao.busca_por_numero_documento ? devolucao.busca_por_numero_documento : ''}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        type="text"
                                                                        className='form-control'
                                                                        disabled={setDisabledCampos(devolucao) }
                                                                    />
                                                                </div>

                                                                <div className='col-12 text-right'>
                                                                    <button disabled={setDisabledCampos(devolucao) } name='btnFiltrar' type='button' onClick={()=>{buscaDespesaPorFiltros(index); clear(index, setFieldValue)}} className='btn btn-success mt-2'>Filtrar</button>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='col-12 mt-3 mb-4'>
                                                            <div className='col-12 py-2 container-tabela-despesas'>
                                                                {/* eslint-disable-next-line no-eval */}
                                                                <table className={`table tabela-despesas mb-0 ${despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ? 'table-bordered' : ''}`}>
                                                                    <tbody>
                                                                    {/* eslint-disable-next-line no-eval */}
                                                                    {values.devolucoes_ao_tesouro_da_prestacao[index].despesa !== "" && despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0?
                                                                        exibeDespesaSelecionada(index, values, despesas, devolucao)
                                                                        /* eslint-disable-next-line no-eval */
                                                                    : despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ?
                                                                            /* eslint-disable-next-line no-eval */
                                                                        eval('despesas.devolucao_'+index).map((despesa, index_interno)=>
                                                                            <Fragment key={index_interno}>
                                                                                <tr className='divisao'>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}><Field disabled={setDisabledCampos(devolucao) } type="radio" name={`devolucoes_ao_tesouro_da_prestacao[${index}].despesa`} value={despesa.uuid} onClick={(e) => values.devolucoes_ao_tesouro_da_prestacao[index].devolucao_total === "true" ? setFieldValue(`devolucoes_ao_tesouro_da_prestacao[${index}].valor`, valorTemplate(despesa.valor_total)): null}/></td>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.nome_fornecedor}</td>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.cpf_cnpj_fornecedor}</td>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.tipo_documento && despesa.tipo_documento.nome ? despesa.tipo_documento.nome : ''}</td>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>{despesa.numero_documento}</td>
                                                                                    {/* eslint-disable-next-line no-eval */}
                                                                                    <td className={`td-com-despesas ${eval('despesas.devolucao_'+index).length === 1 ? 'td-com-despesas-unica' : ''}`}>R$ {valorTemplate(despesa.valor_total)}</td>
                                                                                    {/* eslint-disable-next-line no-eval */}
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
                                                                    }}
                                                                    className='form-control'
                                                                    disabled={setDisabledCampos(devolucao) }
                                                                >
                                                                    <option value="">Selecione o tipo de devolução</option>
                                                                    {tiposDevolucao && tiposDevolucao.map(item =>
                                                                        <option key={item.id} value={item.uuid}>{item.nome}</option>
                                                                    )}
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
                                                                    placeholderText='Preenchimento pela UE.'
                                                                    onChange={setFieldValue}
                                                                    disabled={visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE'}
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
                                                                    if (values.devolucoes_ao_tesouro_da_prestacao[index].despesa && e.target.value === 'true') {
                                                                        let desp = eval('despesas.devolucao_'+index).find(item => item.uuid === values.devolucoes_ao_tesouro_da_prestacao[index].despesa);
                                                                        setFieldValue(`devolucoes_ao_tesouro_da_prestacao[${index}].valor`, valorTemplate(desp.valor_total));
                                                                    }
                                                                }
                                                                }
                                                                className='form-control'
                                                                disabled={setDisabledCampos(devolucao) }
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
                                                                disabled={setDisabledCampos(devolucao) }
                                                            />
                                                        </div>

                                                        {visoesService.getItemUsuarioLogado('visao_selecionada.nome') === "UE" || (index >= 1 && values.devolucoes_ao_tesouro_da_prestacao.length > 1) ? (
                                                            <div className='col-12'>
                                                                <div className="d-flex  justify-content-start mt-2 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mr-2"
                                                                        onClick={async ()=>{
                                                                            setDisabledCampos(devolucao) ? setShowConfirmaRemocao({abrir:true, indice:index}) : onClickRemoverDevolucao(remove, index)
                                                                        }}
                                                                    >
                                                                        - Remover devolução
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        <section>
                                                            <ModalConfirmaRemocaoDevolucaoAoTesouro
                                                                show={showConfirmaRemocao.abrir}
                                                                handleClose={onHandleClose}
                                                                onConfirmaTrue={()=>onClickRemoverDevolucao(remove, showConfirmaRemocao.indice)}
                                                                titulo="Excluir devolução"
                                                                texto="<p>Essa devolução foi incluida pela Diretoria Regional. Deseja realmente exclui-la?</p>"
                                                                primeiroBotaoTexto="Cancelar"
                                                                primeiroBotaoCss="outline-success"
                                                                segundoBotaoCss="success"
                                                                segundoBotaoTexto="Confirmar"
                                                            />
                                                        </section>

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
                                                                visao_criacao: visoesService.getItemUsuarioLogado('visao_selecionada.nome'),
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