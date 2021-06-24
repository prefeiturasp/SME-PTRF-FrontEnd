import React, {useEffect, useState} from "react";
import {getTabelasReceitaReceita} from "../../../../services/escolas/Receitas.service";
import {filtrosAvancadosReceitas} from "../../../../services/escolas/Receitas.service";

export const FiltroPorTipoReceita = (props) => {
    const {setBuscaUtilizandoFiltro, setLista} = props

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initialState = {
        filtrar_por_termo: "",
        tipo_receita: "",
        acao_associacao: "",
        conta_associacao: "",
        data_inicio: "",
        data_fim: "",
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [state, setState] = useState(initialState);

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
        const lista_retorno_api = await filtrosAvancadosReceitas(state.filtrar_por_termo, state.tipo_receita, state.acao_associacao, state.conta_associacao, null, null);
        setLista(lista_retorno_api);
        setBuscaUtilizandoFiltro(true)
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
