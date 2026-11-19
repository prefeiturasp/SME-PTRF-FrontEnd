import { ElaborarNovoPlanoLegado } from "./index_legado";
import { ElaborarNovoPlanoNovo } from "./index_novo";
import { visoesService } from "../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../constantes/featureFlags";

export const ElaborarNovoPlano = () =>
  visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
    ? <ElaborarNovoPlanoNovo />
    : <ElaborarNovoPlanoLegado />;