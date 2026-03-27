const useUnidadeSelecionada = (visoesService) => {
    const dadosUsuarioLogado = visoesService.getDadosDoUsuarioLogado()

    const getUUIDUnidadeSelecionadaTipoDRE = () => {
        if (dadosUsuarioLogado?.unidade_selecionada) {
            if (dadosUsuarioLogado.unidade_selecionada.tipo_unidade && dadosUsuarioLogado.unidade_selecionada.tipo_unidade === "DRE") {
                return dadosUsuarioLogado.unidade_selecionada.uuid || null;
            }
        }

        return null
    }

    return { getUUIDUnidadeSelecionadaTipoDRE };
}

export default useUnidadeSelecionada;