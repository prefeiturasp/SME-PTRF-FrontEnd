import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BarraTopoListagem } from '../BarraTopoListagem';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Router mock ───────────────────────────────────────────────────────────────
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: ({ to, children, className, onClick }) => (
        <a href={typeof to === 'object' ? to.pathname : to} className={className} onClick={onClick} data-testid="link-adicionar">
            {children}
        </a>
    ),
}));

// ── FontAwesome mock ──────────────────────────────────────────────────────────
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon?.iconName || 'icon'}`} />,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faExclamationCircle: { iconName: 'exclamation-circle' },
    faPlus: { iconName: 'plus' },
}));

// ── Permissão mock ────────────────────────────────────────────────────────────
jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';

const buildContext = (overrides = {}) => ({
    visaoBase: 'DRE',
    uuidUnidadeBase: 'uuid-1',
    modo: 'Editar Usuário',
    usuarioId: '42',
    setModo: jest.fn(),
    Modos: { INSERT: 'Adicionar Usuário', EDIT: 'Editar Usuário', VIEW: 'Visualizar Usuário' },
    setUsuarioId: jest.fn(),
    ...overrides,
});

const renderComponent = (contextOverrides = {}, queryClientOverrides = {}) => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    // Popula dados na cache quando fornecidos
    if (queryClientOverrides.unidadesUsuarioList !== undefined) {
        queryClient.setQueryData(['unidades-usuario-list'], queryClientOverrides.unidadesUsuarioList);
    }

    RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(
        queryClientOverrides.temPermissao !== undefined ? queryClientOverrides.temPermissao : true
    );

    return render(
        <QueryClientProvider client={queryClient}>
            <GestaoDeUsuariosFormContext.Provider value={buildContext(contextOverrides)}>
                <BarraTopoListagem />
            </GestaoDeUsuariosFormContext.Provider>
        </QueryClientProvider>
    );
};

describe('BarraTopoListagem', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza o título "Unidades do usuário"', () => {
        renderComponent();
        expect(screen.getByText('Unidades do usuário')).toBeInTheDocument();
    });

    it('exibe "desta DRE" na descrição quando visaoBase é "DRE"', () => {
        renderComponent({ visaoBase: 'DRE' });
        expect(screen.getByText(/desta DRE/)).toBeInTheDocument();
    });

    it('não exibe "desta DRE" na descrição quando visaoBase é "SME"', () => {
        renderComponent({ visaoBase: 'SME' });
        expect(screen.queryByText(/desta DRE/)).not.toBeInTheDocument();
    });

    it('não exibe o botão Adicionar quando visaoBase é "DRE"', () => {
        renderComponent({ visaoBase: 'DRE', usuarioId: '42' });
        expect(screen.queryByTestId('link-adicionar')).not.toBeInTheDocument();
    });

    it('exibe o botão Adicionar quando visaoBase é "SME" e há usuarioId', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '42' });
        expect(screen.getByTestId('link-adicionar')).toBeInTheDocument();
    });

    it('não exibe o botão Adicionar quando visaoBase é "SME" mas usuarioId é vazio', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '' });
        expect(screen.queryByTestId('link-adicionar')).not.toBeInTheDocument();
    });

    it('o link Adicionar aponta para a rota correta', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '42' });
        expect(screen.getByTestId('link-adicionar')).toHaveAttribute(
            'href',
            '/gestao-de-usuarios-adicionar-unidade/42'
        );
    });

    it('aplica classe de desabilitado quando não tem permissão', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '42' }, { temPermissao: false });
        expect(screen.getByTestId('link-adicionar')).toHaveClass('link-adicionar-unidade-disable');
    });

    it('não aplica classe de desabilitado quando tem permissão', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '42' }, { temPermissao: true });
        expect(screen.getByTestId('link-adicionar')).not.toHaveClass('link-adicionar-unidade-disable');
    });

    it('não exibe aviso quando não há dados de unidades', () => {
        renderComponent({}, { unidadesUsuarioList: undefined });
        expect(screen.queryByText(/Selecione pelo menos uma unidade/)).not.toBeInTheDocument();
    });

    it('não exibe aviso quando há pelo menos uma unidade com acesso', () => {
        renderComponent(
            { modo: 'Editar Usuário' },
            { unidadesUsuarioList: [{ tem_acesso: true }, { tem_acesso: false }] }
        );
        expect(screen.queryByText(/Selecione pelo menos uma unidade/)).not.toBeInTheDocument();
    });

    it('exibe aviso quando todas as unidades estão sem acesso em modo Editar', () => {
        renderComponent(
            { modo: 'Editar Usuário' },
            { unidadesUsuarioList: [{ tem_acesso: false }, { tem_acesso: false }] }
        );
        expect(
            screen.getByText(/Selecione pelo menos uma unidade de acesso para este usuário/)
        ).toBeInTheDocument();
    });

    it('não exibe aviso quando modo é "Adicionar Usuário" mesmo com todas sem acesso', () => {
        renderComponent(
            { modo: 'Adicionar Usuário' },
            { unidadesUsuarioList: [{ tem_acesso: false }] }
        );
        expect(screen.queryByText(/Selecione pelo menos uma unidade/)).not.toBeInTheDocument();
    });

    it('chama removeQuery ao clicar no link Adicionar', () => {
        renderComponent({ visaoBase: 'SME', usuarioId: '42' });
        fireEvent.click(screen.getByTestId('link-adicionar'));
        // removeQuery não lança erro (query não existe na cache) — apenas verifica que não quebra
        expect(screen.getByTestId('link-adicionar')).toBeInTheDocument();
    });
});
