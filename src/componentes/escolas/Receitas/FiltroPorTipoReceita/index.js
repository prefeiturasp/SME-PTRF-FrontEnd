import React, {useEffect, useState} from "react";
import {getTabelasReceitaReceita} from "../../../../services/escolas/Receitas.service";
import {filtrosAvancadosReceitas} from "../../../../services/escolas/Receitas.service";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";
import { mantemEstadoFiltrosUnidade } from "../../../../services/mantemEstadoFiltrosUnidade.service";

export const FiltroPorTipoReceita = (props) => {
    const {setBuscaUtilizandoFiltro, setLista, buscaTotaisReceitas, previousPath, state, setState} = props

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

        buscaTotaisReceitas(state.tipo_receita);
        const lista_retorno_api = await filtrosAvancadosReceitas(state.filtrar_por_termo, state.tipo_receita, state.acao_associacao, state.conta_associacao, null, null);
        setLista(lista_retorno_api);
        setBuscaUtilizandoFiltro(true)

        mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(visoesService.getUsuarioLogin(), {
            filtros_receitas: {
                filtrar_por_termo: state.filtrar_por_termo, tipo_receita: state.tipo_receita, acao_associacao: state.acao_associacao, conta_associacao: state.conta_associacao, data_inicio, data_fim
            },
        });
    };

    return (
        <form className="form-inline">
            <div className="d-flex align-items-center mr-2 mb-2 w-100">
                <select value={state.tipo_receita}
                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                        name="tipo_receita" id="tipo_receita" className="form-control w-100">
                    <option key={0} value="">Selecionar um tipo</option>
                    {tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 ? (tabelas.tipos_receita.map(item => (
                        <option key={item.id} value={item.id}>{item.nome}</option>
                    ))) : null}
                </select>
                <button onClick={(e) => handleSubmit(e)} className="btn btn btn btn-success mr-0 mb-2 ml-md-2 mt-2">Filtrar</button>
            </div>
        </form>
    );
};
