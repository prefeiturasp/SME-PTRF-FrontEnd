import { visoesService } from "../visoes.service";
import { recursoSelecionadoStorageService } from "./RecursoSelecionado.storage.service";

export const STORAGE_KEY_NOTIFICAR_DEVOLUCAO_REFERENCIA = "NOTIFICAR_DEVOLUCAO_REFERENCIA";

const removerNotificacaoPorRecursoLidaLocalStorage = () => {
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();

    if (!recursoSelecionado) return;

    const key = `recurso_${recursoSelecionado.uuid}`;

    const unidades_updated = []
    let unidade_selecionada_atualizada;
    
    dados_usuario_logado?.unidades?.forEach(unidade => {
        if (unidade.uuid === dados_usuario_logado.unidade_selecionada.uuid) {
            const {[key]: _, ...resto} = unidade.notificar_devolucao_por_recurso
            unidade.notificar_devolucao_por_recurso = resto || {}
            unidade_selecionada_atualizada = unidade
        }
        
        unidades_updated.push(unidade)
    })

    dados_usuario_logado.unidades = unidades_updated
    dados_usuario_logado.unidade_selecionada = unidade_selecionada_atualizada

    visoesService.setDadosDoUsuarioLogado(dados_usuario_logado)
    localStorage.removeItem(STORAGE_KEY_NOTIFICAR_DEVOLUCAO_REFERENCIA)
}

const atualizaNotificarDevolucaoLocalStorage = (recurso_uuid, notificar_devolucao_por_recurso) => {
    const key = `recurso_${recurso_uuid}`;

    const notificar = key && notificar_devolucao_por_recurso ? notificar_devolucao_por_recurso[key] : null;
    const devolucao_referencia = notificar ? notificar.notificar_devolucao_referencia : null;

    localStorage.setItem(STORAGE_KEY_NOTIFICAR_DEVOLUCAO_REFERENCIA, devolucao_referencia);
}

const retornaNotificarDevolucaoUnidadeRecursoSelecionado = () => {
    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
    const dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

    if (recursoSelecionado?.uuid && dados_usuario_logado?.unidade_selecionada?.notificar_devolucao_por_recurso) {
        const notificar_devolucao_por_recurso = dados_usuario_logado.unidade_selecionada.notificar_devolucao_por_recurso;
        const key = `recurso_${recursoSelecionado.uuid}`;
        const notificar = key && notificar_devolucao_por_recurso ? notificar_devolucao_por_recurso[key] : null;

        return notificar;
    }

    return {};
}

export const notificaDevolucaoPCStorageService = {
    removerNotificacaoPorRecursoLidaLocalStorage,
    atualizaNotificarDevolucaoLocalStorage,
    retornaNotificarDevolucaoUnidadeRecursoSelecionado,
}
