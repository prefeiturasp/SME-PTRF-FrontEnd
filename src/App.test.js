import React from 'react';
import {render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mockar os componentes que você não quer testar agora
jest.mock('./rotas', () => ({
    Rotas: () => <div data-testid="rotas" />
}));

jest.mock('./componentes/Globais/Cabecalho', () => ({
    Cabecalho: () => <div data-testid="cabecalho" />
}));

jest.mock('./componentes/Globais/SidebarLeft', () => ({
    SidebarLeft: () => <div data-testid="sidebar-left" />
}));

jest.mock('./componentes/Globais/Modal/Modal', () => ({
    __esModule: true,
    default: () => <div data-testid="modal" />
}));

describe('App Component', () => {

    const renderWithRouter = (route) => {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <App />
            </MemoryRouter>
        );
    };

    test('Renderiza apenas Rotas nas rotas de login', () => {
        renderWithRouter('/login');

        expect(screen.getByTestId('rotas')).toBeInTheDocument();
        expect(screen.queryByTestId('cabecalho')).not.toBeInTheDocument();
        expect(screen.queryByTestId('sidebar-left')).not.toBeInTheDocument();
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('Renderiza Cabecalho + SidebarLeft + Rotas para outras rotas', () => {
        renderWithRouter('/dashboard');

        expect(screen.getByTestId('rotas')).toBeInTheDocument();
        expect(screen.getByTestId('cabecalho')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar-left')).toBeInTheDocument();
    });

});
