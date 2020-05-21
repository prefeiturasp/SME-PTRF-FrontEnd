import React, {useEffect, useState} from "react";
import {getDespesasTabelas} from "../../../services/Despesas.service";
import {filtrosAvancadosRateios} from "../../../services/RateiosDespesas.service";

export const FormFiltrosAvancados = (props) => {

    const initialState = {
        filtrar_por_termo: "",
        aplicacao_recurso: "",
        acao_associacao: "",
        despesa_status: "",
    }

    const {btnMaisFiltros, onClickBtnMaisFiltros, setBuscaUtilizandoFiltro, setLista, iniciaLista, reusltadoSomaDosTotais, setLoading} = props;

    const [despesasTabelas, setDespesasTabelas] = useState([])
    const [state, setState] = useState(initialState);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();

    }, [])

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //setLoading(true);
        reusltadoSomaDosTotais(state.filtrar_por_termo, state.aplicacao_recurso, state.acao_associacao, state.despesa_status);
        const lista_retorno_api =  await filtrosAvancadosRateios(state.filtrar_por_termo, state.aplicacao_recurso, state.acao_associacao, state.despesa_status)
        setLista(lista_retorno_api)
        setBuscaUtilizandoFiltro(true)
       // setLoading(false)

    }

    const limpaFormulario = () => {
        setState(initialState);
    }

    return (
        <div className={`row ${btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
            <div className='col-12'>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">

                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                            <input value={state.filtrar_por_termo} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control" placeholder="Escreva o termo que deseja filtrar"/>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="acao_associacao">Filtrar por ação</label>
                            <select value={state.acao_associacao} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="acao_associacao" id="acao_associacao" className="form-control">
                                <option key={0} value="">Selecione uma ação</option>
                                {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="aplicacao_recurso">Filtrar por tipo de aplicação</label>
                            <select value={state.aplicacao_recurso} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="aplicacao_recurso" id="aplicacao_recurso" className="form-control">
                                <option key={0} value="">Selecione um tipo</option>
                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="despesa_status">Filtrar por status</label>
                            <select value={state.despesa_status} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="despesa_status" id="despesa_status" className="form-control">
                                <option key={0} value="">Selecione status</option>
                                <option key="COMPLETO" value="COMPLETO">Completo</option>
                                <option key="INCOMPLETO" value="INCOMPLETO">Incompleto</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={(e)=>{
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
}