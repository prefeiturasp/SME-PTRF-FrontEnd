import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraTopoForm } from '../BarraTopoForm';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';

// ── Navegação mock ────────────────────────────────────────────────────────────
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// ── BtnVoltar mock ────────────────────────────────────────────────────────────
jest.mock('../BtnVoltar', () => ({
    BtnVoltar: () => <button data-testid="btn-voltar">Voltar</button>,
}));

const buildContext = (overrides = {}) => ({
    modo: 'Adicionar Usuário',
    setModo: jest.fn(),
    Modos: { INSERT: 'Adicionar Usuário', EDIT: 'Editar Usuário', VIEW: 'Visualizar Usuário' },
    visaoBase: 'UE',
    uuidUnidadeBase: 'uuid-1',
    usuarioId: '',
    setUsuarioId: jest.fn(),
    ...overrides,
});

const renderWithContext = (contextValue) =>
    render(
        <GestaoDeUsuariosFormContext.Provider value={contextValue}>
            <BarraTopoForm />
        </GestaoDeUsuariosFormContext.Provider>
    );

describe('BarraTopoForm', () => {
    it('renderiza o modo lido do contexto como título h2', () => {
        renderWithContext(buildContext({ modo: 'Adicionar Usuário' }));
        expect(screen.getByRole('heading', { level: 2, name: 'Adicionar Usuário' })).toBeInTheDocument();
    });

    it('exibe modo "Editar Usuário" quando contexto informa esse valor', () => {
        renderWithContext(buildContext({ modo: 'Editar Usuário' }));
        expect(screen.getByRole('heading', { level: 2, name: 'Editar Usuário' })).toBeInTheDocument();
    });

    it('exibe modo "Visualizar Usuário" quando contexto informa esse valor', () => {
        renderWithContext(buildContext({ modo: 'Visualizar Usuário' }));
        expect(screen.getByRole('heading', { level: 2, name: 'Visualizar Usuário' })).toBeInTheDocument();
    });

    it('renderiza o componente BtnVoltar', () => {
        renderWithContext(buildContext());
        expect(screen.getByTestId('btn-voltar')).toBeInTheDocument();
    });

    it('a barra possui a classe CSS correta', () => {
        const { container } = renderWithContext(buildContext());
        expect(container.querySelector('.barra-topo-form-usuarios')).toBeInTheDocument();
    });
});
