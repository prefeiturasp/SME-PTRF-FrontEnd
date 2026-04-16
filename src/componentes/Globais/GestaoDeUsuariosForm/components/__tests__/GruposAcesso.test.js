import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GrupoAcesso } from '../GruposAcesso';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';

// ── SCSS mock ─────────────────────────────────────────────────────────────────
jest.mock('../../style/grupos-acesso.scss', () => ({}));

// ── FontAwesome mock ──────────────────────────────────────────────────────────
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="icon-exclamation" />,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faExclamationCircle: {},
}));

// ── Permissão mock ────────────────────────────────────────────────────────────
jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

// ── Hooks mocks ───────────────────────────────────────────────────────────────
jest.mock('../../hooks/useGruposDisponiveisAcesso', () => ({
    useGruposDisponiveisAcesso: jest.fn(),
}));
jest.mock('../../hooks/useDesabilitarGrupoAcesso', () => ({
    useDesabilitarGrupoAcesso: jest.fn(),
}));
jest.mock('../../hooks/useHabilitarGrupoAcesso', () => ({
    useHabilitarGrupoAcesso: jest.fn(),
}));

import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';
import { useGruposDisponiveisAcesso } from '../../hooks/useGruposDisponiveisAcesso';
import { useDesabilitarGrupoAcesso } from '../../hooks/useDesabilitarGrupoAcesso';
import { useHabilitarGrupoAcesso } from '../../hooks/useHabilitarGrupoAcesso';

const GRUPOS_MOCK = [
    { id: 1, grupo: 'Administrador', descricao: 'Acesso total', possui_acesso: true },
    { id: 2, grupo: 'Leitura', descricao: '', possui_acesso: false },
];

const USUARIO_MOCK = { username: 'joao', id: 1 };

const buildContext = (overrides = {}) => ({
    visaoBase: 'DRE',
    uuidUnidadeBase: 'uuid-1',
    modo: 'Editar Usuário',
    setModo: jest.fn(),
    Modos: {},
    usuarioId: '1',
    setUsuarioId: jest.fn(),
    ...overrides,
});

const mockMutate = jest.fn();

const setupDefaultMocks = () => {
    RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
    useGruposDisponiveisAcesso.mockReturnValue({ isLoading: false, data: GRUPOS_MOCK });
    useDesabilitarGrupoAcesso.mockReturnValue({ mutationDesabilitarGrupoAcesso: { mutate: mockMutate } });
    useHabilitarGrupoAcesso.mockReturnValue({ mutationHabilitarGrupoAcesso: { mutate: mockMutate } });
};

const renderComponent = (props = {}, contextOverrides = {}) => {
    return render(
        <GestaoDeUsuariosFormContext.Provider value={buildContext(contextOverrides)}>
            <GrupoAcesso usuario={USUARIO_MOCK} {...props} />
        </GestaoDeUsuariosFormContext.Provider>
    );
};

describe('GrupoAcesso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupDefaultMocks();
    });

    it('renderiza o título "Grupos de acesso"', () => {
        renderComponent();
        expect(screen.getByText('Grupos de acesso')).toBeInTheDocument();
    });

    it('renderiza a lista de grupos quando há dados', () => {
        renderComponent();
        expect(screen.getByText('Administrador')).toBeInTheDocument();
        expect(screen.getByText('Leitura')).toBeInTheDocument();
    });

    it('exibe a descrição do grupo entre colchetes quando presente', () => {
        renderComponent();
        expect(screen.getByText('[Acesso total]')).toBeInTheDocument();
    });

    it('não exibe descrição vazia quando descricao é string vazia', () => {
        renderComponent();
        const descricoes = screen.getAllByText(/^\[.*\]$/);
        expect(descricoes).toHaveLength(1);
    });

    it('renderiza um checkbox por grupo', () => {
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(2);
    });

    it('o checkbox fica marcado quando grupo.possui_acesso=true', () => {
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).toBeChecked();
    });

    it('o checkbox fica desmarcado quando grupo.possui_acesso=false', () => {
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[1]).not.toBeChecked();
    });

    it('chama mutationDesabilitarGrupoAcesso quando clica no grupo que já tem acesso', () => {
        const mutateDesabilitar = jest.fn();
        useDesabilitarGrupoAcesso.mockReturnValue({
            mutationDesabilitarGrupoAcesso: { mutate: mutateDesabilitar },
        });
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]); // possui_acesso=true → desabilitar
        expect(mutateDesabilitar).toHaveBeenCalledWith({
            payload: { username: USUARIO_MOCK.username, id_grupo: 1 },
        });
    });

    it('chama mutationHabilitarGrupoAcesso quando clica no grupo sem acesso', () => {
        const mutateHabilitar = jest.fn();
        useHabilitarGrupoAcesso.mockReturnValue({
            mutationHabilitarGrupoAcesso: { mutate: mutateHabilitar },
        });
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]); // possui_acesso=false → habilitar
        expect(mutateHabilitar).toHaveBeenCalledWith({
            payload: { username: USUARIO_MOCK.username, id_grupo: 2 },
        });
    });

    it('desabilita os checkboxes quando não tem permissão de edição', () => {
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((cb) => expect(cb).toBeDisabled());
    });

    it('habilita os checkboxes quando tem permissão de edição', () => {
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
        renderComponent();
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((cb) => expect(cb).not.toBeDisabled());
    });

    it('exibe aviso quando todos os grupos estão sem acesso', () => {
        const gruposSemAcesso = [
            { id: 1, grupo: 'Admin', descricao: '', possui_acesso: false },
            { id: 2, grupo: 'Leitura', descricao: '', possui_acesso: false },
        ];
        useGruposDisponiveisAcesso.mockReturnValue({ isLoading: false, data: gruposSemAcesso });
        renderComponent();
        expect(
            screen.getByText(/Selecione pelo menos um grupo de acesso para este usuário/)
        ).toBeInTheDocument();
    });

    it('não exibe aviso quando pelo menos um grupo tem acesso', () => {
        renderComponent();
        expect(
            screen.queryByText(/Selecione pelo menos um grupo de acesso/)
        ).not.toBeInTheDocument();
    });

    it('exibe mensagem informando para selecionar unidade quando usuario está presente mas sem grupos', () => {
        useGruposDisponiveisAcesso.mockReturnValue({ isLoading: false, data: [] });
        renderComponent();
        expect(
            screen.getByText(/Selecione uma unidade para visualizar os/)
        ).toBeInTheDocument();
    });

    it('exibe mensagem informando para indicar usuário quando usuario é null', () => {
        useGruposDisponiveisAcesso.mockReturnValue({ isLoading: false, data: [] });
        renderComponent({ usuario: null });
        expect(
            screen.getByText(/Indique um usuário para visualizar os grupos/)
        ).toBeInTheDocument();
    });
});
