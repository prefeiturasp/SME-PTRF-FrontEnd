import React from 'react';
import { render, screen } from '@testing-library/react';
import { GestaoDeUsuariosFormMain } from '../GestaoDeUsuariosFormMain';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';

// ── Router mock ───────────────────────────────────────────────────────────────
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

// ── Hooks mocks ───────────────────────────────────────────────────────────────
jest.mock('../../hooks/useUsuario', () => ({
    useUsuario: jest.fn(),
}));

// ── Child components mocks ────────────────────────────────────────────────────
jest.mock('../BarraTopoForm', () => ({
    BarraTopoForm: () => <div data-testid="barra-topo-form" />,
}));

jest.mock('../FormUsuario', () => ({
    FormUsuario: ({ usuario }) => (
        <div data-testid="form-usuario" data-usuario={usuario ? JSON.stringify(usuario) : 'null'} />
    ),
}));

jest.mock('../UnidadesUsuario', () => ({
    UnidadesUsuario: ({ usuario }) => (
        <div data-testid="unidades-usuario" data-usuario={usuario ? JSON.stringify(usuario) : 'null'} />
    ),
}));

jest.mock('../GruposAcesso', () => ({
    GrupoAcesso: ({ usuario }) => (
        <div data-testid="grupo-acesso" data-usuario={usuario ? JSON.stringify(usuario) : 'null'} />
    ),
}));

jest.mock('../../context/UnidadesUsuarioProvider', () => ({
    UnidadesUsuarioProvider: ({ children }) => (
        <div data-testid="unidades-usuario-provider">{children}</div>
    ),
    UnidadesUsuarioContext: {
        Provider: ({ children }) => children,
    },
}));

import { useParams } from 'react-router-dom';
import { useUsuario } from '../../hooks/useUsuario';

const MODOS = {
    INSERT: 'Adicionar Usuário',
    EDIT: 'Editar Usuário',
    VIEW: 'Visualizar Usuário',
};

const buildContext = (overrides = {}) => ({
    modo: MODOS.VIEW,
    setModo: jest.fn(),
    Modos: MODOS,
    usuarioId: '',
    setUsuarioId: jest.fn(),
    visaoBase: 'DRE',
    uuidUnidadeBase: 'uuid-1',
    ...overrides,
});

const renderComponent = (contextOverrides = {}) => {
    return render(
        <GestaoDeUsuariosFormContext.Provider value={buildContext(contextOverrides)}>
            <GestaoDeUsuariosFormMain />
        </GestaoDeUsuariosFormContext.Provider>
    );
};

describe('GestaoDeUsuariosFormMain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({});
        useUsuario.mockReturnValue({ data: null, isLoading: false });
    });

    it('renderiza o BarraTopoForm', () => {
        renderComponent();
        expect(screen.getByTestId('barra-topo-form')).toBeInTheDocument();
    });

    it('renderiza o FormUsuario', () => {
        renderComponent();
        expect(screen.getByTestId('form-usuario')).toBeInTheDocument();
    });

    it('renderiza o UnidadesUsuario dentro do UnidadesUsuarioProvider', () => {
        renderComponent();
        expect(screen.getByTestId('unidades-usuario')).toBeInTheDocument();
        expect(screen.getByTestId('unidades-usuario-provider')).toBeInTheDocument();
    });

    it('renderiza o GrupoAcesso', () => {
        renderComponent();
        expect(screen.getByTestId('grupo-acesso')).toBeInTheDocument();
    });

    it('chama setUsuarioId com o id_usuario lido dos params', () => {
        const setUsuarioId = jest.fn();
        useParams.mockReturnValue({ id_usuario: '42' });
        renderComponent({ setUsuarioId });
        expect(setUsuarioId).toHaveBeenCalledWith('42');
    });

    it('chama setModo com Modos.EDIT quando id_usuario está presente', () => {
        const setModo = jest.fn();
        useParams.mockReturnValue({ id_usuario: '42' });
        renderComponent({ setModo });
        expect(setModo).toHaveBeenCalledWith(MODOS.EDIT);
    });

    it('chama setModo com Modos.INSERT quando id_usuario está ausente', () => {
        const setModo = jest.fn();
        useParams.mockReturnValue({ id_usuario: undefined });
        renderComponent({ setModo });
        expect(setModo).toHaveBeenCalledWith(MODOS.INSERT);
    });

    it('passa o usuario carregado para o FormUsuario', () => {
        const usuario = { id: 1, username: 'joao' };
        useParams.mockReturnValue({ id_usuario: '1' });
        useUsuario.mockReturnValue({ data: usuario, isLoading: false });
        renderComponent();
        const formEl = screen.getByTestId('form-usuario');
        expect(JSON.parse(formEl.getAttribute('data-usuario'))).toEqual(usuario);
    });

    it('passa null para o FormUsuario quando não há usuario', () => {
        useParams.mockReturnValue({});
        useUsuario.mockReturnValue({ data: null, isLoading: false });
        renderComponent();
        const formEl = screen.getByTestId('form-usuario');
        expect(formEl.getAttribute('data-usuario')).toBe('null');
    });

    it('chama useUsuario com o id_usuario dos params', () => {
        useParams.mockReturnValue({ id_usuario: '99' });
        renderComponent();
        expect(useUsuario).toHaveBeenCalledWith('99');
    });
});
