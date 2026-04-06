import { useCallback } from "react";
 
const useUnidadeSelecionada = (visoesService) => {
    const getUUIDUnidadeSelecionadaTipoDRE = useCallback(() => {
        const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado()
 
        if (dadosUsuarioLogado?.unidade_selecionada) {
            if (dadosUsuarioLogado.unidade_selecionada.tipo_unidade && dadosUsuarioLogado.unidade_selecionada.tipo_unidade === "DRE") {
                return dadosUsuarioLogado.unidade_selecionada.uuid || null;
            }
        }
 
        return null
    }, [visoesService])
 
    return { getUUIDUnidadeSelecionadaTipoDRE };
}
 
export default useUnidadeSelecionada;