import React from "react";
import "./form-filtro-por-palavra.scss"
import {filtroPorPalavraReceitas} from "../../services/Receitas.service";
import {filtroPorPalavraRateios} from "../../services/RateiosDespesas.service";


export const FormFiltroPorPalavra = (props) => {

    const {inputPesquisa, setInputPesquisa, set_filtro_por_palavra, setLista, origem} = props

    const handleSubmitFormFiltroPorPalavra = async (event) => {
        event.preventDefault();
        let lista_retorno_api
        if (origem === "Receitas"){
            lista_retorno_api =  await filtroPorPalavraReceitas(inputPesquisa)
        }else if(origem === "Despesas"){
            lista_retorno_api =  await filtroPorPalavraRateios(inputPesquisa)
        }

        setLista(lista_retorno_api)
        set_filtro_por_palavra(true)
    }

    return (
        <form className="form-inline" onSubmit={handleSubmitFormFiltroPorPalavra}>
            <div className="form-group container-form-filtro-por-palavra mr-0 mb-2">
                <input value={inputPesquisa} onChange={(e)=>setInputPesquisa(e.target.value)} name="inputPesquisa" type="text" className="form-control w-100" id="inputPesquisa" placeholder="Escreva o termo que deseja filtrar"/>
            </div>
            <button type="submit" className="btn btn btn btn-success mr-0 mb-2 ml-md-2 float-right">Filtrar</button>
        </form>
    )
}