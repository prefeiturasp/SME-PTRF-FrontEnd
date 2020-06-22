import React, {useState} from "react";
import {MenuInterno} from "../MenuInterno";
import {TabelaMembros} from "../TabelaMembros";

export const MembrosDaAssociacao = () =>{

    const [clickIconeToogle, setClickIconeToogle] = useState(false)
    return(
        <div className="row">
            <div className="col-12">
                <MenuInterno/>
                <TabelaMembros
                    clickIconeToogle={clickIconeToogle}
                    setClickIconeToogle={setClickIconeToogle}
                />
            </div>
        </div>
    );
}