import React from "react";
import {ReceitaSchema} from "../Schemas";
import {visoesService} from "../../../../services/visoes.service";
import {DatePickerField} from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import {comparaObjetos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {ModalReceitaConferida} from "../ModalReceitaJaConferida";
import {ModalSelecionaRepasse} from "../ModalSelecionaRepasse";
import {Formik} from "formik";
import {Link} from "react-router-dom";
import ModalMotivosEstorno from "../ModalMotivosEstorno";

export const ReceitaFormFormik = ({
                                      initialValue,
                                      onSubmit,
                                      validateFormReceitas,
                                      readOnlyCampos,
                                      readOnlyTipoReceita,
                                      consultaRepasses,
                                      getClassificacaoReceita,
                                      setaDetalhesTipoReceita,
                                      getAvisoTipoReceita,
                                      setShowCadastrarSaida,
                                      tabelas,
                                      receita,
                                      verificaSeExibeDetalhamento,
                                      temOpcoesDetalhesTipoReceita,
                                      getOpcoesDetalhesTipoReceita,
                                      verificaSeDevolucao,
                                      readOnlyValor,
                                      readOnlyContaAssociacaoReceita,
                                      retornaTiposDeContas,
                                      readOnlyAcaoAssociacaoReceita,
                                      showBotaoCadastrarSaida,
                                      getClasificacaoAcao,
                                      retornaAcoes,
                                      atualizaValorRepasse,
                                      readOnlyClassificacaoReceita,
                                      retornaClassificacaoReceita,
                                      showEditarSaida,
                                      setExibeModalSalvoComSucesso,
                                      setRedirectTo,
                                      showCadastrarSaida,
                                      objetoParaComparacao,
                                      onCancelarTrue,
                                      onShowModal,
                                      uuid,
                                      exibirDeleteDespesa,
                                      readOnlyBtnAcao,
                                      onShowDeleteModal,
                                      servicoDeVerificacoes,
                                      showReceitaRepasse,
                                      setShowReceitaRepasse,
                                      showSelecionaRepasse,
                                      setShowSelecionaRepasse,
                                      setExibirDeleteDespesa,
                                      repasses,
                                      trataRepasse,
                                      readOnlyEstorno,
                                      despesa,
                                      idTipoReceitaEstorno,
                                      showModalMotivoEstorno,
                                      setShowModalMotivoEstorno,
                                      listaMotivosEstorno,
                                      selectMotivosEstorno,
                                      setSelectMotivosEstorno,
                                      checkBoxOutrosMotivosEstorno,
                                      txtOutrosMotivosEstorno,
                                      handleChangeCheckBoxOutrosMotivosEstorno,
                                      handleChangeTxtOutrosMotivosEstorno,
                                      readOnlyReaberturaSeletiva,
                                      ehOperacaoExclusaoReaberturaSeletiva,
                                      ehOperacaoAtualizacaoReaberturaSeletiva,
                                      origemAnaliseLancamento,
                                      validacoesPersonalizadasCredito,
                                      formDateErrors,
                                      escondeBotaoDeletar,
                                  }) => {

    return (
        <>
            <Formik
                initialValues={initialValue}
                validationSchema={ReceitaSchema}
                enableReinitialize={true}
                validateOnBlur={true}
                onSubmit={onSubmit}
                validate={validateFormReceitas}
            >
                {props => {
                    const {
                        values,
                        errors,
                        setFieldValue,
                    } = props;
                    return (
                        <form method="POST" id="receitaForm" onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                {/*Tipo de Receita */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="tipo_receita">Tipo do crédito</label>
                                    <select
                                        id="tipo_receita"
                                        name="tipo_receita"
                                        disabled={(idTipoReceitaEstorno === props.values.tipo_receita) || readOnlyEstorno || readOnlyCampos || readOnlyTipoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        value={props.values.tipo_receita}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            consultaRepasses(e.target.value);
                                            getClassificacaoReceita(e.target.value, setFieldValue);
                                            setaDetalhesTipoReceita(e.target.value);
                                            getAvisoTipoReceita(e.target.value);
                                            if (e.target.value !== "" && !tabelas.tipos_receita.find(element => element.id === Number(e.target.value)).e_recursos_proprios) {
                                                setShowCadastrarSaida(false);
                                            } else if (e.target.value !== "" && tabelas.tipos_receita.find(element => element.id === Number(e.target.value)).e_recursos_proprios) {
                                                let acao = tabelas.acoes_associacao.find(item => item.uuid == props.values.acao_associacao)
                                                if (acao && acao.e_recursos_proprios) {
                                                    setShowCadastrarSaida(true);
                                                }
                                            }
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.tipo_receita ? null : <option value="">Selecione o tipo</option>}

                                        {tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 ?
                                            (tabelas.tipos_receita.map(item => (
                                                        <option disabled={item.id === idTipoReceitaEstorno} key={item.id} value={item.id}>{item.nome}</option>
                                                    )
                                                )
                                            ) : null
                                        }
                                    </select>
                                    {props.touched.tipo_receita && props.errors.tipo_receita &&
                                        <span
                                            className="span_erro text-danger mt-1"> {props.errors.tipo_receita}</span>}
                                </div>
                                {/*Fim Tipo de Receita */}

                                {/*Detalhamento do Crédito */}
                                {verificaSeExibeDetalhamento(props.values.tipo_receita) &&
                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="detalhe_tipo_receita">Detalhamento do crédito</label>
                                        {temOpcoesDetalhesTipoReceita(props.values) ?
                                            <>
                                                <select
                                                    id="detalhe_tipo_receita"
                                                    name="detalhe_tipo_receita"
                                                    disabled={readOnlyCampos || readOnlyAcaoAssociacaoReceita || readOnlyReaberturaSeletiva}
                                                    value={props.values.detalhe_tipo_receita ? props.values.detalhe_tipo_receita.id : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                    }
                                                    }
                                                    onBlur={props.handleBlur}
                                                    className="form-control"
                                                >
                                                    {receita.detalhe_tipo_receita
                                                        ? null
                                                        : <option value="">Selecione o detalhamento</option>}
                                                    {getOpcoesDetalhesTipoReceita(props.values)}

                                                </select>
                                                {props.touched.detalhe_tipo_receita && props.errors.detalhe_tipo_receita &&
                                                    <span
                                                        className="span_erro text-danger mt-1"> {props.errors.detalhe_tipo_receita}</span>}
                                            </>
                                            :
                                            <>
                                                <input
                                                    value={props.values.detalhe_outros}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                    }
                                                    }
                                                    onBlur={props.handleBlur}
                                                    name="detalhe_outros" id="detalhe_outros" type="text"
                                                    className="form-control"
                                                    placeholder="Digite o detalhamento"
                                                    disabled={readOnlyEstorno || readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                                />
                                                {props.touched.detalhe_outros && props.errors.detalhe_outros && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.detalhe_outros}</span>}
                                            </>
                                        }
                                    </div>
                                }
                                {/*Fim Detalhamento do Crédito */}

                                {/*Periodo Devolução */}
                                {verificaSeDevolucao(props.values.tipo_receita) &&
                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="referencia_devolucao">Período de referência da devolução</label>
                                        <select
                                            id="referencia_devolucao"
                                            name="referencia_devolucao"
                                            value={props.values.referencia_devolucao && props.values.referencia_devolucao.uuid ? props.values.referencia_devolucao.uuid : props.values.referencia_devolucao ? props.values.referencia_devolucao : ""}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            className="form-control"
                                            disabled={readOnlyValor || readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        >
                                            {receita.referencia_devolucao
                                                ? null
                                                : <option value="">Selecione um período</option>}
                                            {tabelas.periodos !== undefined && tabelas.periodos.length > 0 ? (tabelas.periodos.map((item, key) => (
                                                <option key={key}
                                                        value={item.uuid}>{item.referencia_por_extenso}</option>
                                            ))) : null}
                                        </select>
                                        {props.touched.referencia_devolucao && props.errors.referencia_devolucao &&
                                            <span
                                                className="span_erro text-danger mt-1"> {props.errors.referencia_devolucao}</span>}
                                    </div>
                                }
                                {/*Periodo Devolução */}

                                {/*Data da Receita */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="data">Data do crédito</label>
                                    <DatePickerField
                                        name="data"
                                        id="data"
                                        value={values.data}
                                        onChange={setFieldValue}
                                        onCalendarClose={async () => {
                                            validacoesPersonalizadasCredito(values, setFieldValue, "credito_principal")
                                        }}
                                        onBlur={props.handleBlur}
                                        disabled={readOnlyCampos || readOnlyReaberturaSeletiva || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        maxDate={new Date()}
                                    />
                                    {formDateErrors && 
                                    <span className="span_erro text-danger mt-1"> {formDateErrors}</span>}
                                    {props.touched.data && props.errors.data &&
                                        <span className="span_erro text-danger mt-1"> {props.errors.data}</span>}
                                </div>
                                {/*Fim Data da Receita */}

                                {/*Tipo de Conta */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="conta_associacao">Tipo de conta</label>
                                    <select
                                        id="conta_associacao"
                                        name="conta_associacao"
                                        value={props.values.conta_associacao}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                        disabled={readOnlyEstorno || readOnlyValor || readOnlyCampos || readOnlyContaAssociacaoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                    >
                                        {receita.conta_associacao
                                            ? null
                                            : <option key="" value="">Escolha uma conta</option>}

                                        {retornaTiposDeContas(props.values)}
                                    </select>
                                    {props.touched.conta_associacao && props.errors.conta_associacao &&
                                        <span
                                            className="span_erro text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                </div>
                                {/*Fim Tipo de Conta */}

                                {/*Ação*/}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="acao_associacao">Ação</label>
                                    <select
                                        disabled={readOnlyEstorno || readOnlyCampos || readOnlyAcaoAssociacaoReceita || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        id="acao_associacao"
                                        name="acao_associacao"
                                        value={props.values.acao_associacao}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            showBotaoCadastrarSaida(e.target.value, props.values);
                                            getClasificacaoAcao(e.target.value, setFieldValue);
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                    >
                                        {receita.acao_associacao
                                            ? null
                                            : <option key={0} value="">Escolha uma ação</option>}
                                        {retornaAcoes(props.values)}
                                    </select>
                                    {props.touched.acao_associacao && props.errors.acao_associacao &&
                                        <span
                                            className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}
                                </div>
                                {/*Fim Ação*/}

                                {/*Classificação do Crédito*/}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="categoria_receita">Classificação do crédito</label>
                                    <select
                                        id="categoria_receita"
                                        name="categoria_receita"
                                        value={props.values.categoria_receita}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                            atualizaValorRepasse(e.target.value, setFieldValue);
                                        }
                                        }
                                        onBlur={props.handleBlur}
                                        className="form-control"
                                        disabled={readOnlyEstorno || readOnlyClassificacaoReceita || readOnlyCampos || readOnlyValor || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}

                                    >
                                        {receita.categorias_receita ? null :
                                            <option key={0} value="">Escolha a classificação</option>}

                                        {retornaClassificacaoReceita(props.values, setFieldValue)}
                                    </select>

                                    {props.touched.categoria_receita && props.errors.categoria_receita && <span
                                        className="span_erro text-danger mt-1"> {props.errors.categoria_receita}</span>}
                                </div>
                                {/*Fim Classificação do Crédito*/}

                                {/*Valor Total do Crédito */}
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor">Valor total do crédito</label>
                                    <CurrencyInput
                                        disabled={readOnlyCampos || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        allowNegative={false}
                                        prefix='R$'
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor}
                                        name="valor"
                                        id="valor"
                                        className="form-control"
                                        onChangeEvent={props.handleChange}
                                        readOnly={readOnlyEstorno || readOnlyValor}
                                    />
                                    {props.touched.valor && props.errors.valor &&
                                        <span className="span_erro text-danger mt-1"> {props.errors.valor}</span>}
                                </div>
                                {/*Fim Valor Total do Crédito */}
                            </div>

                            {/*Botões*/}
                            <div className="d-flex justify-content-end pb-3" style={{marginTop: '60px'}}>
                                {showEditarSaida && !origemAnaliseLancamento() &&
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setExibeModalSalvoComSucesso(false)
                                            setRedirectTo('/cadastro-de-despesa-recurso-proprio')
                                        }}
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Editar saída
                                    </button>
                                }
                                {showCadastrarSaida && !showEditarSaida && !origemAnaliseLancamento() ?
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setExibeModalSalvoComSucesso(false)
                                            setRedirectTo('/cadastro-de-despesa-recurso-proprio')
                                        }}
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Cadastrar saída
                                    </button> : null
                                }
                                <button
                                    type="reset"
                                    onClick={comparaObjetos(values, objetoParaComparacao) ? onCancelarTrue : onShowModal}
                                    className="btn btn btn-outline-success mt-2 mr-2"
                                >
                                    Voltar
                                </button>
                                {uuid && despesa && despesa.uuid && !origemAnaliseLancamento() &&
                                    <Link
                                        to={`/edicao-de-despesa/${despesa.uuid}`}
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Ver despesa
                                    </Link>

                                }
                                {uuid && exibirDeleteDespesa && !ehOperacaoAtualizacaoReaberturaSeletiva() && !escondeBotaoDeletar ?
                                    <button
                                        disabled={readOnlyBtnAcao || !visoesService.getPermissoes(['delete_receita'])}
                                        type="reset"
                                        onClick={onShowDeleteModal}
                                        className="btn btn btn-danger mt-2 mr-2"
                                    >
                                        Deletar
                                    </button> :
                                    null
                                }

                                {!ehOperacaoExclusaoReaberturaSeletiva() &&
                                    <button
                                        onClick={(e) => servicoDeVerificacoes(e, values, errors)}
                                        disabled={readOnlyBtnAcao || ![['add_receita'], ['change_receita']].some(visoesService.getPermissoes)}
                                        type="submit"
                                        className="btn btn-success mt-2"
                                    >
                                        Salvar
                                    </button>
                                }

                            </div>
                            {/*Fim Botões*/}
                            <section>
                                <ModalMotivosEstorno
                                    show={showModalMotivoEstorno}
                                    handleClose={()=>setShowModalMotivoEstorno(false)}
                                    listaMotivosEstorno={listaMotivosEstorno}
                                    selectMotivosEstorno={selectMotivosEstorno}
                                    setSelectMotivosEstorno={setSelectMotivosEstorno}
                                    checkBoxOutrosMotivosEstorno={checkBoxOutrosMotivosEstorno}
                                    txtOutrosMotivosEstorno={txtOutrosMotivosEstorno}
                                    handleChangeCheckBoxOutrosMotivosEstorno={handleChangeCheckBoxOutrosMotivosEstorno}
                                    handleChangeTxtOutrosMotivosEstorno={handleChangeTxtOutrosMotivosEstorno}
                                    onSubmit={onSubmit}
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    setShowModalMotivoEstorno={setShowModalMotivoEstorno}
                                    errors={errors}
                                />
                            </section>
                            <section>
                                <ModalReceitaConferida
                                    show={showReceitaRepasse}
                                    handleClose={() => setShowReceitaRepasse(false)}
                                    onSalvarReceitaConferida={() => {
                                        setShowReceitaRepasse(false);
                                        onSubmit(values, errors)
                                    }}
                                    titulo="Receita do tipo repasse"
                                    texto="<p>Atenção. Esse crédito é do tipo repasse e após gravação só poderá ser apagado pela DRE. Confirma a gravação?</p>"
                                />
                            </section>
                            <section>
                                <ModalSelecionaRepasse
                                    show={showSelecionaRepasse}
                                    cancelar={() => {
                                        setShowSelecionaRepasse(false);
                                        setFieldValue('tipo_receita', '');
                                        setFieldValue('valor', '0,00');
                                        setExibirDeleteDespesa(true);
                                    }}
                                    repasses={repasses}
                                    trataRepasse={trataRepasse}
                                    setFieldValue={setFieldValue}
                                    titulo="Selecione o repasse"
                                    bodyText="<p>Atenção. Esse crédito já foi demonstrado, caso a alteração seja gravada ele voltará a ser não demonstrado. Confirma a gravação?</p>"
                                />
                            </section>
                        </form>
                    );
                }}
            </Formik>
        </>
    )

}