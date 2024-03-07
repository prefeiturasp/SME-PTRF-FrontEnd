import {visoesService} from "../../../../services/visoes.service";

export const RetornaSeFlagAtiva = () => {
    return visoesService.featureFlagAtiva('pc-reprovada-nao-apresentacao')
}
