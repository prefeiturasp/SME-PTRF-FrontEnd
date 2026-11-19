import { ElaboracaoPaaLegado } from "./index_legado";
import { ElaboracaoPaaNovo } from "./index_novo";
import { visoesService } from "../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../constantes/featureFlags";

export const ElaboracaoPaa = () => 
  visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
    ? <ElaboracaoPaaNovo />
    : <ElaboracaoPaaLegado />;

