import {useEffect, useState} from "react";
import {visoesService} from "../../services/visoes.service";

export const useAcessoEmSuporteInfo = () =>{
    const [unidadeEstaEmSuporte, setUnidadeEstaEmSuporte] = useState(false)

    const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado()

    useEffect(() => {
        const verificaSeUnidadeEstaEmSuporte = () => {
        if (dadosUsuarioLogado) {
            const unidadeSelecionada = dadosUsuarioLogado.unidades.find(obj => {
                return obj.uuid === dadosUsuarioLogado.unidade_selecionada.uuid
            })
            if (unidadeSelecionada && unidadeSelecionada.acesso_de_suporte){
                setUnidadeEstaEmSuporte(unidadeSelecionada.acesso_de_suporte)
            }
        }
    }
        verificaSeUnidadeEstaEmSuporte()
    }, [dadosUsuarioLogado]);

    return {unidadeEstaEmSuporte}
}