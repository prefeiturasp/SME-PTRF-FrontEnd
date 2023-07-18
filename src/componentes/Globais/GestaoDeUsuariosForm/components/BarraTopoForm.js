import React, {useContext} from "react";
import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";
import {BtnVoltar} from "./BtnVoltar";
import {BtnSalvar} from "./BtnSalvar";
export const BarraTopoForm = () => {
    const { modo} = useContext(GestaoDeUsuariosFormContext)
    return (
        <>
            <div className="barra-topo-form-usuarios d-flex bd-highlight align-items-center">
                <div className="py-2 flex-grow-1 bd-highlight"><h2>{modo}</h2></div>
                <div className="p-2 bd-highlight">
                    <BtnSalvar/>
                </div>
                <div className="p-2 bd-highlight">
                    <BtnVoltar/>
                </div>
            </div>
        </>
    )
}
