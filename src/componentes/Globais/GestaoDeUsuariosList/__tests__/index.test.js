import React from 'react';
import { render, screen } from '@testing-library/react';
import { GestaoDeUsuariosListPage } from '../index';

jest.mock('../context/GestaoDeUsuariosListProvider', () => ({
    GestaoDeUsuariosListProvider: ({ children }) => (
        <div data-testid="provider">{children}</div>
    ),
}));

jest.mock('../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => (
        <div data-testid="paginas-container">{children}</div>
    ),
}));

jest.mock('../components/GestaoDeUsuariosListMain', () => ({
    GestaoDeUsuariosListMain: () => (
        <div data-testid="gestao-usuarios-main" />
    ),
}));

describe('GestaoDeUsuariosListPage', () => {
    it('renderiza o título "Gestão de usuários"', () => {
        render(<GestaoDeUsuariosListPage />);
        expect(screen.getByRole('heading', { name: 'Gestão de usuários' })).toBeInTheDocument();
    });

    it('renderiza o componente GestaoDeUsuariosListMain', () => {
        render(<GestaoDeUsuariosListPage />);
        expect(screen.getByTestId('gestao-usuarios-main')).toBeInTheDocument();
    });

    it('envolve o conteúdo em PaginasContainer', () => {
        render(<GestaoDeUsuariosListPage />);
        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    });

    it('envolve tudo em GestaoDeUsuariosListProvider', () => {
        render(<GestaoDeUsuariosListPage />);
        expect(screen.getByTestId('provider')).toBeInTheDocument();
    });

    it('o provider contém o PaginasContainer', () => {
        render(<GestaoDeUsuariosListPage />);
        const provider = screen.getByTestId('provider');
        expect(provider).toContainElement(screen.getByTestId('paginas-container'));
    });

    it('o PaginasContainer contém o título e o main', () => {
        render(<GestaoDeUsuariosListPage />);
        const container = screen.getByTestId('paginas-container');
        expect(container).toContainElement(
            screen.getByRole('heading', { name: 'Gestão de usuários' })
        );
        expect(container).toContainElement(screen.getByTestId('gestao-usuarios-main'));
    });

    it('o título tem a classe correta', () => {
        render(<GestaoDeUsuariosListPage />);
        const titulo = screen.getByRole('heading', { name: 'Gestão de usuários' });
        expect(titulo).toHaveClass('titulo-itens-painel', 'mt-5');
    });

    it('o main está dentro de div.page-content-inner', () => {
        render(<GestaoDeUsuariosListPage />);
        const main = screen.getByTestId('gestao-usuarios-main');
        expect(main.closest('.page-content-inner')).toBeInTheDocument();
    });
});
