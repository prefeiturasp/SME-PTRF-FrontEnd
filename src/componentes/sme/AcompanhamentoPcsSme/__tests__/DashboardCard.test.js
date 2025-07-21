import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardCard } from '../DashboardCard';

describe('DashboardCard', () => {
    const mockItensDashboard = [
        {
            titulo: 'Título 1',
            quantidade_prestacoes: 10,
            status: 'NORMAL'
        },
        {
            titulo: 'Título 2',
            quantidade_prestacoes: 5,
            status: 'TOTAL_UNIDADES'
        }
    ];

    it('renderiza os cards corretamente', () => {
        render(<DashboardCard itensDashboard={mockItensDashboard} statusPeriodo={{ cor_idx: 1 }} />);

        expect(screen.getByText('Título 1')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();

        expect(screen.getByText('Título 2')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('aplica estilo TOTAL corretamente para cards com status TOTAL_UNIDADES', () => {
        render(<DashboardCard itensDashboard={mockItensDashboard} statusPeriodo={{ cor_idx: 2 }} />);
        const totalCard = screen.getByText('5'); // quantidade do card com status TOTAL_UNIDADES
        expect(totalCard).toHaveStyle('color: #FFFFFF');
        expect(totalCard).toHaveStyle('font-size: 32px');
    });

    it('aplica cor correta para statusPeriodo.cor_idx === 1', () => {
        render(<DashboardCard itensDashboard={mockItensDashboard} statusPeriodo={{ cor_idx: 1 }} />);
        const normalCard = screen.getByText('10');
        expect(normalCard).toHaveStyle('color: #D06D12');
    });

    it('aplica cor correta para statusPeriodo.cor_idx === 2', () => {
        render(<DashboardCard itensDashboard={mockItensDashboard} statusPeriodo={{ cor_idx: 2 }} />);
        const normalCard = screen.getByText('10');
        expect(normalCard).toHaveStyle('color: #42474A');
    });

    it('renderiza nada se itensDashboard estiver vazio ou indefinido', () => {
        const { container } = render(<DashboardCard itensDashboard={[]} statusPeriodo={{ cor_idx: 1 }} />);
        expect(container.querySelectorAll('.card').length).toBe(0);

        const { container: emptyRender } = render(<DashboardCard itensDashboard={undefined} statusPeriodo={{ cor_idx: 1 }} />);
        expect(emptyRender.querySelectorAll('.card').length).toBe(0);
    });
});
