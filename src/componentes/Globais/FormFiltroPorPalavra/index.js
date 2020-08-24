import React from "react";
import "./form-filtro-por-palavra.scss"
import {filtroPorPalavraReceitas} from "../../../services/escolas/Receitas.service";
import {filtroPorPalavraRateios} from "../../../services/escolas/RateiosDespesas.service";


export const FormFiltroPorPalavra = (props) => {

    const {inputPesquisa, setInputPesquisa, setBuscaUtilizandoFiltro, setLista, origem, reusltadoSomaDosTotais, setLoading} = props

    const handleSubmitFormFiltroPorPalavra = async (event) => {
        event.preventDefault();
        setLoading(true)
        let lista_retorno_api
        if (origem === "Receitas"){
            lista_retorno_api =  await filtroPorPalavraReceitas(inputPesquisa)
        }else if(origem === "Despesas"){
            lista_retorno_api =  await filtroPorPalavraRateios(inputPesquisa)
        }
        if(reusltadoSomaDosTotais){
            reusltadoSomaDosTotais(inputPesquisa);
        }
        setLista(lista_retorno_api)
        setBuscaUtilizandoFiltro(true)
        setLoading(false)
    }

    return (
        <form className="form-inline" onSubmit={handleSubmitFormFiltroPorPalavra}>
            <div className="d-flex align-items-center mr-2 mb-2 w-100">
                <input value={inputPesquisa} onChange={(e)=>setInputPesquisa(e.target.value)} name="inputPesquisa" type="text" className="form-control w-100" id="inputPesquisa" placeholder="Escreva o termo que deseja filtrar"/>
                <button type="submit" className="btn btn btn btn-success mr-0 mb-2 ml-md-2 mt-2">Filtrar</button>
            </div>
        </form>
    )
}