import React from "react";
import { Mandatos } from "./Mandatos";
import { MandatosVacancia } from "./MandatosVacancia";
import { visoesService } from "../../services/visoes.service";

export const PainelMandatos = () => {
    const v2Ativa = visoesService.featureFlagAtiva('historico-de-membros-v2');
    return v2Ativa ? <MandatosVacancia /> : <Mandatos />;
};
