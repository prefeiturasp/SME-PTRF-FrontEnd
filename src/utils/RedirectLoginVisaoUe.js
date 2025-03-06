import {visoesService} from "../services/visoes.service";

export const RedirectLoginVisaoUe = () =>{
    let visao = visoesService.getDadosDoUsuarioLogado();
    if (visao && visao.visao_selecionada && visao.visao_selecionada.nome){
        visoesService.redirectVisao(visao.visao_selecionada.nome);
    }
    return null
};
