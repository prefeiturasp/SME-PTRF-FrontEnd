import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraDeStatus } from '../BarraDeStatus';

describe('BarraDeStatus', () => {
    it('não renderiza nada quando qtdeUnidadesDre não é informado', () => {
        const { container } = render(<BarraDeStatus qtdeUnidadesDre={null} prestacaoDeContas={[1, 2]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('não renderiza nada quando prestacaoDeContas não é informado', () => {
        const { container } = render(<BarraDeStatus qtdeUnidadesDre={5} prestacaoDeContas={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('exibe a quantidade de unidades com prestação de contas em relação ao total', () => {
        render(<BarraDeStatus qtdeUnidadesDre={5} prestacaoDeContas={[1, 2, 3]} />);
        expect(screen.getByText('3 de 5')).toBeInTheDocument();
        expect(screen.getByText('unidades')).toBeInTheDocument();
    });
});
