import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TopoSelectPeriodoBotaoVoltar } from '../TopoSelectPeriodoBotaoVoltar';

const renderComponent = (props) => render(
    <MemoryRouter>
        <TopoSelectPeriodoBotaoVoltar {...props} />
    </MemoryRouter>
);

describe('TopoSelectPeriodoBotaoVoltar', () => {
    const periodos = [
        { uuid: 'p1', referencia: '1º período 2024', data_inicio_realizacao_despesas: '2024-01-01', data_fim_realizacao_despesas: '2024-06-30' },
        { uuid: 'p2', referencia: '2º período 2024', data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
    ];

    it('renderiza as opções de período com as datas formatadas', () => {
        renderComponent({ periodos, periodoEscolhido: 'p1', handleChangePeriodos: jest.fn() });
        expect(screen.getByRole('option', { name: /1º período 2024 - .* até .*/ })).toBeInTheDocument();
    });

    it('exibe "-" quando não há data de início ou fim', () => {
        renderComponent({ periodos, periodoEscolhido: 'p2', handleChangePeriodos: jest.fn() });
        expect(screen.getByRole('option', { name: '2º período 2024 - - até -' })).toBeInTheDocument();
    });

    it('não quebra quando periodos é indefinido', () => {
        expect(() => renderComponent({ periodos: undefined, periodoEscolhido: '', handleChangePeriodos: jest.fn() })).not.toThrow();
    });

    it('chama handleChangePeriodos ao selecionar outro período', () => {
        const handleChangePeriodos = jest.fn();
        renderComponent({ periodos, periodoEscolhido: 'p1', handleChangePeriodos });

        fireEvent.change(screen.getByLabelText('Período:'), { target: { value: 'p2' } });
        expect(handleChangePeriodos).toHaveBeenCalledWith('p2');
    });

    it('renderiza o link para voltar ao painel geral', () => {
        renderComponent({ periodos, periodoEscolhido: 'p1', handleChangePeriodos: jest.fn() });
        const link = screen.getByText('Voltar para painel geral').closest('a');
        expect(link).toHaveAttribute('href', '/dre-dashboard');
    });
});
