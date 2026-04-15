import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopoComBotao } from '../TopoComBotao';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('TopoComBotao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o título "Adicionar Unidades"', () => {
        render(<TopoComBotao />);
        expect(screen.getByText('Adicionar Unidades')).toBeInTheDocument();
    });

    it('deve renderizar o botão "Voltar"', () => {
        render(<TopoComBotao />);
        expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
    });

    it('deve chamar navigate(-1) ao clicar em "Voltar"', () => {
        render(<TopoComBotao />);
        fireEvent.click(screen.getByRole('button', { name: /voltar/i }));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
