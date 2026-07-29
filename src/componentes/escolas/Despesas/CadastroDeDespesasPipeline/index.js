import React from "react";
import {CadastroForm} from "./CadastroForm";

export const CadastroDeDespesasPipeline = ({verbo_http, veioDeSituacaoPatrimonial}) =>{

    return (
        <CadastroForm
            verbo_http={verbo_http}
            veioDeSituacaoPatrimonial={veioDeSituacaoPatrimonial}
        />
    );

}
