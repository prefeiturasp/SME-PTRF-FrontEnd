import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraTotalUnidades } from '../BarraTotalUnidades';

describe('BarraTotalUnidades', () => {
    it('renderiza corretamente o total de unidades', () => {
        render(<BarraTotalUnidades totalUnidades={5} />);
        expect(
            screen.getByText(/Total de associações das Unidades Educacionais:/)
        ).toBeInTheDocument();
        expect(screen.getByText(/5 unidades/)).toBeInTheDocument();
    });

    it('exibe zero unidades quando totalUnidades é 0', () => {
        render(<BarraTotalUnidades totalUnidades={0} />);
        expect(screen.getByText(/0 unidades/)).toBeInTheDocument();
    });

    it('exibe corretamente valores grandes', () => {
        render(<BarraTotalUnidades totalUnidades={12345} />);
        expect(screen.getByText(/12345 unidades/)).toBeInTheDocument();
    });
});
