import {visoesService} from "../services/visoes.service";

export const RedirectLoginVisaoUe = () =>{
    let visao = visoesService.getDadosDoUsuarioLogado();
    if (visao && visao.visao_selecionada.nome){
        visoesService.redirectVisao(visao.visao_selecionada.nome);
    }else {
        visoesService.redirectVisao("escolas");
    }

    return null
};