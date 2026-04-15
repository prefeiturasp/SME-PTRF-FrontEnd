import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BtnVoltar } from '../BtnVoltar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('BtnVoltar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o botão com o texto "Voltar"', () => {
        render(<BtnVoltar />);
        expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    });

    it('o botão possui as classes CSS corretas', () => {
        render(<BtnVoltar />);
        const btn = screen.getByRole('button', { name: 'Voltar' });
        expect(btn).toHaveClass('btn', 'btn-outline-success');
    });

    it('navega para "/gestao-de-usuarios-list" ao clicar', () => {
        render(<BtnVoltar />);
        fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
        expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-usuarios-list');
    });

    it('chama navigate apenas uma vez por clique', () => {
        render(<BtnVoltar />);
        fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});
