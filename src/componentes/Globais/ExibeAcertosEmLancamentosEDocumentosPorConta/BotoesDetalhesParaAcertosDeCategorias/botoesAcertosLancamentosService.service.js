import {
    postMarcarGastoComoConciliado,
    postMarcarGastoDesconciliado
} from "../../../../services/dres/PrestacaoDeContas.service";
import {toastCustom} from "../../ToastCustom";

const marcarGastoComoConciliado = async (analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta) => {
    try {
        let payload = {
            uuid_analise_lancamento: analise_lancamento.analise_lancamento,
            uuid_periodo: prestacaoDeContas.periodo_uuid,
        }
        await postMarcarGastoComoConciliado(payload)
        toastCustom.ToastCustomSuccess('Despesa conciliada', `Despesa conciliada com sucesso.`)
        await carregaAcertosLancamentos(conta)
    }catch (e) {
        console.log("Erro ao marcar como conciliado acerto em lançamentos")
    }
}

const marcarGastoComoDesconciliado = async (analise_lancamento, carregaAcertosLancamentos, conta) => {
    try {
        let payload = {
            uuid_analise_lancamento: analise_lancamento.analise_lancamento,
        }
        await postMarcarGastoDesconciliado(payload)
        toastCustom.ToastCustomSuccess('Despesa desconciliada', `Despesa desconciliada com sucesso.`)
        await carregaAcertosLancamentos(conta)
    }catch (e) {
        console.log("Erro ao marcar como desconciliado acerto em lançamentos")
    }
}

export const botoesAcertosLancamentosService = {
    marcarGastoComoConciliado,
    marcarGastoComoDesconciliado
}