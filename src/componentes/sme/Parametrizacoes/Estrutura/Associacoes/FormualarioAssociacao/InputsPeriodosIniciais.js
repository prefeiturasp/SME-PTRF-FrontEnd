import { Divider } from "antd"
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'

import { useAssociacoesFormularioContext } from "../hooks/useAssociacoesFormularioContext"
import { exibeDataPT_BR } from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { getPeriodos } from "../../../../../../services/sme/DashboardSme.service";
import { IconButton } from "../../../../../Globais/UI/Button";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

export function InputsPeriodosIniciais({
    props,
    setFieldValue,
    podeEditarDadosAssociacao,
    TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
}) {
    const { recursos } = useRecursoSelecionadoContext();
    const {
        getRecursosParaSelectFormulario,
        dataStatusValoresReprogramados,
        initialItemPeriodoInicial,
        errosPeriodosIniciais,
    } = useAssociacoesFormularioContext();

    const handleChangeRecurso = async (e, index) => {
        const t = [...props.values.periodos_iniciais];
        t[index].recurso = e.target.value;
        t[index].periodo_inicial = '';

        try {
            const periodos = await getPeriodos({ recurso_uuid: e.target.value });

            t[index].periodos_disponiveis = periodos;
        } catch {
            toastCustom.ToastCustomError('Erro ao buscar os períodos');
        }

        setFieldValue('periodos_iniciais', t);
    }

    const renderButtonRemove = (index, values) => {
        if (!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES) return null;

        if (index <= 0) return null;

        if (values.periodos_iniciais[index].uuid) {
            if (!podeEditarDadosAssociacao(values, 'periodo_inicial')) {
                return null;
            }
        }

        return (
            <IconButton
                icon="faTimesCircle"
                iconProps={{
                    style: {
                        fontSize: '15px',
                    }
                }}
                buttonStyle={{
                    fontWeight: 'bold',
                }}
                label="Remover Recurso"
                onClick={() => {
                    const t = [...values.periodos_iniciais];
                    t.splice(index, 1);

                    setFieldValue('periodos_iniciais', t);
                }}
                variant="text-danger"
            />
        )
    }

    const verificaSePodeEditar = (index, values, is_input_periodos_iniciais=false) => {
        if (!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES) return false;

        if (values.periodos_iniciais[index].uuid){
            return podeEditarDadosAssociacao(values, 'periodo_inicial');
        }

        if (is_input_periodos_iniciais) {
            return values.periodos_iniciais[index]?.periodos_disponiveis?.length > 0
        }

        return true
    }

    return (
        <div className="mt-3 mb-3">
            <h6 className="mb-4 font-weight-bold">Recurso(s) vinculado(s) à Associação</h6>

            {
                props.values?.periodos_iniciais?.map((periodo_inicial, index) => {
                    return (
                        <div key={`periodo-inicial-${index}`} className="mb-3">
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-1 font-weight-bold">Recurso {index + 1}</h6>

                                        {renderButtonRemove(index, props.values)}
                                    </div>

                                    <Divider className="mt-0"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="recurso">Recurso*</label>
                                        <select
                                            value={props.values.periodos_iniciais[index].recurso}
                                            onChange={(e) => handleChangeRecurso(e, index)}
                                            name='recurso'
                                            id="recurso"
                                            className="form-control"
                                            disabled={!verificaSePodeEditar(index, props.values, false)}
                                        >
                                            <option value=''>Selecione o Recurso</option>
                                            {getRecursosParaSelectFormulario(index, props.values.periodos_iniciais).map(item => (
                                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                            ))}
                                        </select>
                                        {errosPeriodosIniciais[index]?.recurso && <span className="span_erro text-danger mt-1"> {errosPeriodosIniciais[index].recurso} </span>}
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="periodo_inicial">
                                            Período inicial*
                                        </label>

                                        <div
                                            data-tooltip-html={
                                            props.values.pode_editar_periodo_inicial && !props.values.pode_editar_periodo_inicial?.pode_editar_periodo_inicial && props.values.pode_editar_periodo_inicial?.mensagem_pode_editar_periodo_inicial?.length > 0
                                                ? props.values.pode_editar_periodo_inicial?.mensagem_pode_editar_periodo_inicial?.reduce((hint, text) => (hint + `${text}<br/>`), '<p>') + '</p>'
                                                : ''
                                            } style={{display:'inline'}} data-tooltip-id={`tooltip-id-${props.values.uuid}`}
                                        >
                                            <select
                                                value={props.values.periodos_iniciais[index].periodo_inicial}
                                                onChange={(e) => {
                                                    const t = [...props.values.periodos_iniciais];
                                                    t[index].periodo_inicial = e.target.value;
                                                    setFieldValue('periodos_iniciais', t);
                                                }}
                                                name="periodo_inicial"
                                                id="periodo_inicial"
                                                className="form-control"
                                                disabled={
                                                    !verificaSePodeEditar(index, props.values, true)
                                                }
                                            >
                                                <option value=''>Selecione um período</option>
                                                {props.values.periodos_iniciais[index].periodos_disponiveis.map((periodo) =>
                                                    <option
                                                        key={periodo.uuid}
                                                        value={periodo.uuid}
                                                    >
                                                        {`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}
                                                    </option>
                                                )}
                                            </select>
                                            <ReactTooltip id={`tooltip-id-${props.values.uuid}`}/>
                                            </div>
                                            <small className="form-text text-muted">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '12px', marginRight:'4px'}}
                                                    icon={faExclamationCircle}
                                                />
                                                <span>O período inicial informado é uma referência e indica que o período a ser habilitado para a associação será o período posterior ao período informado.</span>
                                            </small>
                                            {errosPeriodosIniciais[index]?.periodo_inicial && <span className="span_erro text-danger mt-1"> {errosPeriodosIniciais[index].periodo_inicial} </span>}
                                        </div>
                                    </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="form-group">
                                        <label htmlFor="status_valores_reprogramados">Status dos valores reprogramados*</label>
                                        <select
                                            value={props.values.periodos_iniciais[index].status_valores_reprogramados}
                                            onChange={(e) => {
                                                const t = [...props.values.periodos_iniciais];
                                                t[index].status_valores_reprogramados = e.target.value;
                                                setFieldValue('periodos_iniciais', t);
                                            }}
                                            name='status_valores_reprogramados'
                                            id="status_valores_reprogramados"
                                            className="form-control"
                                            disabled={
                                                !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
                                            }
                                        >
                                            <option value=''>Selecione o status</option>
                                            {dataStatusValoresReprogramados.map(item => (
                                                <option key={item.key} value={item.key}>{item.value}</option>
                                            ))}
                                        </select>
                                        {errosPeriodosIniciais[index]?.status_valores_reprogramados && <span className="span_erro text-danger mt-1"> {errosPeriodosIniciais[index].status_valores_reprogramados} </span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

            <div className="row mt-4">
                <div className="col-12">
                    <IconButton
                        icon="faPlus"
                        iconProps={{
                            style: {
                                fontSize: '12px',
                            }
                        }}
                        buttonStyle={{
                            fontWeight: 'bold',
                        }}
                        label="Adicionar outro Recurso da Associação"
                        onClick={() => {
                            const t = [...props.values.periodos_iniciais];

                            t.push({
                                ...initialItemPeriodoInicial,
                                periodos_disponiveis: [...initialItemPeriodoInicial.periodos_disponiveis],
                            });

                            setFieldValue('periodos_iniciais', t);
                        }}
                        variant="outline-success"
                        disabled={
                            !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES ||
                            props.values.periodos_iniciais?.length === recursos?.length
                        }
                    />
                </div>
            </div>
        </div>
    )
}
