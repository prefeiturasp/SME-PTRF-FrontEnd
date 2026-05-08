import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetalharAcertos } from '../index';
import { useSelector } from 'react-redux';

import {
    getTiposDeAcertoLancamentosAgrupadoCategoria,
    getTiposDevolucao,
    getContasComMovimentoNaPc,
    getListaDeSolicitacaoDeAcertos,
    postSolicitacoesParaAcertos,
} from '../../../../../../../services/dres/PrestacaoDeContas.service';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({ prestacao_conta_uuid: 'UUID-PC' }),
    useLocation: () => ({
        pathname: '/dre-detalhe-prestacao-de-contas/UUID-PC',
        state: { aplicavel_despesas_periodos_anteriores: false },
    }),
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

jest.mock('../../../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid='paginas-container'>{children}</div>,
}));

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getTiposDevolucao: jest.fn(),
    getListaDeSolicitacaoDeAcertos: jest.fn(),
    postSolicitacoesParaAcertos: jest.fn(),
    getTiposDeAcertoLancamentosAgrupadoCategoria: jest.fn(),
    getContasComMovimentoNaPc: jest.fn(),
}));

jest.mock(
    '../../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid',
    () => ({
        useCarregaPrestacaoDeContasPorUuid: () => ({
            uuid: 'PC-UUID',
            analise_atual: { uuid: 'ANALISE-UUID' },
        }),
    }),
);

jest.mock(
    '../../../../../../../hooks/Globais/useDataTemplate',
    () => () => jest.fn(() => '2024-01-01'),
);

jest.mock('../TopoComBotoes', () => ({
    TopoComBotoes: ({ onClickBtnVoltar, validaContaAoSalvar }) => (
        <>
            <button onClick={onClickBtnVoltar}>Voltar</button>
            <button onClick={validaContaAoSalvar}>Salvar</button>
        </>
    ),
}));

jest.mock('../TabelaDetalharAcertos', () => ({
    TabelaDetalharAcertos: () => <div data-testid='tabela-acertos'>Tabela</div>,
}));

jest.mock('../FormularioAcertos', () => ({
    FormularioAcertos: ({ formRef }) => {
        formRef.current = {
            errors: {},
            values: {
                solicitacoes_acerto: [
                    {
                        uuid: 'ACERTO-1',
                        copiado: false,
                        tipo_acerto: 'TA-1',
                        detalhamento: 'Detalhe',
                        devolucao_tesouro: {
                            tipo: { uuid: 'TIPO-DEV' },
                            data: '01/01/2024',
                            devolucao_total: 'true',
                            valor: '1.000,00',
                        },
                    },
                ],
            },
        };

        return <div data-testid='formulario-acertos'>Formulario</div>;
    },
}));

const lancamentoBase = {
    tipo_transacao: 'Gasto',
    valor_transacao_total: 100,
    documento_mestre: {
        uuid: 'DOC-UUID',
        conferido: false,
    },
    conta: 'CONTA-1',
};

describe('DetalharAcertos', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [],
        });

        getTiposDevolucao.mockResolvedValue([]);
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'ATIVA' }]);
    });

    it('deve renderizar o título da página', () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        render(<DetalharAcertos />);

        expect(screen.getByText('Acompanhamento das Prestações de Contas')).toBeInTheDocument();
    });

    it('deve redirecionar quando não existem lançamentos', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [],
            origem: null,
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    it('deve exibir tabela e formulário quando existem lançamentos', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    analise_lancamento: { uuid: 'ANALISE-LANC-UUID' },
                },
            ],
            origem: null,
        });

        getListaDeSolicitacaoDeAcertos.mockResolvedValue({
            solicitacoes_de_ajuste_da_analise: [],
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('tabela-acertos')).toBeInTheDocument();
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });
    });

    it('deve executar navegação ao clicar em Voltar', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Voltar'));

        expect(mockNavigate).toHaveBeenCalled();
    });

    it('deve não considerar acerto para alteração de saldo quando a categoria não é encontrada', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    analise_lancamento: { uuid: 'ANALISE-LANC-UUID' },
                },
            ],
            origem: null,
        });

        getListaDeSolicitacaoDeAcertos.mockResolvedValue({
            solicitacoes_de_ajuste_da_analise: [
                {
                    uuid: 'ACERTO-1',
                    copiado: false,
                    tipo_acerto: {
                        uuid: 'TA-INEXISTENTE',
                        categoria: 'OUTRA',
                    },
                },
            ],
        });

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [
                {
                    id: 'AJUSTE_SIMPLIFICADO',
                    texto: 'Ajuste',
                    cor: 1,
                    tipos_acerto_lancamento: [{ uuid: 'OUTRO-TIPO' }],
                },
            ],
        });

        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'INATIVA' }]);

        postSolicitacoesParaAcertos.mockResolvedValue({});

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(
                screen.queryByText('A conta onde foram solicitados acertos foi encerrada'),
            ).not.toBeInTheDocument();
        });

        expect(postSolicitacoesParaAcertos).toHaveBeenCalled();
    });
    it('deve retornar true quando a conta associada aos lançamentos está INATIVA', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    analise_lancamento: { uuid: 'ANALISE-LANC-UUID' },
                },
            ],
            origem: null,
        });

        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'INATIVA' }]);

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(document.querySelector('.modal-ant-design')).toBeInTheDocument();
        });
    });

    it('deve identificar a categoria correta do tipo de acerto e exibir o modal quando altera saldo', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    analise_lancamento: { uuid: 'ANALISE-LANC-UUID' },
                },
            ],
            origem: null,
        });

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [
                {
                    id: 'DEVOLUCAO',
                    texto: 'Devolução',
                    cor: 1,
                    tipos_acerto_lancamento: [{ uuid: 'TA-1' }],
                },
            ],
        });

        getListaDeSolicitacaoDeAcertos.mockResolvedValue({
            solicitacoes_de_ajuste_da_analise: [
                {
                    uuid: 'ACERTO-1',
                    copiado: false,
                    tipo_acerto: 'TA-1',
                },
            ],
        });

        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'INATIVA' }]);

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(
                screen.getByText('A conta onde foram solicitados acertos foi encerrada'),
            ).toBeInTheDocument();
        });
    });

    it('deve enviar as solicitações de acerto ao salvar e navegar', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    analise_lancamento: { uuid: 'ANALISE-LANC-UUID' },
                },
            ],
            origem: null,
        });

        postSolicitacoesParaAcertos.mockResolvedValue({});

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(postSolicitacoesParaAcertos).toHaveBeenCalledWith('UUID-PC', {
                analise_prestacao: 'ANALISE-UUID',
                lancamentos: [
                    {
                        tipo_lancamento: 'GASTO',
                        lancamento_uuid: 'DOC-UUID',
                    },
                ],
                solicitacoes_acerto: [
                    {
                        uuid: 'ACERTO-1',
                        copiado: false,
                        tipo_acerto: 'TA-1',
                        detalhamento: 'Detalhe',
                        devolucao_tesouro: {
                            tipo: 'TIPO-DEV',
                            data: '2024-01-01',
                            devolucao_total: true,
                            valor: 1000,
                        },
                    },
                ],
            });
        });

        expect(mockNavigate).toHaveBeenCalled();
    });
});
