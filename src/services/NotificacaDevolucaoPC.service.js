import {visoesService} from "./visoes.service";
import {setNotificacaoMarcarDesmarcarLida} from "./Notificacoes.service";
import {getPeriodoPorReferencia} from "./sme/Parametrizacoes.service";

const marcaNotificacaoComoLida = async () => {
        let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

        let notificacaoUuid = dados_usuario_logado.unidade_selecionada.notificacao_uuid;

        let unidades_updated = []
        dados_usuario_logado.unidades.forEach(unidade => {
            if (unidade.uuid === dados_usuario_logado.unidade_selecionada.uuid) {
                unidade.notificar_devolucao_referencia = null
                unidade.notificar_devolucao_pc_uuid = null
                unidade.notificacao_uuid = null
            }
            unidades_updated.push(unidade)
        })
        dados_usuario_logado.unidades = unidades_updated

        dados_usuario_logado.unidade_selecionada.notificar_devolucao_referencia = null
        dados_usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid = null
        dados_usuario_logado.unidade_selecionada.notificacao_uuid = null

        visoesService.setDadosDoUsuarioLogado(dados_usuario_logado)
        localStorage.removeItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")

        await setNotificacaoMarcarDesmarcarLida({
            uuid: notificacaoUuid,
            lido: true,
        })
    }

const redirectVerAcertos = (history, periodoReferencia, pcUuid) => {

    let path = `/consulta-detalhamento-analise-da-dre/${pcUuid}`;

    getPeriodoPorReferencia(periodoReferencia).then(
        (periodo) => {
            let state = {
                periodoFormatado: {
                    referencia: periodo && periodo.length > 0 ? periodo[0].referencia : '',
                    data_inicio_realizacao_despesas: periodo && periodo.length > 0 ? periodo[0].data_inicio_realizacao_despesas : '',
                    data_fim_realizacao_despesas: periodo && periodo.length > 0 ? periodo[0].data_fim_realizacao_despesas : '',
                }
            }
            history.push(path, state);
        }
    )
};

const marcaNotificacaoComoLidaERedirecianaParaVerAcertos = (history) => {
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    let periodoReferencia = dados_usuario_logado.unidade_selecionada.notificar_devolucao_referencia
    let pcUuid = dados_usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid
    marcaNotificacaoComoLida();
    redirectVerAcertos(history, periodoReferencia, pcUuid);
}

export const notificaDevolucaoPCService = {
    marcaNotificacaoComoLidaERedirecianaParaVerAcertos
};
