import React from "react";
import {PaginasContainer} from "../../../PaginasContainer";
import {CadastroSaidaForm as CadastroSaidaFormLegado} from "../../../../componentes/escolas/Despesas/CadastroDeDespesas/CadastroSaidaForm";
import {CadastroSaidaForm as CadastroSaidaFormPipeline} from "../../../../componentes/escolas/Despesas/CadastroDeDespesasPipeline/CadastroSaidaForm";
import {visoesService} from "../../../../services/visoes.service";
import {FEATURE_FLAGS} from "../../../../constantes/featureFlags";

export const CadastroSaida = () => {
    const CadastroSaidaForm = visoesService.featureFlagAtiva(FEATURE_FLAGS.DESPESAS_PIPELINE)
        ? CadastroSaidaFormPipeline
        : CadastroSaidaFormLegado;

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de saída</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <CadastroSaidaForm
                    verbo_http={"POST"}
                />
            </div>
        </PaginasContainer>
    );
};
