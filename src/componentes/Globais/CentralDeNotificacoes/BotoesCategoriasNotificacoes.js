import React from "react";

export const BotoesCategoriasNotificacoes =({handleClickBtnCategorias}) =>{
    return(
        <div className="btn-group btn-group-toggle container-btn-broup-categorias mt-3" data-toggle="buttons">
            <label className="btn btn-outline-light active">
                <input onClick={(e)=>handleClickBtnCategorias(e)}  onChange={()=>{}}  type="radio" name="options" id="todas" checked={true}/> Todas
            </label>
            <label className="btn btn-outline-light">
                <input onClick={(e)=>handleClickBtnCategorias(e)}  onChange={()=>{}}  type="radio" name="options" id="nao_lidas"/> Não Lidas
            </label>
            <label className="btn btn-outline-light">
                <input onClick={(e)=>handleClickBtnCategorias(e)}  onChange={()=>{}}  type="radio" name="options" id="lidas"/> Lidas
            </label>
        </div>
    )
};