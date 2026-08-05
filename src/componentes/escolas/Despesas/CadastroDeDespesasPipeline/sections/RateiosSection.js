import React from "react";
import {FieldArray, useFormikContext} from "formik";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {visoesService} from "../../../../../services/visoes.service";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {Tags} from "../../Tags";
import {RateioCusteio} from "../rateios/RateioCusteio";
import {RateioCapital} from "../rateios/RateioCapital";
import {ModalDeletarRateioComEstorno} from "../modals/ModalDeletarRateioComEstorno";
import ExibeMotivosPagamentoAntecipadoNoForm from "../modals/ExibeMotivosPagamentoAntecipadoNoForm";
import {
    useDespesaTabelasCtx,
    useDespesaUiCtx,
    useDespesaFluxoCtx,
} from "../context/DespesaFormPipelineContext";

export const RateiosSection = () => {
    const props = useFormikContext();
    const {values, setFieldValue, errors} = props;

    const {
        despesaContext,
        despesasTabelas,
        aux,
        parametroLocation,
        veioDeSituacaoPatrimonial,
    } = useDespesaTabelasCtx();

    const {
        readOnlyCampos,
        setShowAvisoCapital,
        showDeletarRateioComEstorno,
        setShowDeletarRateioComEstorno,
        bloqueiaLinkCadastrarEstorno,
        bloqueiaRateioEstornado,
        bloqueiaCamposDespesa,
    } = useDespesaUiCtx();

    const {removeRateio} = useDespesaFluxoCtx();

return (
        <>
            <hr/>
            <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
            <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação do programa?</p>
            <div className="form-row">
                <div className="col-12 col-md-3 ">
                    <select
                        data-qa="cadastro-edicao-despesa-gasto-tem-rateios"
                        value={props.values.mais_de_um_tipo_despesa}
                        onChange={(e) => {
                            props.handleChange(e);
                            aux.setaValoresCusteioCapital(e.target.value, values, setFieldValue);
                        }}
                        name='mais_de_um_tipo_despesa'
                        id='mais_de_um_tipo_despesa'
                        className={`${!props.values.mais_de_um_tipo_despesa && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!values.mais_de_um_tipo_despesa && "despesa_incompleta"} form-control`}
                        disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                    >
                        <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-0" value="">Selecione</option>
                        <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-1" value="nao">Não</option>
                        <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-2" value="sim">Sim</option>
                    </select>
                </div>
            </div>

            <FieldArray
                name="rateios"
                render={({remove, push}) => (
                    <>
                        {values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                            return (
                                <div key={index}>

                                    <div
                                        className="d-flex bd-highlight border-bottom mt-4 align-items-center">
                                        <div className="flex-grow-1 bd-highlight">
                                            <p className='mb-0'><strong>Despesa {index + 1}</strong>
                                            </p>
                                        </div>
                                        <div className="bd-highlight">
                                            <div className="d-flex justify-content-start">
                                                {rateio && rateio.uuid && (!aux.origemAnaliseLancamento(parametroLocation) || visoesService.featureFlagAtiva('habilita-estorno-ajuste-despesa')) && (
                                                    rateio.estorno && rateio.estorno.uuid
                                                        ?
                                                        <Link
                                                            data-qa={`cadastro-edicao-despesa-rateio-${index}-acessar-estorno`}
                                                            to={
                                                                {
                                                                    pathname: `/edicao-de-receita/${rateio.estorno.uuid}`,

                                                                }
                                                            }
                                                            className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaLinkCadastrarEstorno(rateio) ? 'desabilita-link-estorno' : ''}`}
                                                            disabled={bloqueiaLinkCadastrarEstorno(rateio)}
                                                        >
                                                            Acessar estorno
                                                        </Link>
                                                        :
                                                        <Link
                                                            data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastrar-estorno`}
                                                            to="/cadastro-de-credito/"
                                                            state={{ uuid_rateio: rateio.uuid }}
                                                            className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaLinkCadastrarEstorno(rateio) ? 'desabilita-link-estorno' : ''}`}
                                                            disabled={bloqueiaLinkCadastrarEstorno(rateio)}
                                                        >
                                                            Cadastrar estorno
                                                        </Link>
                                                )}

                                                {index >= 1 && values.rateios.length > 1 && (
                                                    <button
                                                        data-qa={`cadastro-edicao-despesa-rateio-${index}-btn-remover-despesa`}
                                                        type="button"
                                                        className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaCamposDespesa() ? 'desabilita-link-remover-despesa' : ''}`}
                                                        onClick={() => removeRateio(remove, index, rateio)}
                                                        disabled={!visoesService.getPermissoes(['delete_despesa']) || bloqueiaCamposDespesa() || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                    >
                                                        <FontAwesomeIcon
                                                            style={{
                                                                fontSize: '17px',
                                                                marginRight: "4px",
                                                                color: "#B40C02"
                                                            }}
                                                            icon={faTimesCircle}
                                                        />
                                                        Remover Despesa
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        {rateio && rateio.uuid && rateio.estorno && rateio.estorno.uuid &&
                                            <div className="col-12 ">
                                                <p data-qa={`cadastro-edicao-despesa-rateio-${index}-mensagem-edicao-bloqueada`} className="mb-0 mt-3 texto-rateio-estornado-bloqueado">
                                                    Esta seção da despesa encontra-se bloqueada para edição. Para editar seus campos, deve-se primeiro deletar o estorno cadastrado.
                                                </p>
                                            </div>
                                        }

                                        <div className="col-12 col-md-6 mt-4">

                                            <label htmlFor={`aplicacao_recurso_${index}`}>Tipo de
                                                aplicação do recurso</label>
                                            <select
                                                data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso`}
                                                value={rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    aux.limpaTipoDespesaCusteio(setFieldValue, index)
                                                    aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                    aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);

                                                }}
                                                name={`rateios[${index}].aplicacao_recurso`}
                                                id={`aplicacao_recurso_${index}`}
                                                className={`${!rateio.aplicacao_recurso && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!rateio.aplicacao_recurso && "despesa_incompleta"} form-control`}
                                                disabled={readOnlyCampos || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            >
                                                <option data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso-option-${0}`} key={0} value="">Escolha uma opção
                                                </option>
                                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map((item, key) => (
                                                    <option data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso-option-${key + 1}`} key={item.id}
                                                            value={item.id}>{item.nome}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CUSTEIO' ? (
                                            <RateioCusteio
                                                rateio={rateio}
                                                index={index}
                                                disabled={readOnlyCampos || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            />
                                        ) :
                                        rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CAPITAL' ? (
                                            <RateioCapital
                                                rateio={rateio}
                                                index={index}
                                                disabled={readOnlyCampos || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            />
                                        ) : null
                                    }


                                    <div className="row">
                                        <div className="col-12">

                                            <Tags
                                                formikProps={props}
                                                rateio={rateio}
                                                rateios={values.rateios}
                                                index={index}
                                                verboHttp={despesaContext.verboHttp}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                errors={errors}
                                                setFieldValue={setFieldValue}
                                                despesasTabelas={despesasTabelas}
                                                bloqueiaRateioEstornado={bloqueiaRateioEstornado}
                                            />
                                        </div>
                                    </div>

                                    <ExibeMotivosPagamentoAntecipadoNoForm
                                        values={values}
                                    />

                                    <section>
                                        <ModalDeletarRateioComEstorno
                                            show={showDeletarRateioComEstorno}
                                            handleClose={() => setShowDeletarRateioComEstorno(false)}
                                            titulo="Remover Despesa"
                                            texto="A exclusão desse rateio resultará na exclusão do crédito de estorno vinculado. Confirma?"
                                            onDeletarRateio={() => {
                                                remove(index)
                                                setShowDeletarRateioComEstorno(false)
                                            }}
                                        />
                                    </section>

                                </div> /*div key*/
                            )
                        })}

                        {props.values.mais_de_um_tipo_despesa === "sim" && 
                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                <button
                                    data-qa="cadastro-edicao-despesa-btn-adicionar-despesa-parcial"
                                    type="button"
                                    className="btn btn btn-outline-success mt-2 mr-2"
                                    disabled={![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || bloqueiaCamposDespesa() || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                    onChange={(e) => {
                                        props.handleChange(e);
                                        aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                    }}
                                    onClick={() => {
                                        push(
                                            {
                                                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                escolha_tags: "",
                                                tag: "",
                                                conta_associacao: "",
                                                acao_associacao: "",
                                                aplicacao_recurso: "",
                                                tipo_custeio: "",
                                                especificacao_material_servico: "",
                                                valor_rateio: "",
                                                quantidade_itens_capital: "",
                                                valor_item_capital: "",
                                                valor_original: "",
                                                numero_processo_incorporacao_capital: ""
                                            }
                                        );
                                    }}
                                >
                                    + Adicionar despesa parcial
                                </button>
                            </div>
                        }
                    </>
                )}
            />
        </>
    );
};
