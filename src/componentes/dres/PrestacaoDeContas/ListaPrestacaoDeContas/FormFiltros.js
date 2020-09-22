import React from "react";

export const FormFiltros = () => {
    return (
        <>
            <form>
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                        <input name='filtrar_por_termo' type="text" className="form-control" placeholder="Escreva o termo que deseja filtrar"/>
                    </div>

                </div>
            </form>
        </>
    )
};