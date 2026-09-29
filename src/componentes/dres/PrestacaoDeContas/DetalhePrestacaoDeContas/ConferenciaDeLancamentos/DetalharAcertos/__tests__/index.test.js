import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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

let capturedTabelaProps = {};
jest.mock('../TabelaDetalharAcertos', () => ({
    TabelaDetalharAcertos: (props) => {
        capturedTabelaProps = props;
        return <div data-testid='tabela-acertos'>Tabela</div>;
    },
}));

let capturedFormularioProps = {};
jest.mock('../FormularioAcertos', () => ({
    FormularioAcertos: (props) => {
        capturedFormularioProps = props;
        props.formRef.current = {
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

const makeFakeSelectEvent = (dataCategoria, dataObjeto) => ({
    target: {
        selectedIndex: 0,
        options: [
            {
                getAttribute: (attr) => {
                    if (attr === 'data-categoria') return dataCategoria;
                    if (attr === 'data-objeto') return JSON.stringify(dataObjeto);
                    return null;
                },
            },
        ],
    },
});

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

    it('deve navegar para a tela de resumo de acertos quando origem for resumo-acertos', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [],
            origem: 'dre-detalhe-prestacao-de-contas-resumo-acertos',
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
                expect.stringContaining('dre-detalhe-prestacao-de-contas-resumo-acertos/UUID-PC'),
            );
        });
    });

    it('deve filtrar categorias que só aceitam lançamentos não conferidos quando não há gasto não conferido', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [
                {
                    ...lancamentoBase,
                    documento_mestre: { ...lancamentoBase.documento_mestre, conferido: true },
                },
            ],
            origem: null,
        });

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [
                { id: 'CONCILIACAO_LANCAMENTO', tipos_acerto_lancamento: [] },
                { id: 'OUTRA', tipos_acerto_lancamento: [] },
            ],
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(getTiposDeAcertoLancamentosAgrupadoCategoria).toHaveBeenCalled();
    });

    it('deve setar texto e cor da categoria quando a categoria do acerto já cadastrado é encontrada', async () => {
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
                    texto: 'Texto da categoria',
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
                    tipo_acerto: { uuid: 'TA-1', categoria: 'DEVOLUCAO' },
                    detalhamento: '',
                    devolucao_ao_tesouro: null,
                },
            ],
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(getListaDeSolicitacaoDeAcertos).toHaveBeenCalled();
    });

    it('deve expor callbacks para bloqueio/texto de categoria e adicionar item vazio via FormularioAcertos', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(() =>
            act(() => {
                capturedFormularioProps.removeBloqueiaSelectTipoDeAcertoJaCadastrado(0);
            }),
        ).not.toThrow();

        expect(() =>
            act(() => {
                capturedFormularioProps.removeTextoECorCategoriaTipoDeAcertoJaCadastrado(0);
            }),
        ).not.toThrow();

        expect(() =>
            act(() => {
                capturedFormularioProps.adicionaTextoECorCategoriaVazio();
            }),
        ).not.toThrow();
    });

    it('deve identificar corretamente solicitações copiadas via ehSolicitacaoCopiada', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(capturedFormularioProps.ehSolicitacaoCopiada({ copiado: true })).toBe(true);
        expect(capturedFormularioProps.ehSolicitacaoCopiada({ copiado: false })).toBe(false);
    });

    it('deve calcular rowClassName da tabela conforme o resultado da análise do lançamento', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('tabela-acertos')).toBeInTheDocument();
        });

        expect(
            capturedTabelaProps.rowClassName({ analise_lancamento: { resultado: true } }),
        ).toEqual({ 'linha-conferencia-de-lancamentos-correto': true });

        expect(capturedTabelaProps.rowClassName({ analise_lancamento: { resultado: false } })).toBeUndefined();
        expect(capturedTabelaProps.rowClassName(null)).toBeUndefined();
    });

    it('deve atualizar texto/cor de categoria e exibir campos de devolução ao trocar o tipo de acerto (categoria encontrada e DEVOLUCAO)', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [
                {
                    id: 'DEVOLUCAO',
                    nome: 'Devolução',
                    texto: 'Texto devolução',
                    cor: 1,
                    tipos_acerto_lancamento: [{ uuid: 'TA-1' }],
                },
            ],
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(() =>
            act(() => {
                capturedFormularioProps.handleChangeTipoDeAcertoLancamento(
                    makeFakeSelectEvent('DEVOLUCAO', { uuid: 'TA-1', categoria: 'DEVOLUCAO' }),
                    0,
                );
            }),
        ).not.toThrow();

        // segunda chamada no mesmo índice cobre o ramo de atualização (não push) do texto/cor já existente
        expect(() =>
            act(() => {
                capturedFormularioProps.handleChangeTipoDeAcertoLancamento(
                    makeFakeSelectEvent('DEVOLUCAO', { uuid: 'TA-1', categoria: 'DEVOLUCAO' }),
                    0,
                );
            }),
        ).not.toThrow();
    });

    it('deve atualizar texto/cor de categoria e ocultar campos de devolução quando categoria não é DEVOLUCAO e não é encontrada', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        getTiposDeAcertoLancamentosAgrupadoCategoria.mockResolvedValue({
            agrupado_por_categorias: [
                {
                    id: 'OUTRA_CATEGORIA',
                    nome: 'Outra',
                    texto: 'Texto outro',
                    cor: 0,
                    tipos_acerto_lancamento: [{ uuid: 'TA-2' }],
                },
            ],
        });

        render(<DetalharAcertos />);

        await waitFor(() => {
            expect(screen.getByTestId('formulario-acertos')).toBeInTheDocument();
        });

        expect(() =>
            act(() => {
                capturedFormularioProps.handleChangeTipoDeAcertoLancamento(
                    makeFakeSelectEvent('CATEGORIA_INEXISTENTE', { uuid: 'TA-2', categoria: 'OUTRA_CATEGORIA' }),
                    0,
                );
            }),
        ).not.toThrow();

        // segunda chamada no mesmo índice cobre o ramo de atualização do texto/cor vazio já existente
        expect(() =>
            act(() => {
                capturedFormularioProps.handleChangeTipoDeAcertoLancamento(
                    makeFakeSelectEvent('CATEGORIA_INEXISTENTE', { uuid: 'TA-2', categoria: 'OUTRA_CATEGORIA' }),
                    0,
                );
            }),
        ).not.toThrow();
    });

    it('deve prosseguir com o envio diretamente quando a conta associada não é encontrada entre as contas com movimento', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [{ ...lancamentoBase, conta: 'CONTA-NAO-ENCONTRADA' }],
            origem: null,
        });

        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'ATIVA' }]);
        postSolicitacoesParaAcertos.mockResolvedValue({});

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(postSolicitacoesParaAcertos).toHaveBeenCalled();
        });

        expect(
            screen.queryByText('A conta onde foram solicitados acertos foi encerrada'),
        ).not.toBeInTheDocument();
    });

    it('deve tratar erro ao criar solicitações de acerto sem navegar', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
            origem: null,
        });

        postSolicitacoesParaAcertos.mockRejectedValue({ response: { data: 'erro' } });

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(postSolicitacoesParaAcertos).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith(
                'Erro ao criar solicitações para acertos! ',
                { data: 'erro' },
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();

        consoleLogSpy.mockRestore();
    });

    it('deve confirmar e cancelar o modal de conta encerrada', async () => {
        useSelector.mockReturnValue({
            lancamentos_para_acertos: [lancamentoBase],
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

        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'CONTA-1', status: 'INATIVA' }]);
        postSolicitacoesParaAcertos.mockResolvedValue({});

        render(<DetalharAcertos />);

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(
                screen.getByText('A conta onde foram solicitados acertos foi encerrada'),
            ).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

        expect(postSolicitacoesParaAcertos).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText('Salvar'));

        await waitFor(() => {
            expect(
                screen.getByText('A conta onde foram solicitados acertos foi encerrada'),
            ).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

        await waitFor(() => {
            expect(postSolicitacoesParaAcertos).toHaveBeenCalled();
        });
    });
});
