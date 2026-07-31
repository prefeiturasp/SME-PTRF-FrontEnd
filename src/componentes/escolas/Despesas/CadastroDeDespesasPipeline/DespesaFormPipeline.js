import React from "react";
import {CadastroForm} from "./CadastroForm";

/**
 * Entrada do formulário de despesa (variante pipeline).
 * CadastroForm orquestra controller → Provider + Formik + modais.
 */
export const DespesaFormPipeline = ({verbo_http, veioDeSituacaoPatrimonial}) => (
    <CadastroForm
        verbo_http={verbo_http}
        veioDeSituacaoPatrimonial={veioDeSituacaoPatrimonial}
    />
);
