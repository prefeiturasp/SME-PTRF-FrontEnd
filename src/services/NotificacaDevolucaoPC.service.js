import {visoesService} from "./visoes.service";
import {setNotificacaoMarcarDesmarcarLida} from "./Notificacoes.service";
import {getPeriodoPorReferencia} from "./sme/Parametrizacoes.service";

const marcaNotificacaoComoLida = async () => {
        let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();

        let unidades_updated = []
        dados_usuario_logado.unidades.forEach(unidade => {
            if (unidade.uuid === dados_usuario_logado.unidade_selecionada.uuid) {
                unidade.notificar_devolucao_referencia = null
                unidade.notificacao_uuid = null
            }
            unidades_updated.push(unidade)
        })
        dados_usuario_logado.unidades = unidades_updated
        visoesService.setDadosDoUsuarioLogado(dados_usuario_logado)
        localStorage.removeItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")

        await setNotificacaoMarcarDesmarcarLida({
            uuid: dados_usuario_logado.unidade_selecionada.notificacao_uuid,
            lido: true,
        })
    }

const redirectVerAcertos = (periodoReferencia, history) => {
    let path = `/consulta-detalhamento-analise-da-dre/676c71de-f5c3-44a2-91ed-c80a544c0153`;
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

export const notificaDevolucaoPCService = {
    marcaNotificacaoComoLida,
    redirectVerAcertos
};
