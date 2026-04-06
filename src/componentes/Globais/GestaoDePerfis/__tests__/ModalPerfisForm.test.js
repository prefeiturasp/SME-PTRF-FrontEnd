import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ModalPerfisForm } from '../ModalPerfisForm';
import { visoesService } from '../../../../services/visoes.service';
import { getConsultarUsuario } from '../../../../services/GestaoDePerfis.service';

// ── Mocks ──────────────────────────────────────────────────────────────────────
jest.mock('../../ModalBootstrap', () => ({
    ModalBootstrapFormPerfis: ({ show, titulo, bodyText }) =>
        show ? (
            <div data-testid="modal-perfis-form">
                <div data-testid="modal-titulo">{titulo}</div>
                <div data-testid="modal-body">{bodyText}</div>
            </div>
        ) : null,
}));

jest.mock('../../../../services/visoes.service', () => ({
    visoesService: { getItemUsuarioLogado: jest.fn() },
}));

jest.mock('../../../../services/GestaoDePerfis.service', () => ({
    getConsultarUsuario: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="icon-trash" />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faTrash: 'faTrash',
}));

// ── Test data ──────────────────────────────────────────────────────────────────
const DEFAULT_GRUPOS = [
    { id: 1, nome: 'Grupo SME' },
    { id: 2, nome: 'Grupo DRE' },
];

const makeStatePerfisForm = (overrides = {}) => ({
    tipo_usuario: '',
    nome_usuario: '',
    nome_completo: '',
    email: '',
    grupo_acesso: [],
    ...overrides,
});

// ── Helpers ────────────────────────────────────────────────────────────────────
const renderComponent = (overrides = {}) => {
    const props = {
        show: true,
        handleClose: jest.fn(),
        statePerfisForm: makeStatePerfisForm(),
        setStatePerfisForm: jest.fn(),
        handleChange: jest.fn(),
        setShowModalDeletePerfil: jest.fn(),
        grupos: DEFAULT_GRUPOS,
        onSubmit: jest.fn(),
        ...overrides,
    };
    const result = render(<ModalPerfisForm {...props} />);
    return { props, ...result };
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('<ModalPerfisForm>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default safe mock: rejects with a properly shaped error so the
        // catch block in validateFormPerfis never throws a secondary exception.
        getConsultarUsuario.mockRejectedValue({
            response: { data: { detail: 'Usuário não encontrado (padrão)' } },
        });
    });

    // ── Renderização básica ────────────────────────────────────────────────────
    describe('Renderização básica', () => {
        it('não renderiza nada quando show=false', () => {
            renderComponent({ show: false });
            expect(screen.queryByTestId('modal-perfis-form')).not.toBeInTheDocument();
        });

        it('renderiza o modal quando show=true', () => {
            renderComponent();
            expect(screen.getByTestId('modal-perfis-form')).toBeInTheDocument();
        });

        it('exibe título "Adicionar perfil" quando statePerfisForm não tem id', () => {
            renderComponent();
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Adicionar perfil');
        });

        it('exibe título "Editar perfil" quando statePerfisForm tem id', () => {
            renderComponent({ statePerfisForm: makeStatePerfisForm({ id: 42 }) });
            expect(screen.getByTestId('modal-titulo')).toHaveTextContent('Editar perfil');
        });

        it('exibe botão "Adicionar" quando não há id', () => {
            renderComponent();
            expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();
        });

        it('exibe botão "Salvar" quando há id', () => {
            renderComponent({ statePerfisForm: makeStatePerfisForm({ id: 42 }) });
            expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
        });

        it('não exibe botão "Excluir perfil" quando não há id', () => {
            renderComponent();
            expect(screen.queryByText(/Excluir perfil/i)).not.toBeInTheDocument();
        });

        it('exibe botão "Excluir perfil" quando há id', () => {
            renderComponent({ statePerfisForm: makeStatePerfisForm({ id: 42 }) });
            expect(screen.getByText(/Excluir perfil/i)).toBeInTheDocument();
        });

        it('renderiza as opções de grupo de acesso', () => {
            renderComponent();
            expect(screen.getByText('Grupo SME')).toBeInTheDocument();
            expect(screen.getByText('Grupo DRE')).toBeInTheDocument();
        });

        it('não renderiza opções de grupo quando grupos é array vazio', () => {
            renderComponent({ grupos: [] });
            expect(screen.queryByText('Grupo SME')).not.toBeInTheDocument();
        });

        it('não renderiza opções de grupo quando grupos é undefined', () => {
            renderComponent({ grupos: undefined });
            expect(screen.queryByText('Grupo SME')).not.toBeInTheDocument();
        });

        it('campo nome_usuario está habilitado quando não há id', () => {
            renderComponent();
            expect(screen.getByPlaceholderText('Insira o nome de usuário')).not.toBeDisabled();
        });

        it('campo nome_usuario está desabilitado quando há id', () => {
            renderComponent({ statePerfisForm: makeStatePerfisForm({ id: 42 }) });
            expect(screen.getByPlaceholderText('Insira o nome de usuário')).toBeDisabled();
        });

        it('renderiza campos nome_completo e email como somente leitura', () => {
            renderComponent();
            const inputs = screen.getAllByRole('textbox');
            const nomeCompleto = inputs.find(i => i.getAttribute('name') === 'nome_completo');
            const email = inputs.find(i => i.getAttribute('name') === 'email');
            expect(nomeCompleto).toHaveAttribute('readonly');
            expect(email).toHaveAttribute('readonly');
        });

        it('exibe valores do statePerfisForm nos campos', () => {
            renderComponent({
                statePerfisForm: makeStatePerfisForm({
                    nome_usuario: 'usuario_test',
                    nome_completo: 'Nome Completo Test',
                    email: 'test@email.com',
                }),
            });
            expect(screen.getByPlaceholderText('Insira o nome de usuário')).toHaveValue('usuario_test');
            const inputs = screen.getAllByRole('textbox');
            expect(inputs.find(i => i.getAttribute('name') === 'nome_completo')).toHaveValue(
                'Nome Completo Test'
            );
        });
    });

    // ── Interações de botão ────────────────────────────────────────────────────
    describe('Interações de botão', () => {
        it('chama handleClose ao clicar em "Cancelar"', () => {
            const { props } = renderComponent();
            fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
            expect(props.handleClose).toHaveBeenCalledTimes(1);
        });

        it('chama setShowModalDeletePerfil(true) ao clicar em "Excluir perfil"', () => {
            const { props } = renderComponent({ statePerfisForm: makeStatePerfisForm({ id: 42 }) });
            fireEvent.click(screen.getByText(/Excluir perfil/i));
            expect(props.setShowModalDeletePerfil).toHaveBeenCalledWith(true);
        });
    });

    // ── Mudanças de campos ─────────────────────────────────────────────────────
    describe('Mudanças de campos (handleChange)', () => {
        it('chama handleChange ao alterar tipo_usuario', async () => {
            const { props } = renderComponent();
            const select = screen.getByRole('combobox');
            await act(async () => {
                fireEvent.change(select, { target: { name: 'tipo_usuario', value: 'SERVIDOR' } });
            });
            expect(props.handleChange).toHaveBeenCalledWith('tipo_usuario', 'SERVIDOR');
        });

        it('chama handleChange ao alterar nome_usuario', async () => {
            const { props } = renderComponent();
            const input = screen.getByPlaceholderText('Insira o nome de usuário');
            await act(async () => {
                fireEvent.change(input, { target: { name: 'nome_usuario', value: 'meuusuario' } });
            });
            expect(props.handleChange).toHaveBeenCalledWith('nome_usuario', 'meuusuario');
        });

        it('chama handleChange ao alterar nome_completo', async () => {
            const { props } = renderComponent();
            const inputs = screen.getAllByRole('textbox');
            const nomeCompletoInput = inputs.find(i => i.getAttribute('name') === 'nome_completo');
            await act(async () => {
                fireEvent.change(nomeCompletoInput, {
                    target: { name: 'nome_completo', value: 'Nome Teste' },
                });
            });
            expect(props.handleChange).toHaveBeenCalledWith('nome_completo', 'Nome Teste');
        });

        it('chama handleChange ao alterar email', async () => {
            const { props } = renderComponent();
            const inputs = screen.getAllByRole('textbox');
            const emailInput = inputs.find(i => i.getAttribute('name') === 'email');
            await act(async () => {
                fireEvent.change(emailInput, {
                    target: { name: 'email', value: 'email@test.com' },
                });
            });
            expect(props.handleChange).toHaveBeenCalledWith('email', 'email@test.com');
        });
    });

    // ── validateFormPerfis ─────────────────────────────────────────────────────
    describe('validateFormPerfis', () => {
        // Helper: trigger Formik's validate by changing a field value.
        // We change nome_usuario to a known value and await the async cycle.
        const triggerValidateWithNome = async (container, value) => {
            const input = screen.getByPlaceholderText('Insira o nome de usuário');
            await act(async () => {
                fireEvent.change(input, { target: { name: 'nome_usuario', value } });
            });
        };

        it('não chama getConsultarUsuario quando nome_usuario está vazio', async () => {
            const { container } = renderComponent({
                statePerfisForm: makeStatePerfisForm({ nome_usuario: '' }),
            });
            // Trigger validate with empty nome_usuario by changing tipo_usuario
            await act(async () => {
                const select = screen.getByRole('combobox');
                fireEvent.change(select, { target: { name: 'tipo_usuario', value: 'SERVIDOR' } });
            });
            expect(getConsultarUsuario).not.toHaveBeenCalled();
        });

        it('não chama getConsultarUsuario quando nome_usuario tem apenas espaços', async () => {
            renderComponent({ statePerfisForm: makeStatePerfisForm({ nome_usuario: '   ' }) });
            await act(async () => {
                const select = screen.getByRole('combobox');
                fireEvent.change(select, { target: { name: 'tipo_usuario', value: 'SERVIDOR' } });
            });
            expect(getConsultarUsuario).not.toHaveBeenCalled();
        });

        it('chama getConsultarUsuario com visao_selecionada e nome_usuario trim', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockResolvedValue({
                status: 200,
                data: { nome: 'Full Name', email: 'full@email.com' },
            });
            const { container } = renderComponent();

            await triggerValidateWithNome(container, ' testuser ');

            await waitFor(() => {
                expect(getConsultarUsuario).toHaveBeenCalledWith('SME', 'testuser');
            });
        });

        it('chama setStatePerfisForm com nome e email ao receber status 200', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockResolvedValue({
                status: 200,
                data: { nome: 'Full Name', email: 'full@email.com' },
            });
            const { props, container } = renderComponent();

            await triggerValidateWithNome(container, 'testuser');

            await waitFor(() => {
                expect(props.setStatePerfisForm).toHaveBeenCalledWith(
                    expect.objectContaining({
                        nome_completo: 'Full Name',
                        email: 'full@email.com',
                        nome_usuario: 'testuser',
                    })
                );
            });
        });

        it('chama setStatePerfisForm com dados do usuário ao receber status 201', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
            getConsultarUsuario.mockResolvedValue({
                status: 201,
                data: { nome: 'Created User', email: 'created@email.com' },
            });
            const { props, container } = renderComponent();

            await triggerValidateWithNome(container, 'newuser');

            await waitFor(() => {
                expect(props.setStatePerfisForm).toHaveBeenCalledWith(
                    expect.objectContaining({
                        nome_completo: 'Created User',
                        email: 'created@email.com',
                    })
                );
            });
        });

        it('exibe data.detail como erro de nome_usuario quando a requisição falha', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockRejectedValue({
                response: { data: { detail: 'Usuário não encontrado na base' } },
            });
            const { container } = renderComponent();

            await triggerValidateWithNome(container, 'invalido');

            await waitFor(() => {
                expect(screen.getByText('Usuário não encontrado na base')).toBeInTheDocument();
            });
        });

        it('exibe erro genérico quando exceção não possui data.detail', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockRejectedValue({
                response: { data: {} },
            });
            const { container } = renderComponent();

            await triggerValidateWithNome(container, 'invalido');

            await waitFor(() => {
                expect(screen.getByText('Nome de usuário inválido')).toBeInTheDocument();
            });
        });

        it('não chama setStatePerfisForm quando status não é 200 nem 201', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockResolvedValue({
                status: 204,
                data: { nome: 'Alguém', email: 'x@y.com' },
            });
            const { props, container } = renderComponent();

            await triggerValidateWithNome(container, 'testuser');

            await waitFor(() => {
                expect(getConsultarUsuario).toHaveBeenCalled();
            });
            expect(props.setStatePerfisForm).not.toHaveBeenCalled();
        });
    });

    // ── Validações Yup ─────────────────────────────────────────────────────────
    describe('Validações Yup', () => {
        it('exibe erro de tipo_usuario ao submeter sem preenchê-lo', async () => {
            // nome_usuario and grupo_acesso provided so only tipo_usuario fails Yup
            renderComponent({
                statePerfisForm: makeStatePerfisForm({ nome_usuario: 'user', grupo_acesso: ['1'] }),
            });

            await act(async () => {
                fireEvent.submit(
                    screen.getByRole('button', { name: /Adicionar/i }).closest('form')
                );
            });

            await waitFor(() => {
                expect(screen.getByText('Tipo de usuário é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro de nome_usuario ao submeter sem preenchê-lo', async () => {
            renderComponent({
                statePerfisForm: makeStatePerfisForm({ tipo_usuario: 'SERVIDOR', grupo_acesso: ['1'] }),
            });

            await act(async () => {
                fireEvent.submit(
                    screen.getByRole('button', { name: /Adicionar/i }).closest('form')
                );
            });

            await waitFor(() => {
                expect(screen.getByText('Nome de usuário é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro de grupo_acesso ao submeter sem selecionar grupo', async () => {
            // nome_usuario provided so validateFormPerfis is called — default mock rejects safely
            renderComponent({
                statePerfisForm: makeStatePerfisForm({ tipo_usuario: 'SERVIDOR', nome_usuario: 'user' }),
            });

            await act(async () => {
                fireEvent.submit(
                    screen.getByRole('button', { name: /Adicionar/i }).closest('form')
                );
            });

            await waitFor(() => {
                expect(screen.getByText('Grupo de acesso é obrigatório')).toBeInTheDocument();
            });
        });
    });

    // ── Submissão do formulário ────────────────────────────────────────────────
    describe('Submissão do formulário', () => {
        it('chama onSubmit ao submeter formulário com dados válidos', async () => {
            visoesService.getItemUsuarioLogado.mockReturnValue('SME');
            getConsultarUsuario.mockResolvedValue({
                status: 200,
                data: { nome: 'Full Name', email: 'full@email.com' },
            });
            const { props } = renderComponent({
                statePerfisForm: makeStatePerfisForm({
                    tipo_usuario: 'SERVIDOR',
                    nome_usuario: 'testuser',
                    grupo_acesso: ['1'],
                }),
            });

            await act(async () => {
                fireEvent.submit(
                    screen.getByRole('button', { name: /Adicionar/i }).closest('form')
                );
            });

            await waitFor(() => {
                expect(props.onSubmit).toHaveBeenCalled();
            });
        });

        it('não chama onSubmit quando o formulário é inválido (campos vazios)', async () => {
            const { props } = renderComponent({
                statePerfisForm: makeStatePerfisForm(),
            });

            await act(async () => {
                fireEvent.submit(
                    screen.getByRole('button', { name: /Adicionar/i }).closest('form')
                );
            });

            await waitFor(() => {
                expect(screen.getByText('Tipo de usuário é obrigatório')).toBeInTheDocument();
            });
            expect(props.onSubmit).not.toHaveBeenCalled();
        });
    });
});
