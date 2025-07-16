import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraDeStatus } from '../BarraDeStatus';

describe('BarraDeStatus', () => {
    it('renderiza corretamente o texto do status', () => {
        const statusRelatorio = {
            cor_idx: 1,
            status_txt: 'Em andamento'
        };

        render(<BarraDeStatus statusRelatorio={statusRelatorio} />);
        expect(screen.getByText('Em andamento')).toBeInTheDocument();
    });

    it('aplica a cor correta para cor_idx = 1 (laranja)', () => {
        const statusRelatorio = {
            cor_idx: 1,
            status_txt: 'Em andamento'
        };

        render(<BarraDeStatus statusRelatorio={statusRelatorio} />);
        const divComCor = screen.getByText('Em andamento').parentElement;
        expect(divComCor).toHaveStyle('background-color: #D06D12');
    });

    it('aplica a cor correta para cor_idx = 2 (verde)', () => {
        const statusRelatorio = {
            cor_idx: 2,
            status_txt: 'Concluído'
        };

        render(<BarraDeStatus statusRelatorio={statusRelatorio} />);
        const divComCor = screen.getByText('Concluído').parentElement;
        expect(divComCor).toHaveStyle('background-color: #297805');
    });

    it('renderiza sem texto se status_txt estiver vazio', () => {
        const statusRelatorio = {
            cor_idx: 1,
            status_txt: ''
        };

        render(<BarraDeStatus statusRelatorio={statusRelatorio} />);
        expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    });
});
