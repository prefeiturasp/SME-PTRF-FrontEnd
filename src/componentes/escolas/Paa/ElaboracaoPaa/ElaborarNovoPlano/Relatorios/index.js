import RelatoriosLegado from "./index_legado";
import RelatoriosNovo from "./index_novo";
import { visoesService } from "../../../../../../services/visoes.service";
import { FEATURE_FLAGS } from "../../../../../../constantes/featureFlags";


const Relatorios = (props) =>
  visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
    ? <RelatoriosNovo {...props} />
    : <RelatoriosLegado {...props} />;

export default Relatorios;
