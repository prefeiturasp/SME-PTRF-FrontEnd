import React, {useEffect, useState} from "react";
import {getDespesasTabelas} from "../../../services/Despesas.service";
import {filtrosAvancadosRateios} from "../../../services/RateiosDespesas.service";

export const FormFiltrosAvancados = (props) => {

    const {btnMaisFiltros, onClickBtnMaisFiltros, buscaUtilizandoFiltro, setBuscaUtilizandoFiltro, setLista} = props;
    const [despesasTabelas, setDespesasTabelas] = useState([])

    const [filtrarPorTermo, setFiltrarPorTermo] = useState("")
    const [aplicacaoRecurso, setAplicacaoRecurso] = useState("")
    const [acaoAssociacao, setAcaoAssociacao] = useState("")
    const [despesaStatus, setDespesaStatus] = useState("")

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);
        };
        carregaTabelasDespesas();

    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const lista_retorno_api =  await filtrosAvancadosRateios(filtrarPorTermo, aplicacaoRecurso, acaoAssociacao, despesaStatus)
        setLista(lista_retorno_api)
        setBuscaUtilizandoFiltro(true)
    }

    return (
        <div className={`row ${btnMaisFiltros ? "lista-de-despesas-visible" : "lista-de-despesas-invisible"}`}>
            <div className='col-12'>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">

                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                            <input value={filtrarPorTermo} onChange={(e)=>setFiltrarPorTermo(e.target.value)} name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control" placeholder="Escreva o termo que deseja filtrar"/>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="acao_associacao">Filtrar por ação</label>
                            <select value={acaoAssociacao} onChange={(e)=>setAcaoAssociacao(e.target.value)} name="acao_associacao" id="acao_associacao" className="form-control">
                                <option key={0} value="">Selecione uma ação</option>
                                {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="aplicacao_recurso">Filtrar por tipo de aplicação</label>
                            <select value={aplicacaoRecurso} onChange={(e)=>setAplicacaoRecurso(e.target.value)} name="aplicacao_recurso" id="aplicacao_recurso" className="form-control">
                                <option key={0} value="">Selecione um tipo</option>
                                {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="despesa_status">Filtrar por status</label>
                            <select value={despesaStatus} onChange={(e)=>setDespesaStatus(e.target.value)} name="despesa_status" id="despesa_status" className="form-control">
                                <option key={0} value="">Selecione status</option>
                                <option key="COMPLETO" value="COMPLETO">Completo</option>
                                <option key="INCOMPLETO" value="INCOMPLETO">Incompleto</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={onClickBtnMaisFiltros}
                            className="btn btn-outline-success mt-2 mr-2"
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