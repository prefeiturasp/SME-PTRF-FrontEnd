import React from "react";
import {MenuInterno} from "../MenuInterno";
import {TabelaMembros} from "../TabelaMembros";

export const MembrosDaAssociacao = () =>{
    return(
        <div className="row">
            <div className="col-12">
                <MenuInterno/>
                <TabelaMembros/>

            </div>
        </div>

    );
}