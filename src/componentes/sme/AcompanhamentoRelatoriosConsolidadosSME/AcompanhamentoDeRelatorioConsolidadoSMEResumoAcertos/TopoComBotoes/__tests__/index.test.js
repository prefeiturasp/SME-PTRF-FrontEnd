import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopoComBotoes } from '../index';
import { devolverConsolidado } from '../../../../../../services/dres/RelatorioConsolidado.service';
import { toastCustom } from '../../../../../Globais/ToastCustom';
import { exibeDataPT_BR } from '../../../../../../utils/ValidacoesAdicionaisFormularios';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

jest.mock('../../../../../../services/dres/RelatorioConsolidado.service', () => ({
    devolverConsolidado: jest.fn()
}));

jest.mock('../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn()
    }
}));

jest.mock('../../../../../../utils/ValidacoesAdicionaisFormularios', () => ({
    exibeDataPT_BR: jest.fn((date) => date ? `Data: ${date}` : '')
}));

jest.mock('../../../.././../../componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto', () => ({
    ModalConfirmaDevolverParaAcerto: ({ show, handleClose, onDevolverParaAcertoTrue, titulo, texto, primeiroBotaoTexto, segundoBotaoTexto }) => (
        show ? (
            <div data-testid="modal-confirma-devolver">
                <h2>{titulo}</h2>
                <div dangerouslySetInnerHTML={{ __html: texto }} />
                <button onClick={handleClose}>{primeiroBotaoTexto}</button>
                <button onClick={onDevolverParaAcertoTrue} data-testid="btn-confirmar-devolucao">
                    {segundoBotaoTexto}
                </button>
            </div>
        ) : null
    )
}));

describe('TopoComBotoes', () => {
    const mockRelatorioConsolidado = {
        uuid: 'relatorio-uuid-123',
        status_sme: 'EM_ANALISE',
        dre: {
            nome: 'DRE Teste'
        },
        periodo: {
            referencia: '2025.1',
            data_inicio_realizacao_despesas: '2025-01-01',
            data_fim_realizacao_despesas: '2025-06-30'
        },
        analise_atual: {
            consolidado_dre: 'consolidado-uuid-456'
        },
        analises_do_consolidado_dre: [
            { consolidado_dre: 'consolidado-uuid-789' }
        ]
    };

    const defaultProps = {
        relatorioConsolidado: mockRelatorioConsolidado,
        dataLimiteDevolucao: '2025-12-31',
        tabAtual: 'conferencia-atual'
    };

    const renderComponent = (props = {}) => {
        return render(
            <BrowserRouter>
                <TopoComBotoes {...defaultProps} {...props} />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        delete window.location;
        window.location = { reload: jest.fn() };
    });

    describe('Renderização básica', () => {
        test('deve renderizar nome da DRE', () => {
            renderComponent();
            expect(screen.getByText('DRE Teste')).toBeInTheDocument();
        });

        test('deve renderizar informações do período', () => {
            renderComponent();
            expect(screen.getByText(/Período:/)).toBeInTheDocument();
            expect(screen.getByText(/2025.1/)).toBeInTheDocument();
        });

        test('deve renderizar título "Resumo de acertos"', () => {
            renderComponent();
            expect(screen.getByText('Resumo de acertos')).toBeInTheDocument();
        });

        test('deve renderizar botão "Voltar"', () => {
            renderComponent();
            expect(screen.getByRole('button', { name: /Voltar/i })).toBeInTheDocument();
        });

        test('deve renderizar botão "Devolver para DRE" quando tabAtual é conferencia-atual', () => {
            renderComponent();
            expect(screen.getByRole('button', { name: /Devolver para DRE/i })).toBeInTheDocument();
        });

        test('não deve renderizar botão "Devolver para DRE" quando tabAtual não é conferencia-atual', () => {
            renderComponent({ tabAtual: 'historico' });
            expect(screen.queryByRole('button', { name: /Devolver para DRE/i })).not.toBeInTheDocument();
        });

        test('deve chamar exibeDataPT_BR para formatar datas', () => {
            renderComponent();
            expect(exibeDataPT_BR).toHaveBeenCalledWith('2025-01-01');
            expect(exibeDataPT_BR).toHaveBeenCalledWith('2025-06-30');
        });
    });

    describe('Botão Voltar', () => {
        test('deve navegar para página de detalhe ao clicar em Voltar', () => {
            renderComponent();

            const btnVoltar = screen.getByRole('button', { name: /Voltar/i });
            fireEvent.click(btnVoltar);

            expect(mockNavigate).toHaveBeenCalledWith('/analise-relatorio-consolidado-dre-detalhe/consolidado-uuid-456/');
        });

        test('deve usar uuid de analises_do_consolidado_dre quando analise_atual não existe', () => {
            const relatorioSemAnaliseAtual = {
                ...mockRelatorioConsolidado,
                analise_atual: null
            };

            renderComponent({ relatorioConsolidado: relatorioSemAnaliseAtual });

            const btnVoltar = screen.getByRole('button', { name: /Voltar/i });
            fireEvent.click(btnVoltar);

            expect(mockNavigate).toHaveBeenCalledWith('/analise-relatorio-consolidado-dre-detalhe/consolidado-uuid-789/');
        });

        test('deve retornar undefined quando não há uuid disponível', () => {
            const relatorioSemUuid = {
                ...mockRelatorioConsolidado,
                analise_atual: null,
                analises_do_consolidado_dre: []
            };

            renderComponent({ relatorioConsolidado: relatorioSemUuid });

            const btnVoltar = screen.getByRole('button', { name: /Voltar/i });
            fireEvent.click(btnVoltar);

            expect(mockNavigate).toHaveBeenCalledWith('/analise-relatorio-consolidado-dre-detalhe/undefined/');
        });
    });

    describe('Botão Devolver para DRE', () => {
        test('deve estar habilitado quando status é EM_ANALISE e dataLimiteDevolucao existe', () => {
            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            expect(btnDevolver).not.toBeDisabled();
        });

        test('deve estar desabilitado quando status não é EM_ANALISE', () => {
            const relatorioDevolvido = {
                ...mockRelatorioConsolidado,
                status_sme: 'DEVOLVIDO'
            };

            renderComponent({ relatorioConsolidado: relatorioDevolvido });

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            expect(btnDevolver).toBeDisabled();
        });

        test('deve estar desabilitado quando dataLimiteDevolucao não existe', () => {
            renderComponent({ dataLimiteDevolucao: null });

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            expect(btnDevolver).toBeDisabled();
        });

        test('deve abrir modal ao clicar em Devolver para DRE', () => {
            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            expect(screen.getByTestId('modal-confirma-devolver')).toBeInTheDocument();
            expect(screen.getByText('Devolver para acertos')).toBeInTheDocument();
        });
    });

    describe('Modal de confirmação', () => {
        test('deve fechar modal ao clicar em Cancelar', () => {
            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            const btnCancelar = screen.getByRole('button', { name: /Cancelar/i });
            fireEvent.click(btnCancelar);

            expect(screen.queryByTestId('modal-confirma-devolver')).not.toBeInTheDocument();
        });

        test('deve chamar devolverConsolidado ao confirmar devolução', async () => {
            devolverConsolidado.mockResolvedValue({});

            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            const btnConfirmar = screen.getByTestId('btn-confirmar-devolucao');
            fireEvent.click(btnConfirmar);

            await waitFor(() => {
                expect(devolverConsolidado).toHaveBeenCalledWith('relatorio-uuid-123', '2025-12-31');
            });
        });

        test('deve exibir toast de sucesso após devolução', async () => {
            devolverConsolidado.mockResolvedValue({});

            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            const btnConfirmar = screen.getByTestId('btn-confirmar-devolucao');
            fireEvent.click(btnConfirmar);

            await waitFor(() => {
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                    'Status alterado com sucesso',
                    'O relatório foi alterado para "devolvido para acertos".'
                );
            });
        });

        test('deve fechar modal após confirmar devolução', async () => {
            devolverConsolidado.mockResolvedValue({});

            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            const btnConfirmar = screen.getByTestId('btn-confirmar-devolucao');
            fireEvent.click(btnConfirmar);

            await waitFor(() => {
                expect(screen.queryByTestId('modal-confirma-devolver')).not.toBeInTheDocument();
            });
        });
    });

    describe('Renderização condicional', () => {
        test('não deve renderizar informações de período quando período não existe', () => {
            const relatorioSemPeriodo = {
                ...mockRelatorioConsolidado,
                periodo: null
            };

            renderComponent({ relatorioConsolidado: relatorioSemPeriodo });

            expect(screen.queryByText(/Período:/)).not.toBeInTheDocument();
        });

        test('não deve renderizar informações quando relatorioConsolidado é null', () => {
            renderComponent({ relatorioConsolidado: null });

            expect(screen.queryByText(/DRE Teste/)).not.toBeInTheDocument();
            expect(screen.queryByText(/Período:/)).not.toBeInTheDocument();
        });
    });

    describe('Estados de loading', () => {
        test('deve gerenciar estado de loading durante devolução', async () => {
            devolverConsolidado.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve({}), 100))
            );

            renderComponent();

            const btnDevolver = screen.getByRole('button', { name: /Devolver para DRE/i });
            fireEvent.click(btnDevolver);

            const btnConfirmar = screen.getByTestId('btn-confirmar-devolucao');
            fireEvent.click(btnConfirmar);

            await waitFor(() => {
                expect(devolverConsolidado).toHaveBeenCalled();
            });
        });
    });
});