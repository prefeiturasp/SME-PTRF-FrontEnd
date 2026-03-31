import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormAlterarEmail } from '../index';

jest.mock('../../../../services/auth.service', () => ({
    alterarMeuEmail: jest.fn(),
    USUARIO_EMAIL: 'EMAIL',
    USUARIO_LOGIN: 'LOGIN',
}));

jest.mock('../../../../utils/ValidacoesAdicionaisFormularios', () => {
    const yup = jest.requireActual('yup');
    return {
        YupSignupSchemaAlterarEmail: yup.object().shape({
            email: yup.string().email('Email inválido').required('Email obrigatório'),
            confirmacao_email: yup.string().email('Email inválido').required('Confirmação obrigatória'),
        }),
    };
});

const { alterarMeuEmail } = jest.requireMock('../../../../services/auth.service');

const mockHandleClose = jest.fn();

// Nota: os labels têm htmlFor que não corresponde aos ids dos inputs (bug no source),
// por isso usamos queries por name em vez de getByLabelText.
const getEmailInput = (container) => container.querySelector('input[name="email"]');
const getConfirmacaoInput = (container) => container.querySelector('input[name="confirmacao_email"]');
const getContinuarBtn = () => screen.getByRole('button', { name: 'Continuar' });
const getSairBtn = () => screen.getByRole('button', { name: 'Sair' });

const fillAndSubmit = async (container, email, confirmacao) => {
    await act(async () => {
        fireEvent.change(getEmailInput(container), { target: { value: email } });
        fireEvent.change(getConfirmacaoInput(container), { target: { value: confirmacao } });
    });
    await act(async () => {
        fireEvent.submit(getEmailInput(container).closest('form'));
    });
};

describe('FormAlterarEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        localStorage.setItem('LOGIN', 'usuario-teste');
    });

    describe('renderização inicial', () => {
        it('renderiza o campo de email', () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getEmailInput(container)).toBeInTheDocument();
        });

        it('renderiza o campo de confirmação de email', () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getConfirmacaoInput(container)).toBeInTheDocument();
        });

        it('renderiza o botão Sair', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getSairBtn()).toBeInTheDocument();
        });

        it('renderiza o botão Continuar', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getContinuarBtn()).toBeInTheDocument();
        });

        it('os campos iniciam vazios', () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getEmailInput(container)).toHaveValue('');
            expect(getConfirmacaoInput(container)).toHaveValue('');
        });

        it('não exibe alerta de sucesso inicialmente', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(screen.queryByText('Email alterado com sucesso.')).not.toBeInTheDocument();
        });

        it('não exibe alerta de erro inicialmente', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('o campo email tem type="email"', () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getEmailInput(container)).toHaveAttribute('type', 'email');
        });

        it('o campo confirmação tem type="email"', () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getConfirmacaoInput(container)).toHaveAttribute('type', 'email');
        });

        it('exibe os labels de email e confirmação', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('Confirmação do Email')).toBeInTheDocument();
        });
    });

    describe('botão Continuar — estado desabilitado', () => {
        it('está desabilitado quando os campos estão vazios', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            expect(getContinuarBtn()).toBeDisabled();
        });

        it('está desabilitado quando apenas email está preenchido', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getEmailInput(container), { target: { value: 'teste@email.com' } });
            });
            expect(getContinuarBtn()).toBeDisabled();
        });

        it('está desabilitado quando apenas confirmação está preenchida', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getConfirmacaoInput(container), { target: { value: 'teste@email.com' } });
            });
            expect(getContinuarBtn()).toBeDisabled();
        });

        it('está habilitado quando ambos os campos são emails válidos', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getEmailInput(container), { target: { value: 'teste@email.com' } });
                fireEvent.change(getConfirmacaoInput(container), { target: { value: 'teste@email.com' } });
            });
            await waitFor(() => {
                expect(getContinuarBtn()).not.toBeDisabled();
            });
        });
    });

    describe('botão Sair', () => {
        it('chama handleClose ao clicar em Sair', () => {
            render(<FormAlterarEmail handleClose={mockHandleClose} />);
            fireEvent.click(getSairBtn());
            expect(mockHandleClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('validação de campos', () => {
        it('exibe erro quando email é inválido e perde o foco', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getEmailInput(container), { target: { value: 'invalido' } });
                fireEvent.blur(getEmailInput(container));
            });
            await waitFor(() => {
                expect(screen.getAllByText(/Email inválido/i).length).toBeGreaterThan(0);
            });
        });

        it('exibe erro quando confirmação é inválida e perde o foco', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getConfirmacaoInput(container), { target: { value: 'invalido' } });
                fireEvent.blur(getConfirmacaoInput(container));
            });
            await waitFor(() => {
                expect(screen.getAllByText(/Email inválido/i).length).toBeGreaterThan(0);
            });
        });

        it('não exibe erro quando email é válido', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getEmailInput(container), { target: { value: 'valido@email.com' } });
                fireEvent.blur(getEmailInput(container));
            });
            await waitFor(() => {
                expect(screen.queryByText(/Email inválido/i)).not.toBeInTheDocument();
            });
        });

        it('botão Continuar fica desabilitado quando há erro de validação no email', async () => {
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);
            await act(async () => {
                fireEvent.change(getEmailInput(container), { target: { value: 'invalido' } });
                fireEvent.blur(getEmailInput(container));
                fireEvent.change(getConfirmacaoInput(container), { target: { value: 'valido@email.com' } });
            });
            await waitFor(() => {
                expect(getContinuarBtn()).toBeDisabled();
            });
        });
    });

    describe('submissão com sucesso', () => {
        it('chama alterarMeuEmail com o login e payload corretos', async () => {
            alterarMeuEmail.mockResolvedValue({ data: { email: 'novo@email.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'novo@email.com', 'novo@email.com');

            await waitFor(() => {
                expect(alterarMeuEmail).toHaveBeenCalledWith('usuario-teste', {
                    email: 'novo@email.com',
                    email2: 'novo@email.com',
                });
            });
        });

        it('salva o email retornado no localStorage', async () => {
            alterarMeuEmail.mockResolvedValue({ data: { email: 'novo@email.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'novo@email.com', 'novo@email.com');

            await waitFor(() => {
                expect(localStorage.getItem('EMAIL')).toBe('novo@email.com');
            });
        });

        it('exibe alerta de sucesso após submissão bem-sucedida', async () => {
            alterarMeuEmail.mockResolvedValue({ data: { email: 'novo@email.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'novo@email.com', 'novo@email.com');

            await waitFor(() => {
                expect(screen.getByText('Email alterado com sucesso.')).toBeInTheDocument();
            });
        });

        it('desabilita o botão Continuar após sucesso', async () => {
            alterarMeuEmail.mockResolvedValue({ data: { email: 'novo@email.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'novo@email.com', 'novo@email.com');

            await waitFor(() => {
                expect(getContinuarBtn()).toBeDisabled();
            });
        });

        it('não exibe alerta de erro após sucesso', async () => {
            alterarMeuEmail.mockResolvedValue({ data: { email: 'novo@email.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'novo@email.com', 'novo@email.com');

            await waitFor(() => {
                expect(screen.queryByText('Email já cadastrado.')).not.toBeInTheDocument();
            });
        });

        it('usa o login do localStorage ao chamar o serviço', async () => {
            localStorage.setItem('LOGIN', 'outro-usuario');
            alterarMeuEmail.mockResolvedValue({ data: { email: 'x@x.com' } });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'x@x.com', 'x@x.com');

            await waitFor(() => {
                expect(alterarMeuEmail).toHaveBeenCalledWith('outro-usuario', expect.any(Object));
            });
        });
    });

    describe('submissão com erro', () => {
        it('exibe a mensagem de erro retornada pelo serviço', async () => {
            alterarMeuEmail.mockRejectedValue({
                response: { data: { detail: 'Email já cadastrado.' } },
            });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'existente@email.com', 'existente@email.com');

            await waitFor(() => {
                expect(screen.getByText('Email já cadastrado.')).toBeInTheDocument();
            });
        });

        it('não exibe alerta de sucesso quando ocorre erro', async () => {
            alterarMeuEmail.mockRejectedValue({
                response: { data: { detail: 'Erro qualquer.' } },
            });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'existente@email.com', 'existente@email.com');

            await waitFor(() => {
                expect(screen.queryByText('Email alterado com sucesso.')).not.toBeInTheDocument();
            });
        });

        it('desabilita o botão Continuar quando existe mensagem de erro', async () => {
            alterarMeuEmail.mockRejectedValue({
                response: { data: { detail: 'Erro qualquer.' } },
            });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'existente@email.com', 'existente@email.com');

            await waitFor(() => {
                expect(getContinuarBtn()).toBeDisabled();
            });
        });

        it('não salva email no localStorage quando ocorre erro', async () => {
            alterarMeuEmail.mockRejectedValue({
                response: { data: { detail: 'Erro qualquer.' } },
            });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'existente@email.com', 'existente@email.com');

            await waitFor(() => {
                expect(localStorage.getItem('EMAIL')).toBeNull();
            });
        });

        it('exibe o alerta de erro com a mensagem dentro de um parágrafo', async () => {
            alterarMeuEmail.mockRejectedValue({
                response: { data: { detail: 'Mensagem de erro específica.' } },
            });
            const { container } = render(<FormAlterarEmail handleClose={mockHandleClose} />);

            await fillAndSubmit(container, 'existente@email.com', 'existente@email.com');

            await waitFor(() => {
                const p = screen.getByText('Mensagem de erro específica.');
                expect(p.tagName).toBe('P');
            });
        });
    });
});
