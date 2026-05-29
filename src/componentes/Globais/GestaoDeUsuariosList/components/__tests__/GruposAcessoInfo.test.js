import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GruposAcessoInfo } from '../GruposAcessoInfo';

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`} />,
}));

const GRUPOS = [
    { id: 1, name: 'Grupo Alpha', descricao: 'Descrição do grupo alpha' },
    { id: 2, name: 'Grupo Beta', descricao: 'Descrição do grupo beta' },
];

describe('GruposAcessoInfo', () => {
    it('não renderiza nada quando grupos é null', () => {
        const { container } = render(<GruposAcessoInfo grupos={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('não renderiza nada quando grupos é um array vazio', () => {
        const { container } = render(<GruposAcessoInfo grupos={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renderiza o acordeão quando grupos tem itens', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        expect(screen.getByText('Confira os grupos de acesso existentes')).toBeInTheDocument();
    });

    it('renderiza o nome e descrição de cada grupo', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        expect(screen.getByText('"Grupo Alpha"')).toBeInTheDocument();
        expect(screen.getByText('"Grupo Beta"')).toBeInTheDocument();
        const cardBody = document.querySelector('.card-body');
        expect(cardBody).toHaveTextContent('Descrição do grupo alpha');
        expect(cardBody).toHaveTextContent('Descrição do grupo beta');
    });

    it('inicia com ícone de chevron-down (acordeão fechado)', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('troca para ícone chevron-up ao clicar no botão', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        const botoes = screen.getAllByRole('button');
        fireEvent.click(botoes[0]);
        expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument();
    });

    it('volta para chevron-down ao clicar duas vezes', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        const botoes = screen.getAllByRole('button');
        fireEvent.click(botoes[0]);
        fireEvent.click(botoes[0]);
        expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('o segundo botão também alterna o ícone', () => {
        render(<GruposAcessoInfo grupos={GRUPOS} />);
        const botoes = screen.getAllByRole('button');
        fireEvent.click(botoes[1]);
        expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument();
    });
});
