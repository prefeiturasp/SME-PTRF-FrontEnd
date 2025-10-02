import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VisualizaDevolucoes } from '../index';
import { Ordinais } from '../../../../../../utils/ValidacoesNumeros.js';
import useDataTemplate from '../../../../../../hooks/Globais/useDataTemplate';

jest.mock('../../../../../../utils/ValidacoesNumeros.js', () => ({
    Ordinais: jest.fn((index) => `${index + 1}ª`)
}));

jest.mock('../../../../../../hooks/Globais/useDataTemplate', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../../../../Globais/DatePickerField', () => ({
    DatePickerField: ({ name, value, onChange, disabled, minDate, placeholderText }) => (
        <input
            data-testid="date-picker-field"
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={disabled}
            placeholder={placeholderText}
        />
    )
}));

describe('VisualizaDevolucoes', () => {
    const mockSetTabAtual = jest.fn();
    const mockHandleChangeDataLimiteDevolucao = jest.fn();
    const mockGetDetalhamentoConferenciaDocumentosHistorico = jest.fn();
    const mockSetAnaliseSequenciaVisualizacao = jest.fn();
    const mockDataTemplate = jest.fn((a, b, date) => `Data: ${date}`);

    const defaultProps = {
        relatorioConsolidado: null,
        dataLimiteDevolucao: '2025-12-31',
        handleChangeDataLimiteDevolucao: mockHandleChangeDataLimiteDevolucao,
        tabAtual: 'conferencia-atual',
        setTabAtual: mockSetTabAtual,
        getDetalhamentoConferenciaDocumentosHistorico: mockGetDetalhamentoConferenciaDocumentosHistorico,
        setAnaliseSequenciaVisualizacao: mockSetAnaliseSequenciaVisualizacao
    };

    const mockRelatorioEmAnalise = {
        status_sme: 'EM_ANALISE',
        analises_do_consolidado_dre: [
            { uuid: 'analise-1', data_devolucao: '2025-09-01' },
            { uuid: 'analise-2', data_devolucao: '2025-09-15' }
        ]
    };

    const mockRelatorioDevolvido = {
        status_sme: 'DEVOLVIDO',
        analises_do_consolidado_dre: [
            { uuid: 'analise-1', data_devolucao: '2025-09-01' },
            { uuid: 'analise-2', data_devolucao: '2025-09-15' },
            { uuid: 'analise-3', data_devolucao: '2025-09-20' }
        ]
    };

    const mockRelatorioAnalisado = {
        status_sme: 'ANALISADO',
        analises_do_consolidado_dre: [
            { uuid: 'analise-1', data_devolucao: '2025-09-01' },
            { uuid: 'analise-2', data_devolucao: '2025-09-15' }
        ]
    };

    beforeEach(() => {
        useDataTemplate.mockReturnValue(mockDataTemplate);
        jest.clearAllMocks();
    });

    describe('Renderização condicional baseada em tabAtual', () => {
        test('deve renderizar DatePickerField quando tabAtual não é historico', () => {
            render(<VisualizaDevolucoes {...defaultProps} />);

            expect(screen.getByText('Prazo para acerto :')).toBeInTheDocument();
            expect(screen.getByTestId('date-picker-field')).toBeInTheDocument();
        });

        test('deve renderizar select de devoluções quando tabAtual é historico', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            expect(screen.getByText('Visualize as devoluções pelas datas:')).toBeInTheDocument();
            expect(screen.getByRole('combobox')).toBeInTheDocument();
        });
    });

    describe('DatePickerField', () => {
        test('deve renderizar DatePickerField com valor correto', () => {
            render(<VisualizaDevolucoes {...defaultProps} />);

            const datePicker = screen.getByTestId('date-picker-field');
            expect(datePicker).toHaveValue('2025-12-31');
        });

        test('deve chamar handleChangeDataLimiteDevolucao ao alterar data', () => {
            render(<VisualizaDevolucoes {...defaultProps} />);

            const datePicker = screen.getByTestId('date-picker-field');
            fireEvent.change(datePicker, { target: { value: '2025-10-15' } });

            expect(mockHandleChangeDataLimiteDevolucao).toHaveBeenCalledWith('data_limite_reenvio', '2025-10-15');
        });

        test('deve desabilitar DatePickerField quando status não é EM_ANALISE', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            const datePicker = screen.getByTestId('date-picker-field');
            expect(datePicker).toBeDisabled();
        });

        test('deve habilitar DatePickerField quando status é EM_ANALISE', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioEmAnalise}
                />
            );

            const datePicker = screen.getByTestId('date-picker-field');
            expect(datePicker).not.toBeDisabled();
        });
    });

    describe('useEffect - mudança de tab baseada em status', () => {
        test('deve chamar setTabAtual com historico quando status é DEVOLVIDO', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            expect(mockSetTabAtual).toHaveBeenCalledWith('historico');
        });

        test('deve chamar setTabAtual com historico quando status é ANALISADO', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioAnalisado}
                />
            );

            expect(mockSetTabAtual).toHaveBeenCalledWith('historico');
        });

        test('não deve chamar setTabAtual quando status é EM_ANALISE', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioEmAnalise}
                />
            );

            expect(mockSetTabAtual).not.toHaveBeenCalled();
        });
    });

    describe('useEffect - setAnaliseSequenciaVisualizacao', () => {
        test('deve chamar setAnaliseSequenciaVisualizacao com última análise quando status é EM_ANALISE', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioEmAnalise}
                />
            );

            expect(mockSetAnaliseSequenciaVisualizacao).toHaveBeenCalled();
            const callArg = mockSetAnaliseSequenciaVisualizacao.mock.calls[0][0];
            expect(callArg.versao_numero).toBe(1);
        });

        test('deve chamar setAnaliseSequenciaVisualizacao com penúltima análise quando status é ANALISADO', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    relatorioConsolidado={mockRelatorioAnalisado}
                />
            );

            expect(mockSetAnaliseSequenciaVisualizacao).toHaveBeenCalled();
            const callArg = mockSetAnaliseSequenciaVisualizacao.mock.calls[0][0];
            expect(callArg.versao_numero).toBe(1);
        });
    });

    describe('Select de devoluções (modo histórico)', () => {
        test('deve renderizar opções de devolução quando status é DEVOLVIDO', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(3);
        });

        test('deve renderizar opções excluindo última quando status não é DEVOLVIDO', () => {
            const relatorioEmAnaliseComHistorico = {
                ...mockRelatorioEmAnalise,
                analises_do_consolidado_dre: [
                    { uuid: 'analise-1', data_devolucao: '2025-09-01' },
                    { uuid: 'analise-2', data_devolucao: '2025-09-15' },
                    { uuid: 'analise-3', data_devolucao: '2025-09-20' }
                ]
            };

            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={relatorioEmAnaliseComHistorico}
                />
            );

            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(2);
        });

        test('deve chamar funções corretas ao selecionar uma devolução', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            const select = screen.getByRole('combobox');
            fireEvent.change(select, { target: { value: 'analise-2' } });

            expect(mockSetAnaliseSequenciaVisualizacao).toHaveBeenCalled();
            expect(mockGetDetalhamentoConferenciaDocumentosHistorico).toHaveBeenCalledWith('analise-2');
        });

        test('deve chamar Ordinais para formatar texto das opções', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            expect(Ordinais).toHaveBeenCalled();
        });

        test('deve chamar dataTemplate para formatar datas', () => {
            render(
                <VisualizaDevolucoes
                    {...defaultProps}
                    tabAtual="historico"
                    relatorioConsolidado={mockRelatorioDevolvido}
                />
            );

            expect(mockDataTemplate).toHaveBeenCalled();
        });
    });

    describe('Renderização sem relatorioConsolidado', () => {
        test('deve renderizar sem erros quando relatorioConsolidado é null', () => {
            render(<VisualizaDevolucoes {...defaultProps} />);

            expect(screen.getByText('Prazo para acerto :')).toBeInTheDocument();
        });
    });
});