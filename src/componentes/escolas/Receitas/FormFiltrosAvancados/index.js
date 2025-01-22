import React, {useEffect, useState} from "react";
import {getTabelasReceitaReceita} from "../../../../services/escolas/Receitas.service";
import {filtrosAvancadosReceitas} from "../../../../services/escolas/Receitas.service";
import {DatePickerField} from "../../../Globais/DatePickerField";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";
import { mantemEstadoFiltrosUnidade } from "../../../../services/mantemEstadoFiltrosUnidade.service";

export const FormFiltrosAvancados = (props) => {

    const {btnMaisFiltros, onClickBtnMaisFiltros, setLista, setBuscaUtilizandoFiltro, iniciaLista, buscaTotaisReceitas, previousPath, state, setState, initialState} = props;
    
    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);

    useEffect(() => {
        if (!previousPath) return;

        if (previousPath.includes('/edicao-de-receita')) {
            const storedFiltros = mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades();
            let filtrosCompletos = { ...storedFiltros };
            setState(filtrosCompletos);
        };
    }, [])

    useEffect(() => {
        const carregaTabelas = async () => {
            let tabelas_receitas = await getTabelasReceitaReceita()
            setTabelas(tabelas_receitas)
        };

        carregaTabelas()
    }, []);

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let data_inicio = state.data_inicio ? moment(state.data_inicio, "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = state.data_fim ? moment(state.data_fim, "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        buscaTotaisReceitas(state.tipo_receita, state.acao_associacao, state.conta_associacao, data_inicio, data_fim);
        const lista_retorno_api = await filtrosAvancadosReceitas(state.filtrar_por_termo, state.tipo_receita, state.acao_associacao, state.conta_associacao, data_inicio, data_fim);
        setLista(lista_retorno_api);
        setBuscaUtilizandoFiltro(true)

        mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(visoesService.getUsuarioLogin(), {
            filtros_receitas: {
                filtrar_por_termo: state.filtrar_por_termo, tipo_receita: state.tipo_receita, acao_associacao: state.acao_associacao, conta_associacao: state.conta_associacao, data_inicio, data_fim
            },
        });
    };

    const limpaFormulario = () => {
        setState(initialState);
    };

    return (
        <div className={`row ${btnMaisFiltros ? "lista-de-receitas-visible" : "lista-de-receitas-invisible"}`}>
            <div className="col-12">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-lg-6">
                            <label htmlFor="tipo_receita">Filtrar por tipo de crédito</label>
                            <select value={state.tipo_receita}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    name="tipo_receita" id="tipo_receita" className="form-control">
                                <option key={0} value="">Selecionar um tipo</option>
                                {tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 ? (tabelas.tipos_receita.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))) : null}
                            </select>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="row">
                                <div className="form-group col-12 col-md-6 pr-md-1">
                                    <label htmlFor="filtrar_por_termo">Detalhamento do crédito</label>
                                    <input value={state.filtrar_por_termo}
                                       onChange={(e) => handleChange(e.target.name, e.target.value)}
                                       name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control"
                                       placeholder="Termo que deseja filtrar"/>
                                </div>
                                <div className="form-group col-12 col-md-6 pl-md-1">
                                    <label htmlFor="conta_associacao">Filtrar por conta</label>
                                    <select id="conta_associacao" name="conta_associacao" value={state.conta_associacao}
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            className="form-control"
                                    >
                                        <option key={0} value="">Selecione uma conta</option>
                                        {tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0 ? (tabelas.contas_associacao.map((item, key) => (
                                            <option key={key} value={item.uuid}>{item.nome} {item.solicitacao_encerramento ? `- Conta encerrada em ${moment(item.solicitacao_encerramento.data_de_encerramento_na_agencia).format('DD/MM/YYYY')}` : ''}</option>
                                        ))) : null}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-12 col-lg-6">
                            <label htmlFor="acao_associacao">Ação</label>
                            <select id="acao_associacao" name="acao_associacao" value={state.acao_associacao}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    className="form-control"
                            >
                                <option key={0} value="">Selecione status</option>
                                {tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                ))) : null}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="data_inicio">Filtrar por período</label>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-5 pr-0">
                                    <DatePickerField
                                        name="data_inicio"
                                        id="data_inicio"
                                        value={state.data_inicio}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 col-md-2 p-0 text-md-center ">
                                    <span>até</span>
                                </div>
                                <div className="col-12 col-md-5 pl-0">
                                    <DatePickerField
                                        name="data_fim"
                                        id="data_fim"
                                        value={state.data_fim}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={(e) => {
                                onClickBtnMaisFiltros();
                                iniciaLista();
                                buscaTotaisReceitas();
                                limpaFormulario()
                            }
                            }
                            className="btn btn-outline-success mt-2"
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={(e) => {
                                iniciaLista();
                                buscaTotaisReceitas();
                                limpaFormulario()
                            }
                            }
                            className="btn btn-outline-success mt-2 ml-2"
                            type="button"
                        >
                            Limpar Filtros
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success mt-2 ml-2"
                        >
                            Filtrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};