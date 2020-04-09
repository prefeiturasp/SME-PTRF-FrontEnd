import React from "react";

export const FormFiltroPorPalavra = (props) => {

    const {onSubmit, inputValue, onChange} = props

    return (
        <form className="form-inline" onSubmit={onSubmit}>
            <div className="form-group mr-2 mb-2 w-75">
                <input value={inputValue} onChange={onChange} name="inputPesquisa" type="text" className="form-control w-100" id="inputPesquisa" placeholder="Escreva o termo que deseja filtrar"/>
            </div>
            <button type="submit" className="btn btn btn-outline-success mr-2 mb-2">Filtrar</button>
        </form>
    )
}