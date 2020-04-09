import React from "react";
import "./form-filtro-por-palavra.scss"

export const FormFiltroPorPalavra = (props) => {

    const {onSubmit, inputValue, onChange} = props

    return (
        <form className="form-inline" onSubmit={onSubmit}>
            <div className="form-group container-form-filtro-por-palavra mr-0 mb-2">
                <input value={inputValue} onChange={onChange} name="inputPesquisa" type="text" className="form-control w-100" id="inputPesquisa" placeholder="Escreva o termo que deseja filtrar"/>
            </div>
            <button type="submit" className="btn btn btn btn-success mr-0 mb-2 ml-md-2 float-right">Filtrar</button>
        </form>
    )
}