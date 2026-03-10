import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FormUsuario } from '../FormUsuario';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';
import { useCreateUsuario } from '../../hooks/useCreateUsuario';
import { useUpdateUsuario } from '../../hooks/useUpdateUsuario';
import { useUsuarioStatus } from '../../hooks/useUsuarioStatus';
import { useRemoveAcessosUsuario } from '../../../GestaoDeUsuarios/hooks/useRemoveAcessosUsuario';
import { toastCustom } from '../../../ToastCustom';
import { valida_cpf_cnpj } from '../../../../../utils/ValidacoesAdicionaisFormularios';
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';

// ── Router mock ───────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// ── Hooks mocks ───────────────────────────────────────────────────────────────
jest.mock('../../hooks/useCreateUsuario', () => ({ useCreateUsuario: jest.fn() }));
jest.mock('../../hooks/useUpdateUsuario', () => ({ useUpdateUsuario: jest.fn() }));
jest.mock('../../hooks/useUsuarioStatus', () => ({ useUsuarioStatus: jest.fn() }));
jest.mock('../../../GestaoDeUsuarios/hooks/useRemoveAcessosUsuario', () => ({
    useRemoveAcessosUsuario: jest.fn(),
}));

// ── Service mock ──────────────────────────────────────────────────────────────
jest.mock('../../../../../services/GestaoDeUsuarios.service', () => ({
    removerAcessosUnidadeBase: jest.fn(),
}));

// ── Permission mock ───────────────────────────────────────────────────────────
jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

// ── Toast mock ────────────────────────────────────────────────────────────────
jest.mock('../../../ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

// ── Loading mock ──────────────────────────────────────────────────────────────
jest.mock('../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading" />,
}));

// ── MaskedInput mock ──────────────────────────────────────────────────────────
jest.mock('react-text-mask', () => ({
    __esModule: true,
    default: ({ mask, guide, showMask, ...props }) => <input {...props} />,
}));

// ── Validation mock ───────────────────────────────────────────────────────────
jest.mock('../../../../../utils/ValidacoesAdicionaisFormularios', () => ({
    valida_cpf_cnpj: jest.fn(),
}));

// ── Modal mocks ───────────────────────────────────────────────────────────────
jest.mock('../ModalConfirmacao', () => ({
    ModalConfirmacao: ({ show, botaoCancelarHandle, botaoConfirmarHandle }) =>
        show ? (
            <>
                <button data-testid="modal-coressp-cancelar" onClick={botaoCancelarHandle}>
                    Cancelar CoreSSO
                </button>
                <button data-testid="modal-coressp-confirmar" onClick={botaoConfirmarHandle}>
                    Confirmar CoreSSO
                </button>
            </>
        ) : null,
}));

jest.mock('../ModalValidacao', () => ({
    ModalValidacao: ({ show, botaoFecharHandle }) =>
        show ? (
            <button data-testid="modal-validacao-fechar" onClick={botaoFecharHandle}>
                Fechar Validação
            </button>
        ) : null,
}));

jest.mock('../../../GestaoDeUsuarios/components/ModalConfirmacaoRemoverAcesso', () => ({
    ModalConfirmacaoRemoverAcesso: ({ show, botaoCancelarHandle, botaoConfirmarHandle }) =>
        show ? (
            <>
                <button data-testid="modal-remover-cancelar" onClick={botaoCancelarHandle}>
                    Cancelar Remover
                </button>
                <button data-testid="modal-remover-confirmar" onClick={botaoConfirmarHandle}>
                    Confirmar Remover
                </button>
            </>
        ) : null,
}));

jest.mock('../../../GestaoDeUsuarios/utils/mensagens-remover-acesso', () => ({
    showMensagemSucessoAoRemoverAcesso: jest.fn(),
    showMensagemErroAoRemoverAcesso: jest.fn(),
}));

// ── Context / Render helpers ──────────────────────────────────────────────────
const Modos = {
    INSERT: 'Adicionar Usuário',
    EDIT: 'Editar Usuário',
    VIEW: 'Visualizar Usuário',
};

const mockCreateMutate = jest.fn();
const mockUpdateMutate = jest.fn();
const mockRemoveMutate = jest.fn();

const defaultContextValue = {
    modo: Modos.INSERT,
    Modos,
    uuidUnidadeBase: 'uuid-unidade-123',
    visaoBase: 'UE',
};

// Form inputs don't have id attributes matching their labels' htmlFor, so we
// query by role / placeholder / container selector instead of getByLabelText.
const getSelect = () => screen.getByRole('combobox'); // the <select name="e_servidor">
const getNameInput = (container) => container.querySelector('input[name="name"]');
const getEmailInput = () => screen.getByPlaceholderText('Insira o email');
const getUsernameInput = (placeholder) =>
    screen.getByPlaceholderText(placeholder || /Insira o RF do servidor/i);

const renderComponent = (contextOverrides = {}, props = {}) =>
    render(
        <GestaoDeUsuariosFormContext.Provider value={{ ...defaultContextValue, ...contextOverrides }}>
            <FormUsuario {...props} />
        </GestaoDeUsuariosFormContext.Provider>
    );

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('FormUsuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCreateUsuario.mockReturnValue({ mutate: mockCreateMutate, isPending: false, error: null, data: null });
        useUpdateUsuario.mockReturnValue({ mutate: mockUpdateMutate, isPending: false, error: null, data: null });
        useUsuarioStatus.mockReturnValue({ data: null, isLoading: false });
        useRemoveAcessosUsuario.mockReturnValue({ mutate: mockRemoveMutate, isPending: false, error: null, data: null });
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
        valida_cpf_cnpj.mockReturnValue(true);
    });

    // ── Renderização básica ───────────────────────────────────────────────────
    describe('renderização básica', () => {
        it('renderiza o formulário com campos principais', () => {
            const { container } = renderComponent();
            expect(getSelect()).toBeInTheDocument();
            expect(getNameInput(container)).toBeInTheDocument();
            expect(getEmailInput()).toBeInTheDocument();
            expect(screen.getByText('Salvar')).toBeInTheDocument();
            expect(screen.getByText(/\* Preenchimento obrigatório/i)).toBeInTheDocument();
        });

        it('não renderiza botão "Remover acesso" no modo INSERT', () => {
            renderComponent({ modo: Modos.INSERT });
            expect(screen.queryByText('Remover acesso')).not.toBeInTheDocument();
        });

        it('renderiza botão "Remover acesso" no modo EDIT', () => {
            renderComponent({ modo: Modos.EDIT });
            expect(screen.getByText('Remover acesso')).toBeInTheDocument();
        });

        it('exibe Loading e oculta nome/email quando isLoading=true', () => {
            useUsuarioStatus.mockReturnValue({ data: null, isLoading: true });
            const { container } = renderComponent();
            expect(screen.getByTestId('loading')).toBeInTheDocument();
            expect(getNameInput(container)).not.toBeInTheDocument();
            expect(screen.queryByPlaceholderText('Insira o email')).not.toBeInTheDocument();
        });

        it('renderiza campos nome/email quando isLoading=false', () => {
            const { container } = renderComponent();
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(getNameInput(container)).toBeInTheDocument();
            expect(getEmailInput()).toBeInTheDocument();
        });

        it('desabilita Salvar quando sem permissão de edição', () => {
            RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
            renderComponent();
            expect(screen.getByText('Salvar')).toBeDisabled();
        });

        it('desabilita "Remover acesso" quando sem permissão', () => {
            RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
            renderComponent({ modo: Modos.EDIT });
            expect(screen.getByText('Remover acesso')).toBeDisabled();
        });

        it('mostra label CPF quando e_servidor=False', async () => {
            renderComponent();
            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'False', name: 'e_servidor' } });
            });
            expect(screen.getByText(/CPF \*/i)).toBeInTheDocument();
        });

        it('mostra label RF quando e_servidor não é False', () => {
            renderComponent();
            // Default: e_servidor='' → label shows "RF *"
            expect(screen.getByText(/RF \*/i)).toBeInTheDocument();
        });

        it('select Tipo de usuário desabilitado no modo EDIT', () => {
            renderComponent({ modo: Modos.EDIT });
            expect(getSelect()).toBeDisabled();
        });

        it('select Tipo de usuário habilitado no modo INSERT com permissão', () => {
            renderComponent({ modo: Modos.INSERT });
            expect(getSelect()).not.toBeDisabled();
        });
    });

    // ── Prop usuario → popula formulário ─────────────────────────────────────
    describe('useEffect: popula valores a partir do prop usuario', () => {
        it('preenche o formulário quando usuario.e_servidor=true', async () => {
            const usuario = {
                id: 1, e_servidor: true, username: '1234567',
                name: 'José da Silva', email: 'jose@test.com',
            };
            const { container } = renderComponent({}, { usuario });
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('José da Silva');
            });
            expect(getEmailInput()).toHaveValue('jose@test.com');
        });

        it('preenche o formulário quando usuario.e_servidor=false', async () => {
            const usuario = {
                id: 2, e_servidor: false, username: '12345678901',
                name: 'Maria Souza', email: '',
            };
            const { container } = renderComponent({}, { usuario });
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Maria Souza');
            });
        });

        it('mantém formulário vazio quando usuario é undefined', async () => {
            const { container } = renderComponent({}, { usuario: undefined });
            await act(async () => {});
            expect(getNameInput(container)).toHaveValue('');
        });
    });

    // ── Navigate após INSERT ──────────────────────────────────────────────────
    describe('useEffect: navega para novo usuário após INSERT', () => {
        it('navega quando modo=INSERT e resultPost.id existe', async () => {
            useCreateUsuario.mockReturnValue({
                mutate: mockCreateMutate, isPending: false, error: null, data: { id: 42 },
            });
            renderComponent({ modo: Modos.INSERT });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-usuarios-form/42');
            });
        });

        it('não navega quando modo=EDIT mesmo com resultPost', async () => {
            useCreateUsuario.mockReturnValue({
                mutate: mockCreateMutate, isPending: false, error: null, data: { id: 42 },
            });
            renderComponent({ modo: Modos.EDIT });
            await act(async () => {});
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('não navega quando resultPost é null', async () => {
            renderComponent({ modo: Modos.INSERT });
            await act(async () => {});
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    // ── useEffect: usuarioStatus ──────────────────────────────────────────────
    describe('useEffect: usuarioStatus', () => {
        it('não faz nada quando usuarioStatus é null', async () => {
            renderComponent();
            await act(async () => {});
            expect(screen.queryByTestId('modal-coressp-cancelar')).not.toBeInTheDocument();
            expect(screen.queryByTestId('modal-validacao-fechar')).not.toBeInTheDocument();
        });

        it('exibe modal CoreSSO quando usuário não cadastrado no CoreSSO e pode acessar unidade', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: true, mensagem: '' },
                    info_membro_nao_servidor: null,
                },
                isLoading: false,
            });
            renderComponent();
            await waitFor(() => {
                expect(screen.getByTestId('modal-coressp-cancelar')).toBeInTheDocument();
            });
        });

        it('preenche formulário com info_membro_nao_servidor quando disponível e pode acessar', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: true, mensagem: '' },
                    info_membro_nao_servidor: { nome: 'Membro Não Servidor', email: 'membro@test.com' },
                },
                isLoading: false,
            });
            const { container } = renderComponent();
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Membro Não Servidor');
            });
        });

        it('exibe modal de validação quando não pode acessar unidade e sem CoreSSO', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: false, mensagem: 'Acesso negado' },
                    info_membro_nao_servidor: null,
                },
                isLoading: false,
            });
            renderComponent();
            await waitFor(() => {
                expect(screen.getByTestId('modal-validacao-fechar')).toBeInTheDocument();
            });
            expect(screen.queryByTestId('modal-coressp-cancelar')).not.toBeInTheDocument();
        });

        it('preenche form com info_membro e exibe modal validação quando não pode acessar', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: false, mensagem: 'Sem acesso' },
                    info_membro_nao_servidor: { nome: 'Membro', email: 'membro@test.com' },
                },
                isLoading: false,
            });
            const { container } = renderComponent();
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Membro');
                expect(screen.getByTestId('modal-validacao-fechar')).toBeInTheDocument();
            });
        });

        it('CoreSSO cadastrado e SigEscola não cadastrado: preenche form e abre modal validação', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: { info_core_sso: { nome: 'Nome CoreSSO', email: 'coressp@test.com' } },
                    pode_acessar_unidade: { pode_acessar: false, mensagem: 'Aviso' },
                    usuario_sig_escola: null,
                },
                isLoading: false,
            });
            const { container } = renderComponent();
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Nome CoreSSO');
                expect(screen.getByTestId('modal-validacao-fechar')).toBeInTheDocument();
            });
        });

        it('CoreSSO cadastrado e SigEscola não cadastrado com acesso: preenche form sem modal validação', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: { info_core_sso: { nome: 'Nome CoreSSO', email: 'coressp@test.com' } },
                    pode_acessar_unidade: { pode_acessar: true, mensagem: '' },
                    usuario_sig_escola: null,
                },
                isLoading: false,
            });
            const { container } = renderComponent();
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Nome CoreSSO');
            });
            expect(screen.queryByTestId('modal-validacao-fechar')).not.toBeInTheDocument();
        });

        it('CoreSSO e SigEscola cadastrados e pode acessar: navega para o usuário', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: { info_core_sso: { nome: 'Nome CoreSSO', email: 'coressp@test.com' } },
                    pode_acessar_unidade: { pode_acessar: true, mensagem: '' },
                    usuario_sig_escola: { info_sig_escola: { user_id: 99 } },
                },
                isLoading: false,
            });
            renderComponent();
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-usuarios-form/99');
            });
        });

        it('CoreSSO e SigEscola cadastrados e não pode acessar: preenche form e abre modal validação', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: { info_core_sso: { nome: 'Nome SigEscola', email: 'sig@test.com' } },
                    pode_acessar_unidade: { pode_acessar: false, mensagem: 'Sem acesso' },
                    usuario_sig_escola: { info_sig_escola: { user_id: 99 } },
                },
                isLoading: false,
            });
            const { container } = renderComponent();
            await waitFor(() => {
                expect(getNameInput(container)).toHaveValue('Nome SigEscola');
                expect(screen.getByTestId('modal-validacao-fechar')).toBeInTheDocument();
            });
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    // ── Modal CoreSSO ─────────────────────────────────────────────────────────
    describe('modal CoreSSO', () => {
        const setupCoreSSOModal = () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: true, mensagem: '' },
                    info_membro_nao_servidor: null,
                },
                isLoading: false,
            });
        };

        it('fecha modal ao clicar em Cancelar', async () => {
            setupCoreSSOModal();
            renderComponent();
            await waitFor(() => expect(screen.getByTestId('modal-coressp-cancelar')).toBeInTheDocument());

            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-coressp-cancelar'));
            });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-coressp-cancelar')).not.toBeInTheDocument();
            });
        });

        it('desbloqueia campo Nome e fecha modal ao clicar em Confirmar', async () => {
            setupCoreSSOModal();
            const { container } = renderComponent();
            await waitFor(() => expect(screen.getByTestId('modal-coressp-confirmar')).toBeInTheDocument());

            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-coressp-confirmar'));
            });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-coressp-confirmar')).not.toBeInTheDocument();
                expect(getNameInput(container)).not.toHaveAttribute('readonly');
            });
        });

        it('não exibe o modal CoreSSO novamente após confirmação', async () => {
            setupCoreSSOModal();
            renderComponent();
            await waitFor(() => expect(screen.getByTestId('modal-coressp-confirmar')).toBeInTheDocument());

            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-coressp-confirmar'));
            });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-coressp-confirmar')).not.toBeInTheDocument();
            });
        });

        it('onChange do campo Nome é chamado após desbloquear (handleConfirmarCoreSSO)', async () => {
            setupCoreSSOModal();
            const { container } = renderComponent();
            await waitFor(() => expect(screen.getByTestId('modal-coressp-confirmar')).toBeInTheDocument());

            // Confirmar desbloqueia o campo nome (bloquearCampoName=false)
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-coressp-confirmar'));
            });

            await waitFor(() => expect(screen.queryByTestId('modal-coressp-confirmar')).not.toBeInTheDocument());

            // Disparar onChange no input nome (agora desbloqueado)
            await act(async () => {
                fireEvent.change(getNameInput(container), { target: { value: 'Novo Nome', name: 'name' } });
            });

            expect(getNameInput(container)).toHaveValue('Novo Nome');
        });
    });

    // ── Modal Validação de Acesso ─────────────────────────────────────────────
    describe('modal Validação de Acesso', () => {
        it('fecha o modal de validação ao clicar em Fechar', async () => {
            useUsuarioStatus.mockReturnValue({
                data: {
                    usuario_core_sso: null,
                    pode_acessar_unidade: { pode_acessar: false, mensagem: 'Acesso negado' },
                    info_membro_nao_servidor: null,
                },
                isLoading: false,
            });
            renderComponent();
            await waitFor(() => expect(screen.getByTestId('modal-validacao-fechar')).toBeInTheDocument());

            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-validacao-fechar'));
            });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-validacao-fechar')).not.toBeInTheDocument();
            });
        });
    });

    // ── Modal Remover Acesso ──────────────────────────────────────────────────
    describe('modal Remover Acesso', () => {
        it('abre modal ao clicar em "Remover acesso"', async () => {
            renderComponent({ modo: Modos.EDIT });
            await act(async () => {
                fireEvent.click(screen.getByText('Remover acesso'));
            });
            await waitFor(() => {
                expect(screen.getByTestId('modal-remover-cancelar')).toBeInTheDocument();
            });
        });

        it('fecha modal ao clicar em Cancelar', async () => {
            renderComponent({ modo: Modos.EDIT });
            await act(async () => { fireEvent.click(screen.getByText('Remover acesso')); });
            await waitFor(() => expect(screen.getByTestId('modal-remover-cancelar')).toBeInTheDocument());

            await act(async () => { fireEvent.click(screen.getByTestId('modal-remover-cancelar')); });

            await waitFor(() => {
                expect(screen.queryByTestId('modal-remover-cancelar')).not.toBeInTheDocument();
            });
        });

        it('chama removeAcessos com usuario.id ao confirmar', async () => {
            const usuario = { id: 5, e_servidor: true, username: '1234567', name: 'Fulano', email: '' };
            renderComponent({ modo: Modos.EDIT }, { usuario });

            await act(async () => { fireEvent.click(screen.getByText('Remover acesso')); });
            await waitFor(() => expect(screen.getByTestId('modal-remover-confirmar')).toBeInTheDocument());

            await act(async () => { fireEvent.click(screen.getByTestId('modal-remover-confirmar')); });

            expect(mockRemoveMutate).toHaveBeenCalledWith({ id: 5, uuidUnidadeBase: 'uuid-unidade-123' });
        });

        it('não chama removeAcessos quando usuario.id não existe', async () => {
            renderComponent({ modo: Modos.EDIT }, { usuario: undefined });

            await act(async () => { fireEvent.click(screen.getByText('Remover acesso')); });
            await waitFor(() => expect(screen.getByTestId('modal-remover-confirmar')).toBeInTheDocument());

            await act(async () => { fireEvent.click(screen.getByTestId('modal-remover-confirmar')); });

            expect(mockRemoveMutate).not.toHaveBeenCalled();
        });
    });

    // ── validacoesPersonalizadas ──────────────────────────────────────────────
    describe('validacoesPersonalizadas', () => {
        it('exibe erro quando username está vazio ao blur do select', async () => {
            renderComponent();
            await act(async () => { fireEvent.blur(getSelect()); });
            await waitFor(() => {
                expect(screen.getByText(/ID de Usuário é um campo obrigatório/i)).toBeInTheDocument();
            });
        });

        it('exibe erro CPF quando e_servidor=False e CPF inválido', async () => {
            valida_cpf_cnpj.mockReturnValue(false);
            renderComponent();

            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'False', name: 'e_servidor' } });
            });

            const usernameInput = screen.getByPlaceholderText(/Insira o CPF do usuário/i);
            await act(async () => {
                fireEvent.change(usernameInput, { target: { value: '12345678901', name: 'username' } });
            });
            await act(async () => { fireEvent.blur(usernameInput); });

            await waitFor(() => {
                expect(screen.getByText(/Digite um CPF válido/i)).toBeInTheDocument();
            });
        });

        it('limpa erros quando username válido e e_servidor=True', async () => {
            renderComponent();

            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'True', name: 'e_servidor' } });
            });

            const usernameInput = screen.getByPlaceholderText(/Insira o RF do servidor/i);
            await act(async () => {
                fireEvent.change(usernameInput, { target: { value: '1234567', name: 'username' } });
            });
            await act(async () => { fireEvent.blur(usernameInput); });

            await waitFor(() => {
                expect(screen.queryByText(/ID de Usuário é um campo obrigatório/i)).not.toBeInTheDocument();
            });
        });

        it('CPF válido (e_servidor=False): limpa erros', async () => {
            valida_cpf_cnpj.mockReturnValue(true);
            renderComponent();

            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'False', name: 'e_servidor' } });
            });

            const usernameInput = screen.getByPlaceholderText(/Insira o CPF do usuário/i);
            await act(async () => {
                fireEvent.change(usernameInput, { target: { value: '52998224725', name: 'username' } });
            });
            await act(async () => { fireEvent.blur(usernameInput); });

            await waitFor(() => {
                expect(screen.queryByText(/Digite um CPF válido/i)).not.toBeInTheDocument();
            });
        });

        it('blur no campo Nome também chama validacoesPersonalizadas e exibe erro de username vazio', async () => {
            const { container } = renderComponent();
            await act(async () => { fireEvent.blur(getNameInput(container)); });
            await waitFor(() => {
                expect(screen.getByText(/ID de Usuário é um campo obrigatório/i)).toBeInTheDocument();
            });
        });
    });

    // ── idUsuarioCondicionalMask (via placeholder) ────────────────────────────
    describe('idUsuarioCondicionalMask: placeholder indica máscara correta', () => {
        it('RF placeholder (default) quando e_servidor está vazio', () => {
            renderComponent();
            expect(screen.getByPlaceholderText(/Insira o RF do servidor/i)).toBeInTheDocument();
        });

        it('RF placeholder quando e_servidor=True', async () => {
            renderComponent();
            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'True', name: 'e_servidor' } });
            });
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/Insira o RF do servidor/i)).toBeInTheDocument();
            });
        });

        it('CPF placeholder quando e_servidor=False', async () => {
            renderComponent();
            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'False', name: 'e_servidor' } });
            });
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/Insira o CPF do usuário/i)).toBeInTheDocument();
            });
        });
    });

    // ── handleSubmitUsuarioForm ───────────────────────────────────────────────
    describe('handleSubmitUsuarioForm', () => {
        const usuarioValido = {
            id: 1,
            e_servidor: true,
            username: '1234567',
            name: 'Nome Teste',
            email: 'test@test.com',
        };

        it('chama createUsuario com payload correto no modo INSERT', async () => {
            const { container } = renderComponent({ modo: Modos.INSERT }, { usuario: usuarioValido });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(mockCreateMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        e_servidor: 'True',
                        username: '1234567',
                        name: 'Nome Teste',
                        email: 'test@test.com',
                        unidade: 'uuid-unidade-123',
                        visao: 'UE',
                    })
                );
            });
        });

        it('chama updateUsuario com payload correto no modo EDIT', async () => {
            const { container } = renderComponent({ modo: Modos.EDIT }, { usuario: usuarioValido });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(mockUpdateMutate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        id: 1,
                        payload: expect.objectContaining({
                            e_servidor: 'True',
                            username: '1234567',
                            name: 'Nome Teste',
                        }),
                    })
                );
            });
        });

        it('usa unidade=null e visao=null quando uuidUnidadeBase=SME', async () => {
            const { container } = renderComponent(
                { modo: Modos.INSERT, uuidUnidadeBase: 'SME', visaoBase: 'SME' },
                { usuario: usuarioValido }
            );
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(mockCreateMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ unidade: null, visao: null })
                );
            });
        });

        it('exibe toast de inclusão com sucesso no modo INSERT', async () => {
            const { container } = renderComponent({ modo: Modos.INSERT }, { usuario: usuarioValido });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                    'Inclusão efetuada com sucesso.',
                    'Usuário adicionado com sucesso',
                    'success',
                    'top-right',
                    true
                );
            });
        });

        it('exibe toast de alteração com sucesso no modo EDIT', async () => {
            const { container } = renderComponent({ modo: Modos.EDIT }, { usuario: usuarioValido });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                    'Alteração efetuada com sucesso.',
                    'Usuário alterado com sucesso',
                    'success',
                    'top-right',
                    true
                );
            });
        });

        it('usa string vazia para email quando email não preenchido', async () => {
            const usuarioSemEmail = { ...usuarioValido, email: '' };
            const { container } = renderComponent({ modo: Modos.INSERT }, { usuario: usuarioSemEmail });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(mockCreateMutate).toHaveBeenCalledWith(
                    expect.objectContaining({ email: '' })
                );
            });
        });

        it('não envia formulário quando enviarFormulario=false após blur com username vazio', async () => {
            // Provide valid name/e_servidor (yup passes) but empty username
            // → validacoesPersonalizadas sets enviarFormulario=false on blur
            const usuarioSemUsername = { ...usuarioValido, username: '' };
            const { container } = renderComponent({ modo: Modos.INSERT }, { usuario: usuarioSemUsername });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome Teste'));

            // Blur name field → validacoesPersonalizadas called with empty username
            await act(async () => { fireEvent.blur(getNameInput(container)); });

            // Now submit — enviarFormulario=false, handleSubmitUsuarioForm returns early
            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            expect(mockCreateMutate).not.toHaveBeenCalled();
        });
    });

    // ── onClick nos campos limpa erros ────────────────────────────────────────
    describe('onClick nos campos: limpa erros', () => {
        it('click no select e_servidor não lança erro', async () => {
            renderComponent();
            await act(async () => { fireEvent.click(getSelect()); });
            expect(getSelect()).toBeInTheDocument();
        });

        it('click no input username não lança erro', async () => {
            renderComponent();
            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'True', name: 'e_servidor' } });
            });
            const usernameInput = screen.getByPlaceholderText(/Insira o RF do servidor/i);
            await act(async () => { fireEvent.click(usernameInput); });
            expect(usernameInput).toBeInTheDocument();
        });

        it('click no campo nome não lança erro', async () => {
            const { container } = renderComponent();
            await act(async () => { fireEvent.click(getNameInput(container)); });
            expect(getNameInput(container)).toBeInTheDocument();
        });
    });

    // ── Erros de validação Yup no submit ─────────────────────────────────────
    describe('erros de validação yup no submit', () => {
        it('exibe erro yup quando e_servidor não preenchido ao submeter', async () => {
            renderComponent({ modo: Modos.INSERT });
            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });
            await waitFor(() => {
                expect(screen.getByText('Tipo de usuário é obrigatório')).toBeInTheDocument();
            });
            expect(mockCreateMutate).not.toHaveBeenCalled();
        });

        it('exibe erro yup quando name não preenchido ao submeter', async () => {
            renderComponent({ modo: Modos.INSERT });
            await act(async () => {
                fireEvent.change(getSelect(), { target: { value: 'True', name: 'e_servidor' } });
            });
            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });
            await waitFor(() => {
                expect(screen.getByText('Nome de usuário é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro yup para email inválido', async () => {
            // Start with valid name/e_servidor but invalid email
            const usuario = { id: 1, e_servidor: true, username: '1234567', name: 'Nome', email: '' };
            const { container } = renderComponent({ modo: Modos.INSERT }, { usuario });
            await waitFor(() => expect(getNameInput(container)).toHaveValue('Nome'));

            // Set invalid email via change event
            const emailInput = getEmailInput();
            await act(async () => {
                fireEvent.change(emailInput, { target: { value: 'email-invalido', name: 'email' } });
            });
            await act(async () => { fireEvent.click(screen.getByText('Salvar')); });

            await waitFor(() => {
                expect(screen.getByText('Digite um email válido')).toBeInTheDocument();
            });
        });
    });
});
