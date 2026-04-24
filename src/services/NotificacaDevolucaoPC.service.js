import {setNotificacaoMarcarDesmarcarLida} from "./Notificacoes.service";
import {getPeriodoPorReferencia} from "./sme/Parametrizacoes.service";
import { notificaDevolucaoPCStorageService } from "./storages/NotificarDevolucao.storage.service";

const marcaNotificacaoComoLida = async () => {
        const notificar_devolucao = notificaDevolucaoPCStorageService.retornaNotificarDevolucaoUnidadeRecursoSelecionado();

        let notificacaoUuid = notificar_devolucao?.notificacao_uuid;

        notificaDevolucaoPCStorageService.removerNotificacaoPorRecursoLidaLocalStorage();

        await setNotificacaoMarcarDesmarcarLida({
            uuid: notificacaoUuid,
            lido: true,
        })
    }

const redirectVerAcertos = (navigate, periodoReferencia, pcUuid) => {

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
            navigate(path, { state });
        }
    )
};

const marcaNotificacaoComoLidaERedirecianaParaVerAcertos = (navigate) => {
    const notificar_devolucao = notificaDevolucaoPCStorageService.retornaNotificarDevolucaoUnidadeRecursoSelecionado();
    let periodoReferencia = notificar_devolucao?.notificar_devolucao_referencia;
    let pcUuid = notificar_devolucao?.notificar_devolucao_pc_uuid;
    marcaNotificacaoComoLida();
    redirectVerAcertos(navigate, periodoReferencia, pcUuid);
}

export const notificaDevolucaoPCService = {
    marcaNotificacaoComoLidaERedirecianaParaVerAcertos
};
