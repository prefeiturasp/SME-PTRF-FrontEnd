import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ElaborarNovoPlano } from '../index';

jest.mock('../../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock('../../../../../Globais/Breadcrumb', () => jest.fn(() => <div data-testid="breadcrumb">Breadcrumb</div>));

jest.mock('../ReceitasPrevistas', () => jest.fn(() => <div data-testid="receitas">Receitas previstas content</div>));
jest.mock('../Prioridades', () => jest.fn(() => <div data-testid="prioridades">Prioridades</div>));
jest.mock('../Relatorios', () => jest.fn(() => <div data-testid="relatorios">Relatórios</div>));
jest.mock('../BarraTopoTitulo', () => jest.fn(() => <div data-testid="barra-topo">BarraTopoTitulo</div>));

describe('ElaborarNovoPlano', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza corretamente o título, breadcrumb e TabSelector', () => {
        render(<ElaborarNovoPlano />);

        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByText('Plano Anual de Atividades')).toBeInTheDocument();
    });

    it('renderiza a aba inicial "Levantamento de Prioridades"', () => {
        render(<ElaborarNovoPlano />);
        expect(screen.getByText('Levantamento de Prioridades')).toBeInTheDocument();
        expect(screen.getByText('Faça download do PDF')).toBeInTheDocument();
    });

    it('alterna corretamente para a aba "Receitas previstas"', () => {
        render(<ElaborarNovoPlano />);

        const tab = screen.getByText('Receitas previstas')
        fireEvent.click(tab);
        expect(tab).toBeInTheDocument();
    });

    it('alterna corretamente para a aba "Prioridades"', () => {
        render(<ElaborarNovoPlano />);

        const tab = screen.getByText('Prioridades')
        fireEvent.click(tab);
        expect(tab).toBeInTheDocument();
    });

    it('alterna corretamente para a aba "Relatórios"', () => {
        render(<ElaborarNovoPlano />);

        const tab = screen.getByText('Relatórios')
        fireEvent.click(tab);
        expect(tab).toBeInTheDocument();
    });


});
