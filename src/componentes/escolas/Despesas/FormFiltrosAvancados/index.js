import React, {useCallback, useEffect, useState} from "react";
import {getDespesasTabelas, getTagInformacao} from "../../../../services/escolas/Despesas.service";
import {DatePickerField} from '../../../Globais/DatePickerField'
import moment from "moment";
import {gerarUuid} from "../../../../utils/ValidacoesAdicionaisFormularios";
import './multiselect.scss'
import {Select} from 'antd';

export const FormFiltrosAvancados = (props) => {

    const {Option} = Select;

    const initialState = {
        filtrar_por_termo: "",
        aplicacao_recurso: "",
        acao_associacao: "",
        despesa_status: "",
        fornecedor: "",
        data_inicio: "",
        data_fim: "",
        conta_associacao: "",
    };

    const {
        btnMaisFiltros,
        onClickBtnMaisFiltros,
        iniciaLista,
        reusltadoSomaDosTotais,
        filtrosAvancados,
        setFiltrosAvancados,
        buscaDespesasFiltrosAvancados,
        setBuscaUtilizandoFiltroAvancado,
        setBuscaUtilizandoFiltroPalavra,
        forcarPrimeiraPagina,
        setBuscaUtilizandoFiltro,
        setLoading,
        filtro_informacoes,
        filtro_vinculo_atividades,
        handleChangeFiltroInformacoes,
        handleChangeFiltroVinculoAtividades
    } = props;
    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [listaTagInformacao, setListaTagInformacao] = useState([])

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();

    }, []);

    const handleTagInformacao = useCallback(async () => {
        try {
            const response = await getTagInformacao()
            setListaTagInformacao(response)
        } catch (e) {
            console.error('Erro ao carregar tag informação', e)
        }
    }, [])

    useEffect(() => {
        handleTagInformacao()
    }, [handleTagInformacao])

    const handleChange = (name, value) => {
        setFiltrosAvancados({
            ...filtrosAvancados,
            [name]: value
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        let data_inicio = filtrosAvancados.data_inicio ? moment(new Date(filtrosAvancados.data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        let data_fim = filtrosAvancados.data_fim ? moment(new Date(filtrosAvancados.data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        reusltadoSomaDosTotais(filtrosAvancados.filtrar_por_termo, filtrosAvancados.aplicacao_recurso, filtrosAvancados.acao_associacao, filtrosAvancados.despesa_status, filtrosAvancados.fornecedor, data_inicio, data_fim, filtrosAvancados.conta_associacao, filtro_vinculo_atividades, filtro_informacoes);

        buscaDespesasFiltrosAvancados();
        setBuscaUtilizandoFiltroAvancado(true);
        setBuscaUtilizandoFiltroPalavra(false);
        setBuscaUtilizandoFiltro(true);
    };

    const limpaFormulario = () => {
        forcarPrimeiraPagina(gerarUuid());
        setFiltrosAvancados(initialState);
    };

    return (
        <div className={`row ${btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
            <div className='col-12'>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_termo">Especificação do material ou serviço</label>
                            <input value={filtrosAvancados.filtrar_por_termo}
                                   onChange={(e) => handleChange(e.target.name, e.target.value)}
                                   name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control"
                                   placeholder="Escreva o termo que deseja filtrar"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="aplicacao_recurso">Aplicação</label>
                            <select value={filtrosAvancados.aplicacao_recurso}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    name="aplicacao_recurso"
                                    id="aplicacao_recurso_form_filtros_avancados_despesas"
                                    className="form-control"
                            >
                                <option key={0} value="">Selecione um tipo</option>
                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="acao_associacao">Ação</label>
                            <select value={filtrosAvancados.acao_associacao}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    name="acao_associacao"
                                    id="acao_associacao_form_filtros_avancados_despesas"
                                    className="form-control"
                            >
                                <option key={0} value="">Selecione uma ação</option>
                                {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="informacao">Informação</label>

                            <Select
                                mode="multiple"
                                allowClear
                                style={{width: '100%'}}
                                placeholder="Selecione os status"
                                value={filtro_informacoes}
                                onChange={handleChangeFiltroInformacoes}
                                className='multiselect-filtrar-por-status'
                            >
                                {listaTagInformacao && listaTagInformacao.length > 0 && listaTagInformacao.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="conta_associacao">Conta</label>
                            <select id="conta_associacao" name="conta_associacao"
                                    value={filtrosAvancados.conta_associacao}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    className="form-control"
                            >
                                <option key={0} value="">Selecione um tipo</option>
                                {despesasTabelas.contas_associacao !== undefined && despesasTabelas.contas_associacao.length > 0 ? (despesasTabelas.contas_associacao.map((item, key) => (
                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                ))) : null}
                            </select>
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="despesa_status">Status</label>
                            <select value={filtrosAvancados.despesa_status}
                                    onChange={(e) => handleChange(e.target.name, e.target.value)} name="despesa_status"
                                    id="despesa_status" className="form-control">
                                <option key={0} value="">Selecione status</option>
                                <option key="COMPLETO" value="COMPLETO">COMPLETO</option>
                                <option key="INCOMPLETO" value="INCOMPLETO">RASCUNHO</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="filtro_vinculo_atividades">Esse gasto possui vínculo com alguma atividade específica?</label>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Selecione a atividade"
                                value={filtro_vinculo_atividades}
                                onChange={handleChangeFiltroVinculoAtividades}
                                className='multiselect-filtrar-por-status'
                            >
                                {despesasTabelas.tags && despesasTabelas.tags.length > 0 && despesasTabelas.tags.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="col-12">
                            <div className="row">
                                <div className="form-group col-md-7">
                                    <label htmlFor="fornecedor">Fornecedor</label>
                                    <input
                                        value={filtrosAvancados.fornecedor}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        name="fornecedor"
                                        id="fornecedor"
                                        type="text"
                                        className="form-control"
                                        placeholder="Escreva a razão social"
                                    />
                                </div>
                                <div className="form-group col-md-5">
                                    <label htmlFor="data_inicio">Período</label>
                                    <div className="row align-items-center">
                                        <div className="col-12 col-md-5 pr-0">
                                            <DatePickerField
                                                name="data_inicio"
                                                id="data_inicio"
                                                value={filtrosAvancados.data_inicio}
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
                                                value={filtrosAvancados.data_fim}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={(e) => {
                                onClickBtnMaisFiltros();
                                iniciaLista();
                                reusltadoSomaDosTotais();
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
                                reusltadoSomaDosTotais();
                                limpaFormulario();
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