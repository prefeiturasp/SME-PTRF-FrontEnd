import { visoesService } from "../../../../services/visoes.service";

export const RetornaSeTemPermissaoEdicaoGestaoUsuarios = () => {

    if(visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'UE'){
        return visoesService.getPermissoes(["change_gestao_usuarios_ue"])
    }
    else if(visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'DRE'){
        return visoesService.getPermissoes(["change_gestao_usuarios_dre"])
    }
    else if(visoesService.getItemUsuarioLogado('visao_selecionada.nome') === 'SME'){
        return visoesService.getPermissoes(["change_gestao_usuarios_sme"])
    }
}