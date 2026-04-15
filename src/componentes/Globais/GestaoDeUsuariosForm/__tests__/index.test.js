import React from 'react';
import { render, screen } from '@testing-library/react';
import { GestaoDeUsuariosFormPage } from '../index';

// ── SCSS mock ─────────────────────────────────────────────────────────────────
jest.mock('../style/gestao-de-usuarios-form.scss', () => ({}));

// ── PaginasContainer mock ─────────────────────────────────────────────────────
jest.mock('../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

// ── GestaoDeUsuariosFormProvider mock ─────────────────────────────────────────
jest.mock('../context/GestaoDeUsuariosFormProvider', () => ({
    GestaoDeUsuariosFormProvider: ({ children }) => (
        <div data-testid="gestao-usuarios-form-provider">{children}</div>
    ),
}));

// ── GestaoDeUsuariosFormMain mock ─────────────────────────────────────────────
jest.mock('../components/GestaoDeUsuariosFormMain', () => ({
    GestaoDeUsuariosFormMain: () => <div data-testid="gestao-usuarios-form-main" />,
}));

describe('GestaoDeUsuariosFormPage', () => {
    it('renderiza sem erros', () => {
        render(<GestaoDeUsuariosFormPage />);
        expect(screen.getByTestId('gestao-usuarios-form-provider')).toBeInTheDocument();
    });

    it('exibe o título "Gestão de usuários"', () => {
        render(<GestaoDeUsuariosFormPage />);
        expect(screen.getByRole('heading', { level: 1, name: 'Gestão de usuários' })).toBeInTheDocument();
    });

    it('o título possui a classe correta', () => {
        render(<GestaoDeUsuariosFormPage />);
        const titulo = screen.getByRole('heading', { level: 1 });
        expect(titulo).toHaveClass('titulo-itens-painel', 'mt-5');
    });

    it('renderiza o componente GestaoDeUsuariosFormMain', () => {
        render(<GestaoDeUsuariosFormPage />);
        expect(screen.getByTestId('gestao-usuarios-form-main')).toBeInTheDocument();
    });

    it('envolve o conteúdo em PaginasContainer', () => {
        render(<GestaoDeUsuariosFormPage />);
        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    });

    it('envolve a página no GestaoDeUsuariosFormProvider', () => {
        render(<GestaoDeUsuariosFormPage />);
        const provider = screen.getByTestId('gestao-usuarios-form-provider');
        const container = screen.getByTestId('paginas-container');
        expect(provider).toContainElement(container);
    });

    it('o conteúdo interno possui a classe page-content-inner', () => {
        render(<GestaoDeUsuariosFormPage />);
        const inner = screen.getByTestId('gestao-usuarios-form-main').parentElement;
        expect(inner).toHaveClass('page-content-inner');
    });
});
