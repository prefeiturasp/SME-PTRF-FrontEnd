import { PaaVigenteEAnterioresLegado } from "./index_legado";
import { PaaVigenteEAnterioresNovo } from "./index_novo";
import { visoesService } from "../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../constantes/featureFlags";


export const PaaVigenteEAnteriores = () => {
    return visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
        ? <PaaVigenteEAnterioresNovo />
        : <PaaVigenteEAnterioresLegado />;
};