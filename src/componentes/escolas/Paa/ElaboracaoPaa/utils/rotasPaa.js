import { visoesService } from "../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../constantes/featureFlags";

export const rotaElaboracaoPaa = (paaUuid) =>
      visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
        ? `/elaborar-novo-paa/${paaUuid}`
        : '/elaborar-novo-paa';