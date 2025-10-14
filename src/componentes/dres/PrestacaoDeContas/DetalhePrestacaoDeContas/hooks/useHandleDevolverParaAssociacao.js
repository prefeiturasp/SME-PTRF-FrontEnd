import {useCallback} from "react";
import {getPrestacaoDeContasDetalhe} from "../../../../../services/dres/PrestacaoDeContas.service";

export const useHandleDevolverParaAssociacao = ({
    prestacaoDeContas,
    setContasPendenciaConciliacao,
    setShowModalComprovanteSaldoConta,
    setShowModalConciliacaoBancaria,
    setShowModalConfirmaDevolverParaAcerto,
    setBtnDevolverParaAcertoDisabled
}) => {
    return useCallback(async () => {
        setBtnDevolverParaAcertoDisabled(true);

        try {
            const prestacaoDeContasAtualizada = await getPrestacaoDeContasDetalhe(prestacaoDeContas.uuid);
            const acertosPodemAlterarSaldoConciliacao = prestacaoDeContasAtualizada?.analise_atual?.acertos_podem_alterar_saldo_conciliacao;
            const temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta = prestacaoDeContasAtualizada?.analise_atual?.tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta;

            const contasPendencia = prestacaoDeContasAtualizada?.analise_atual?.contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta || [];
            setContasPendenciaConciliacao(contasPendencia);

            if (temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta) {
                setShowModalComprovanteSaldoConta(true);
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
        setBtnDevolverParaAcertoDisabled
    ]);
};
