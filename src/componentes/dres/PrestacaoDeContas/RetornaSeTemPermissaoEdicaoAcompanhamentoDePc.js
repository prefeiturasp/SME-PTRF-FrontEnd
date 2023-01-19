import {visoesService} from "../../../services/visoes.service";

export const RetornaSeTemPermissaoEdicaoAcompanhamentoDePc = () => {
    return visoesService.getPermissoes(["change_acompanhamento_pcs_dre"])
}