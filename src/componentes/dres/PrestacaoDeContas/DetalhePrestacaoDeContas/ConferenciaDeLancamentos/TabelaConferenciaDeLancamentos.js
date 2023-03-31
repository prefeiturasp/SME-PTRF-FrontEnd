import React, {useEffect, useMemo, useState, memo} from "react";
import {useHistory} from "react-router-dom";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faInfoCircle, faListUl} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import {ModalCheckNaoPermitidoConfererenciaDeLancamentos} from "./Modais/ModalCheckNaoPermitidoConfererenciaDeLancamentos";
import {FiltrosConferenciaDeLancamentos} from "./FiltrosConferenciaDeLancamentos";
import {
    postLancamentosParaConferenciaMarcarComoCorreto,
    postLancamentosParaConferenciaMarcarNaoConferido
} from "../../../../../services/dres/PrestacaoDeContas.service";
import {
    mantemEstadoAcompanhamentoDePc as meapcservice
} from "../../../../../services/mantemEstadoAcompanhamentoDePc.service";
import ReactTooltip from "react-tooltip";

// Hooks Personalizados
import useValorTemplate from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useValorTemplate";
import {useCarregaTabelaDespesa} from "../../../../../hooks/Globais/useCarregaTabelaDespesa";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import useConferidoTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate";
import useRowExpansionDespesaTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionDespesaTemplate";
import useRowExpansionReceitaTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useRowExpansionReceitaTemplate";
import useNumeroDocumentoTemplate
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useNumeroDocumentoTemplate";
import useTagInformacaoTemplate 
    from "../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useTagInformacaoTemplate";

// Redux
import {useDispatch} from "react-redux";
import {
    addDetalharAcertos,
    limparDetalharAcertos
} from "../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/actions";
import {visoesService} from "../../../../../services/visoes.service";
import {ModalBootstrapLegendaInformacao} from "../../../../../componentes/Globais/ModalBootstrap";

const TabelaConferenciaDeLancamentos = ({
                                            setLancamentosParaConferencia,
                                            lancamentosParaConferencia,
                                            contaUuid,
                                            carregaLancamentosParaConferencia,
                                            prestacaoDeContas,
                                            editavel,
                                            handleChangeCheckBoxOrdenarPorImposto,
                                            stateCheckBoxOrdenarPorImposto,
                                            setStateCheckBoxOrdenarPorImposto,
                                        }) => {

    const rowsPerPage = 10;
    const history = useHistory();

    const [expandedRows, setExpandedRows] = useState(null);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [exibirBtnMarcarComoCorreto, setExibirBtnMarcarComoCorreto] = useState(false)
    const [exibirBtnMarcarComoNaoConferido, setExibirBtnMarcarComoNaoConferido] = useState(false)
    const [showModalCheckNaoPermitido, setShowModalCheckNaoPermitido] = useState(false)
    const [showModalLegendaInformacao, setShowModalLegendaInformacao] = useState(false)

    // Hooks Personalizados
    const valor_template = useValorTemplate()
    const dataTemplate = useDataTemplate()
    const conferidoTemplate = useConferidoTemplate()
    const tabelaDespesa = useCarregaTabelaDespesa(prestacaoDeContas)
    const rowExpansionDespesaTemplate = useRowExpansionDespesaTemplate(prestacaoDeContas)
    const rowExpansionReceitaTemplate = useRowExpansionReceitaTemplate()
    const numeroDocumentoTemplate = useNumeroDocumentoTemplate()
    const tagInformacao = useTagInformacaoTemplate()

    // Redux
    const dispatch = useDispatch()

    // Manter o estado do Acompanhamento de PC
    let dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado()
    let conta_uuid = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid
    let filtrar_por_acao = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao
    let filtrar_por_lancamento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento
    let paginacao_atual = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual

    let filtrar_por_data_inicio = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_inicio
    let filtrar_por_data_fim = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_fim
    let filtrar_por_nome_fornecedor = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_nome_fornecedor
    let filtrar_por_numero_de_documento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_numero_de_documento
    let filtrar_por_tipo_de_documento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_documento
    let filtrar_por_tipo_de_pagamento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_pagamento


        useEffect(() => {
        desmarcarTodos()
    }, [contaUuid])

    const rowClassName = (rowData) => {
        if (rowData && rowData.analise_lancamento && rowData.analise_lancamento.resultado) {
            return {'linha-conferencia-de-lancamentos-correto': true}
        }
    }

    const rowExpansionTemplate = (data) => {
        if (data.tipo_transacao === 'Crédito') {
            return (
                rowExpansionReceitaTemplate(data)
            )
        } else {
            return (
                rowExpansionDespesaTemplate(data)
            )
        }
    };

    const selecionarPorStatus = (event, status = null) => {
        event.preventDefault();
        desmarcarTodos(event)
        let cont = 0;
        let result
        if (status) {
            if(status === "CORRETO"){
                setExibirBtnMarcarComoCorreto(false)
                setExibirBtnMarcarComoNaoConferido(true)
            }
            else if(status === "AJUSTE"){
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            }

            result = lancamentosParaConferencia.reduce((acc, o) => {
                let obj = o.analise_lancamento && o.analise_lancamento.resultado && o.analise_lancamento.resultado === status ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        } else {
            setExibirBtnMarcarComoCorreto(true)
            setExibirBtnMarcarComoNaoConferido(false)
            result = lancamentosParaConferencia.reduce((acc, o) => {
                let obj = !o.analise_lancamento ? Object.assign(o, {selecionado: true}) : o;
                if (obj.selecionado) {
                    cont = cont + 1;
                }
                acc.push(obj);
                return acc;
            }, []);
        }
        setLancamentosParaConferencia(result);
        setQuantidadeSelecionada(cont);
    }

    const desmarcarTodos = () => {
        setExibirBtnMarcarComoCorreto(false)
        setExibirBtnMarcarComoNaoConferido(false)
        let result = lancamentosParaConferencia.reduce((acc, o) => {
            let obj = Object.assign(o, {selecionado: false});
            acc.push(obj);
            return acc;
        }, []);
        setLancamentosParaConferencia(result);
        setQuantidadeSelecionada(0);
    }

    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={lancamentosParaConferencia.filter(u => u.documento_mestre.uuid === rowData.documento_mestre.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.documento_mestre.uuid, rowData)}
                    name="checkAtribuido"
                    id="checkAtribuido"
                    disabled={!editavel}
                />
            </div>
        )
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle">
                {editavel &&
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" className="p-0">
                            <input
                                checked={false}
                                type="checkbox"
                                value=""
                                onChange={(e) => e}
                                name="checkHeader"
                                id="checkHeader"
                                disabled={!editavel}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "CORRETO")}>Selecionar todos
                                corretos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, "AJUSTE")}>
                                Selecionar todos com solicitação de ajuste</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => selecionarPorStatus(e, null)}>Selecionar todos não
                                conferidos</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
                }
            </div>
        )
    }

    const montagemSelecionar = () => {
        return (
            <div className="row">
                <div className="col-12"
                     style={{background: "#00585E", color: 'white', padding: "15px", margin: "0px 15px", flex: "100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "lançamento selecionado" : "lançamentos selecionados"} / {totalDelancamentosParaConferencia} totais
                        </div>
                        <div className="col-7">
                            <div className="row">
                                <div className="col-12">
                                    <button className="float-right btn btn-link btn-montagem-selecionar"
                                            onClick={(e) => desmarcarTodos(e)}
                                            style={{textDecoration: "underline", cursor: "pointer"}}>
                                        <strong>Cancelar</strong>
                                    </button>
                                    {exibirBtnMarcarComoCorreto &&
                                        <>
                                            <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                            <button
                                                className="float-right btn btn-link btn-montagem-selecionar"
                                                onClick={() => {
                                                    setStateCheckBoxOrdenarPorImposto(false)
                                                    marcarComoCorreto()
                                                }}
                                                style={{textDecoration: "underline", cursor: "pointer"}}
                                            >
                                                <FontAwesomeIcon
                                                    style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                    icon={faCheckCircle}
                                                />
                                                <strong>Marcar como Correto</strong>
                                            </button>
                                        </>
                                    }
                                    {exibirBtnMarcarComoNaoConferido &&
                                        <>
                                            <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                            <button
                                                className="float-right btn btn-link btn-montagem-selecionar"
                                                onClick={() => {
                                                    setStateCheckBoxOrdenarPorImposto(false)
                                                    marcarComoNaoConferido()
                                                }}
                                                style={{textDecoration: "underline", cursor: "pointer"}}
                                            >
                                                <FontAwesomeIcon
                                                    style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                                    icon={faCheckCircle}
                                                />
                                                <strong>Marcar como não conferido</strong>
                                            </button>
                                        </>
                                    }
                                    <div className="float-right" style={{padding: "0px 10px"}}>|</div>
                                    <button
                                        className="float-right btn btn-link btn-montagem-selecionar"
                                        onClick={() => {
                                            setStateCheckBoxOrdenarPorImposto(false)
                                            detalharAcertos()
                                        }}
                                        style={{textDecoration: "underline", cursor: "pointer"}}
                                    >
                                        <FontAwesomeIcon
                                            style={{color: "white", fontSize: '15px', marginRight: "3px"}}
                                            icon={faListUl}
                                        />
                                        <strong>Detalhar acertos</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Quando a state da lista sofrer alteração
    const totalDelancamentosParaConferencia = useMemo(() => lancamentosParaConferencia.length, [lancamentosParaConferencia]);

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="d-flex justify-content-between align-middle">
                <div>
                    Exibindo <span style={{
                    color: "#00585E",
                    fontWeight: "bold"
                }}>{totalDelancamentosParaConferencia}</span> lançamentos
                </div>
                <div>
                    <span>
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginRight: "8px", color: '#00585D'}}
                        icon={faInfoCircle}
                    />
                        <button className='legendas-table text-md-start' onClick={() => setShowModalLegendaInformacao(true)} style={{color: '#00585D', outline: 'none', border: 0, background: 'inherit', padding: '4px'}} >Legenda Informação</button>
                    </span> 
                </div>
            </div>
        )
    }

    const verificaSeExisteLancamentoComStatusDeAjuste = () => {
        let marcados = getLancamentosSelecionados()
        if (marcados && marcados.length > 0) {
            return marcados.find(element => element && element.analise_lancamento && element.analise_lancamento.resultado === 'AJUSTE')
        }
    }

    const setExibicaoBotoesMarcarComo = (rowData) => {
        let tem_lancamento_status_de_ajuste = verificaSeExisteLancamentoComStatusDeAjuste()
        if (rowData.analise_lancamento && rowData.analise_lancamento.resultado === 'CORRETO') {
            setExibirBtnMarcarComoCorreto(false)
            setExibirBtnMarcarComoNaoConferido(true)
        } else {
            if (tem_lancamento_status_de_ajuste === undefined) {
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            }
            else {
                setExibirBtnMarcarComoCorreto(true)
                setExibirBtnMarcarComoNaoConferido(false)
            }
        }
    }

    const verificaSePodeSerCheckado = (e, rowData) => {

        let selecionados = getLancamentosSelecionados()
        let status_permitido = []

        if (selecionados.length > 0) {
            if (!selecionados[0].analise_lancamento || (selecionados[0].analise_lancamento && selecionados[0].analise_lancamento.resultado && selecionados[0].analise_lancamento.resultado === "AJUSTE")) {
                status_permitido = [null, 'AJUSTE']
            } else {
                status_permitido = ['CORRETO']
            }
        }

        if (e.target.checked && status_permitido.length > 0) {
            if (status_permitido.includes(rowData.analise_lancamento) || (rowData.analise_lancamento && rowData.analise_lancamento && rowData.analise_lancamento.resultado && status_permitido.includes(rowData.analise_lancamento.resultado))) {
                return true
            } else {
                setShowModalCheckNaoPermitido(true)
                return false
            }
        } else {
            return true
        }
    }

    const tratarSelecionado = (e, lancamentosParaConferenciaUuid, rowData) => {
        if (editavel) {
            let verifica_se_pode_ser_checkado = verificaSePodeSerCheckado(e, rowData)
            if (verifica_se_pode_ser_checkado) {

                let cont = quantidadeSelecionada;
                if (e.target.checked) {
                    cont = cont + 1
                } else {
                    cont = cont - 1
                }
                setQuantidadeSelecionada(cont);
                let result = lancamentosParaConferencia.reduce((acc, o) => {
                    let obj = lancamentosParaConferenciaUuid === o.documento_mestre.uuid ? Object.assign(o, {selecionado: e.target.checked}) : o;
                    acc.push(obj);
                    return acc;
                }, []);
                setLancamentosParaConferencia(result);
                setExibicaoBotoesMarcarComo(rowData)
            }
        }
    }

    const marcarComoCorreto = async () => {
        let lancamentos_marcados_como_corretos = getLancamentosSelecionados()

        if (lancamentos_marcados_como_corretos && lancamentos_marcados_como_corretos.length > 0) {
            let payload = [];
            lancamentos_marcados_como_corretos.map((lancamento) =>
                payload.push({
                    "tipo_lancamento": lancamento.tipo_transacao === 'Gasto' ? 'GASTO' : 'CREDITO',
                    "lancamento": lancamento.documento_mestre.uuid,
                })
            );
            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'lancamentos_corretos': [
                    ...payload
                ]
            }
            try {
                await postLancamentosParaConferenciaMarcarComoCorreto(prestacaoDeContas.uuid, payload)
                console.log("Marcados como correto com sucesso!")
                desmarcarTodos()
                await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_lancamento, paginacao_atual, false, stateFiltros.filtrar_por_data_inicio, stateFiltros.filtrar_por_data_fim, stateFiltros.filtrar_por_nome_fornecedor, stateFiltros.filtrar_por_numero_de_documento, stateFiltros.filtrar_por_tipo_de_documento, stateFiltros.filtrar_por_tipo_de_pagamento)
            } catch (e) {
                console.log("Erro ao marcar como correto ", e.response)
            }
        }
    }

    const marcarComoNaoConferido = async () => {
        let lancamentos_marcados_como_nao_conferidos = getLancamentosSelecionados()

        if (lancamentos_marcados_como_nao_conferidos && lancamentos_marcados_como_nao_conferidos.length > 0) {
            let payload = [];
            lancamentos_marcados_como_nao_conferidos.map((lancamento) =>
                payload.push({
                    "tipo_lancamento": lancamento.tipo_transacao === 'Gasto' ? 'GASTO' : 'CREDITO',
                    "lancamento": lancamento.documento_mestre.uuid,
                })
            );

            payload = {
                'analise_prestacao': prestacaoDeContas.analise_atual.uuid,
                'lancamentos_nao_conferidos': [
                    ...payload
                ]
            }
            try {
                await postLancamentosParaConferenciaMarcarNaoConferido(prestacaoDeContas.uuid, payload)
                console.log("Marcados como não conferido com sucesso!")
                desmarcarTodos()
                await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_lancamento, paginacao_atual, false, stateFiltros.filtrar_por_data_inicio, stateFiltros.filtrar_por_data_fim, stateFiltros.filtrar_por_nome_fornecedor, stateFiltros.filtrar_por_numero_de_documento, stateFiltros.filtrar_por_tipo_de_documento, stateFiltros.filtrar_por_tipo_de_pagamento)
            } catch (e) {
                console.log("Erro ao marcar como não conferido ", e.response)
            }
        }
    }

    const getLancamentosSelecionados = () => {
        return lancamentosParaConferencia.filter((lancamento) => lancamento.selecionado)
    }

    const addDispatchRedireciona = (lancamentos) => {
        dispatch(limparDetalharAcertos())
        dispatch(addDetalharAcertos(lancamentos))
        history.push(`/dre-detalhe-prestacao-de-contas-detalhar-acertos/${prestacaoDeContas.uuid}`)
    }

    const detalharAcertos = () => {
        let lancamentos_marcados_para_acertos = getLancamentosSelecionados()
        addDispatchRedireciona(lancamentos_marcados_para_acertos)
    }

    const redirecionaDetalhe = (lancamento) => {
        if (editavel) {
            addDispatchRedireciona(lancamento)
        }
    }

    // Para salvar a página atual e usar em mantemEstadoAcompanhamentoDePc
    // Filtros Lancamentos
    const initialStateFiltros = {
        filtrar_por_acao: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao : "",
        filtrar_por_lancamento: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento : "",

        filtrar_por_data_inicio: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_inicio ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_inicio : "",
        filtrar_por_data_fim: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_fim ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_data_fim : "",
        filtrar_por_nome_fornecedor: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_nome_fornecedor ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_nome_fornecedor : "",
        filtrar_por_numero_de_documento: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_numero_de_documento ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_numero_de_documento : "",
        filtrar_por_tipo_de_documento: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_documento ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_documento : "",
        filtrar_por_tipo_de_pagamento: dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_pagamento ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_tipo_de_pagamento : "",
    }
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleClearDate = () => {
        setStateFiltros({
            ...stateFiltros,
            filtrar_por_data_inicio: "",
            filtrar_por_data_fim: ""
        });
    }

    const handleSubmitFiltros = async () => {
        desmarcarTodos()
        await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, stateFiltros.filtrar_por_acao, stateFiltros.filtrar_por_lancamento, paginacao_atual,  false, stateFiltros.filtrar_por_data_inicio, stateFiltros.filtrar_por_data_fim, stateFiltros.filtrar_por_nome_fornecedor, stateFiltros.filtrar_por_numero_de_documento, stateFiltros.filtrar_por_tipo_de_documento, stateFiltros.filtrar_por_tipo_de_pagamento)
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, null, null, 0);
    };

    // Paginação
    const [primeiroRegistroASerExibido, setPrimeiroRegistroASerExibido] = useState(dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual ? dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual : 0);

    const salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage = (event) => {

        // Para calcuar a pagina atual
        // primeiroRegistroASerExibido = event.rows * event.page
        let objetoAcompanhamentoDePcPorUsuario = {
            prestacao_de_conta_uuid: prestacaoDeContas.uuid,
            conferencia_de_lancamentos: {
                conta_uuid: conta_uuid,
                filtrar_por_acao: filtrar_por_acao,
                filtrar_por_data_inicio: filtrar_por_data_inicio,
                filtrar_por_data_fim: filtrar_por_data_fim,
                filtrar_por_lancamento: filtrar_por_lancamento,
                filtrar_por_nome_fornecedor: filtrar_por_nome_fornecedor,
                filtrar_por_numero_de_documento: filtrar_por_numero_de_documento,
                filtrar_por_tipo_de_documento: filtrar_por_tipo_de_documento,
                filtrar_por_tipo_de_pagamento: filtrar_por_tipo_de_pagamento,
                paginacao_atual: event.rows * event.page,
            },
        }
        meapcservice.setAcompanhamentoDePcPorUsuario(visoesService.getUsuarioLogin(), objetoAcompanhamentoDePcPorUsuario)
    }

    const onPaginationClick = (event) => {
        setPrimeiroRegistroASerExibido(event.first);
        salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage(event)
    }

    const retornaToolTipCredito = (rowData) => {
        if (rowData.documento_mestre && rowData.documento_mestre.rateio_estornado && rowData.documento_mestre.rateio_estornado.uuid) {
            let data_rateio = ""

            if(rowData.documento_mestre.rateio_estornado.data_documento){
                data_rateio = dataTemplate(null, null, rowData.documento_mestre.rateio_estornado.data_documento)
            }
            else if(rowData.documento_mestre.rateio_estornado.data_transacao){
                data_rateio = dataTemplate(null, null, rowData.documento_mestre.rateio_estornado.data_transacao)
            }
            
            let texto_tooltip = `Esse estorno está vinculado <br/> à despesa do dia ${data_rateio}.`
            return (
                <>
                    <div data-tip={texto_tooltip} data-html={true}>
                        <span>{rowData.tipo_transacao}</span>
                        <FontAwesomeIcon
                            style={{fontSize: '18px', marginLeft: "4px", color: '#2A6397'}}
                            icon={faInfoCircle}
                        />
                        <ReactTooltip/>
                    </div>
                </>
            )
        } else {
            return rowData.tipo_transacao
        }
    }

    const tipoTransacaoTemplate = (rowData) => {
        if (rowData && rowData.tipo_transacao && rowData.tipo_transacao === 'Crédito') {
            return retornaToolTipCredito(rowData)
        } else if (rowData && rowData.tipo_transacao && rowData.tipo_transacao === 'Gasto') {
            return <span>{rowData.tipo_transacao}</span>
        }
    }

    return (
        <>
            <FiltrosConferenciaDeLancamentos
                stateFiltros={stateFiltros}
                tabelasDespesa={tabelaDespesa}
                handleChangeFiltros={handleChangeFiltros}
                handleClearDate={handleClearDate}
                handleSubmitFiltros={handleSubmitFiltros}
                limpaFiltros={limpaFiltros}
            />

            {lancamentosParaConferencia && lancamentosParaConferencia.length > 0 &&
                <div className="form-group form-check">
                    <input
                        onChange={(e)=>handleChangeCheckBoxOrdenarPorImposto(e.target.checked)}
                        checked={stateCheckBoxOrdenarPorImposto}
                        name={`checkOerdenarPorImposto`}
                        id={`checkOerdenarPorImposto`}
                        type="checkbox"
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor={`checkOerdenarPorImposto`}>Ordenar com imposto vinculados às despesas</label>
                </div>
            }

            {quantidadeSelecionada > 0 ?
                montagemSelecionar() :
                mensagemQuantidadeExibida()
            }

            {lancamentosParaConferencia && lancamentosParaConferencia.length > 0 &&
                <>
                    <DataTable
                        value={lancamentosParaConferencia}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        rowExpansionTemplate={rowExpansionTemplate}
                        paginator={lancamentosParaConferencia.length > rowsPerPage}
                        rows={rowsPerPage}
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                        rowClassName={rowClassName}
                        selectionMode="single"
                        onRowClick={e => redirecionaDetalhe(e.data)}
                        stripedRows

                        // Usado para salvar no localStorage a página atual após os calculos ** ver função onPaginationClick
                        first={primeiroRegistroASerExibido}
                        onPage={onPaginationClick}
                    >
                        <Column
                            header={selecionarHeader()}
                            body={selecionarTemplate}
                            style={{borderRight: 'none', width: '5%'}}
                        />
                        <Column
                            field='data'
                            header='Data'
                            body={dataTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '10%'}}
                        />
                        <Column
                            field='tipo_transacao'
                            header='Tipo de lançamento'
                            className="align-middle text-left borda-coluna" style={{width: '17%'}}
                            body={tipoTransacaoTemplate}
                        />
                        <Column
                            field='numero_documento'
                            header='N.º do documento'
                            body={numeroDocumentoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{width: '17%'}}
                        />
                        <Column field='descricao' header='Descrição' className="align-middle text-left borda-coluna"
                                style={{width: '24%'}}/>
                        <Column 
                            field='informacao'
                            header='Informações'
                            className="align-middle text-left borda-coluna"
                            body={tagInformacao}
                            style={{width: '15%'}}/>
                        <Column
                            field='valor_transacao_total'
                            header='Valor (R$)'
                            body={valor_template}
                            className="align-middle text-left borda-coluna"
                            style={{width: '10%'}}
                        />
                        <Column
                            field='analise_lancamento'
                            header='Conferido'
                            body={conferidoTemplate}
                            className="align-middle text-left borda-coluna"
                            style={{borderRight: 'none', width: '10%'}}
                        />
                        <Column expander style={{width: '5%', borderLeft: 'none'}}/>
                    </DataTable>
                </>
            }
            <section>
                <ModalCheckNaoPermitidoConfererenciaDeLancamentos
                    show={showModalCheckNaoPermitido}
                    handleClose={() => setShowModalCheckNaoPermitido(false)}
                    titulo='Seleção não permitida'
                    texto='<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>'
                    primeiroBotaoTexto="Fechar"
                    primeiroBotaoCss="success"
                />
            </section>
            <ModalBootstrapLegendaInformacao
                show={showModalLegendaInformacao}
                primeiroBotaoOnclick={() => setShowModalLegendaInformacao(false)}
                titulo="Legenda Informação"
                primeiroBotaoTexto="Fechar"
                primeiroBotaoCss="outline-success"
                texto='<p>Esse lançamento tem um status de conferência que não pode ser selecionado em conjunto com os demais status já selecionados.</p>'
            />
        </>
    )
}

export default memo(TabelaConferenciaDeLancamentos)