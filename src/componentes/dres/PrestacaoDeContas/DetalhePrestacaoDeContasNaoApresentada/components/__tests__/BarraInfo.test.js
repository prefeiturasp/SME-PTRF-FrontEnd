import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BarraInfo } from '../BarraInfo';

describe('BarraInfo', () => {
    it('exibe a mensagem informando que a prestação de contas não foi apresentada', () => {
        render(<BarraInfo />);

        expect(
            screen.getByText('Prestação de contas não apresentada, você pode concluí-la como rejeitada.')
        ).toBeInTheDocument();
    });

    it('renderiza o ícone de alerta', () => {
        const { container } = render(<BarraInfo />);

        expect(container.querySelector('.icone-barra-info')).toBeInTheDocument();
        expect(container.querySelector('.barra-info')).toBeInTheDocument();
    });
});
