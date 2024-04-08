import {visoesService} from "../../../services/visoes.service";

export const RetornaSeTemPermissaoEdicaoHistoricoDeMembros = () => {
    return visoesService.getPermissoes(["change_associacao"])
}