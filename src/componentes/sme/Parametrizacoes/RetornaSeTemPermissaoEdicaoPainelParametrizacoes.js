import {visoesService} from "../../../services/visoes.service";

export const RetornaSeTemPermissaoEdicaoPainelParametrizacoes = () => {
    return visoesService.getPermissoes(["change_painel_parametrizacoes"])
}