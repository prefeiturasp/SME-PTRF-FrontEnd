import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddUsuario } from '../AddUsuario';
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';

const mockNavigate = jest.fn();
const mockRemoveQueries = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQueryClient: () => ({ removeQueries: mockRemoveQueries }),
}));

jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

describe('AddUsuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
    });

    it('renderiza o botão com texto "Adicionar"', () => {
        render(<AddUsuario />);
        expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();
    });

    it('renderiza o ícone FontAwesome dentro do botão', () => {
        render(<AddUsuario />);
        expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
    });

    it('habilita o botão quando o usuário tem permissão de edição', () => {
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
        render(<AddUsuario />);
        expect(screen.getByRole('button', { name: /Adicionar/i })).not.toBeDisabled();
    });

    it('desabilita o botão quando o usuário não tem permissão de edição', () => {
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
        render(<AddUsuario />);
        expect(screen.getByRole('button', { name: /Adicionar/i })).toBeDisabled();
    });

    it('navega para /gestao-de-usuarios-form ao clicar', () => {
        render(<AddUsuario />);
        fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-usuarios-form');
    });

    it('remove as queries de grupos ao clicar', () => {
        render(<AddUsuario />);
        fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }));
        expect(mockRemoveQueries).toHaveBeenCalledWith('grupos-disponiveis-acesso-usuario');
    });

    it('não chama navigate quando botão está desabilitado', () => {
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
        render(<AddUsuario />);
        fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }));
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
