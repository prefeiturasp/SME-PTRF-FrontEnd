import {useCallback} from "react";
import {getPrestacaoDeContasDetalhe} from "../../../../../services/dres/PrestacaoDeContas.service";

export const useHandleDevolverParaAssociacao = ({
    prestacaoDeContas,
    setContasPendenciaConciliacao,
    setShowModalComprovanteSaldoConta,
    setShowModalConciliacaoBancaria,
    setShowModalConfirmaDevolverParaAcerto,
    setBtnDevolverParaAcertoDisabled,
    setContasPendenciaLancamentosConciliacao,
    setShowModalLancamentosConciliacao,
    setMostrarModalLancamentosSomenteSolicitacoes
}) => {
    return useCallback(async () => {
        setBtnDevolverParaAcertoDisabled(true);

        try {
            const prestacaoDeContasAtualizada = await getPrestacaoDeContasDetalhe(prestacaoDeContas.uuid);
            const analiseAtual = prestacaoDeContasAtualizada?.analise_atual || {};

            const acertosPodemAlterarSaldoConciliacao = analiseAtual?.acertos_podem_alterar_saldo_conciliacao;
            const temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta = analiseAtual?.tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta;
            const temSolicitacoesLancamentoComPendenciaConciliacao = analiseAtual?.solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao;

            const contasPendencia = analiseAtual?.contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta || [];
            const contasSolicitacoesLancamentoPendentes = analiseAtual?.contas_solicitacoes_lancar_credito_ou_despesa_com_pendencia_conciliacao || [];
            setContasPendenciaConciliacao(contasPendencia);
            setContasPendenciaLancamentosConciliacao(contasSolicitacoesLancamentoPendentes);
            setMostrarModalLancamentosSomenteSolicitacoes(false);

            if (temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta && temSolicitacoesLancamentoComPendenciaConciliacao) {
                // Modal unificado
                setShowModalLancamentosConciliacao(true);
                return;
            }

            if (temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta) {
                setShowModalComprovanteSaldoConta(true);
                return;
            }

            if (temSolicitacoesLancamentoComPendenciaConciliacao) {
                const deveMostrarSomenteSolicitacoes = !temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta;
                setMostrarModalLancamentosSomenteSolicitacoes(deveMostrarSomenteSolicitacoes);
                setShowModalLancamentosConciliacao(true);
                return;
            }

            if (acertosPodemAlterarSaldoConciliacao && !temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta) {
                setShowModalConciliacaoBancaria(true);
                return;
            }

            setShowModalConfirmaDevolverParaAcerto(true);
        } finally {
            setBtnDevolverParaAcertoDisabled(false);
        }
    }, [
        prestacaoDeContas,
        setContasPendenciaConciliacao,
        setShowModalComprovanteSaldoConta,
        setShowModalConciliacaoBancaria,
        setShowModalConfirmaDevolverParaAcerto,
        setBtnDevolverParaAcertoDisabled,
        setContasPendenciaLancamentosConciliacao,
        setShowModalLancamentosConciliacao,
        setMostrarModalLancamentosSomenteSolicitacoes
    ]);
};
