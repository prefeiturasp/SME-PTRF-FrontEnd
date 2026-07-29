import React from "react";
import {CadastroForm} from "./CadastroForm";
import {CadastroDeDespesasPipeline} from "../CadastroDeDespesasPipeline";
import {visoesService} from "../../../../services/visoes.service";
import {FEATURE_FLAGS} from "../../../../constantes/featureFlags";

export const CadastroDeDespesas = ({verbo_http, veioDeSituacaoPatrimonial}) => {
    if (visoesService.featureFlagAtiva(FEATURE_FLAGS.DESPESAS_PIPELINE)) {
        return (
            <CadastroDeDespesasPipeline
                verbo_http={verbo_http}
                veioDeSituacaoPatrimonial={veioDeSituacaoPatrimonial}
            />
        );
    }

    return (
        <CadastroForm
            verbo_http={verbo_http}
            veioDeSituacaoPatrimonial={veioDeSituacaoPatrimonial}
        />
    );
};
