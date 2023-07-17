import React from "react";
import {AddUsuario} from "./AddUsuario";
export const BarraTopoLista = () => {
    return (
        <>
            <div className="barra-topo-lista-usuarios d-flex bd-highlight align-items-center">
                <div className="py-2 flex-grow-1 bd-highlight"><h2>Usuários com acesso</h2></div>
                <div className="p-2 bd-highlight">
                    <AddUsuario/>
                </div>
            </div>
        </>
    )
}
