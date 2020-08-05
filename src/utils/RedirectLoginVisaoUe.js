import {visoesService} from "../services/visoes.service";

export const RedirectLoginVisaoUe = () =>{
    let visao = visoesService.getDadosDoUsuarioLogado();
    visoesService.redirectVisao(visao.visao_selecionada.nome);
    return null
};