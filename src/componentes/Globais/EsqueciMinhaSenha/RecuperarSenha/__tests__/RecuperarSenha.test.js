import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecuperarMinhaSenha } from '../index';

const yup = jest.requireActual('yup');
const schemaUsuario = yup.object().shape({
    usuario: yup.string().required('Usuário obrigatório'),
});

const mockOnSubmit = jest.fn();

const defaultProps = {
    initialValuesRecuperarSenha: { usuario: '' },
    onSubmitReuperarSenha: mockOnSubmit,
    YupSignupSchemaRecuperarSenha: schemaUsuario,
};

beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { assign: jest.fn() };
});

describe('RecuperarMinhaSenha', () => {
    describe('renderização inicial', () => {
        it('renderiza o título "Recuperação de Senha"', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByText('Recuperação de Senha')).toBeInTheDocument();
        });

        it('renderiza o campo de usuário', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
        });

        it('campo usuário inicia vazio', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByLabelText('Usuário')).toHaveValue('');
        });

        it('renderiza o botão Voltar', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
        });

        it('renderiza o botão Cancelar', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
        });

        it('renderiza o botão Continuar', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByRole('button', { name: 'Continuar' })).toBeInTheDocument();
        });

        it('renderiza o texto de instrução sobre RF/CPF', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByText(/RF para servidor ou CPF para demais membros/i)).toBeInTheDocument();
        });

        it('renderiza o texto sobre e-mail não cadastrado', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByText(/Caso você não tenha um e-mail cadastrado/i)).toBeInTheDocument();
        });

        it('não exibe mensagem de erro inicialmente', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.queryByText('Usuário obrigatório')).not.toBeInTheDocument();
        });
    });

    describe('botão Continuar', () => {
        it('está desabilitado quando o campo usuário está vazio', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();
        });

        it('fica habilitado ao preencher o campo usuário', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '1234567' } });
            });
            expect(screen.getByRole('button', { name: 'Continuar' })).not.toBeDisabled();
        });

        it('volta a ficar desabilitado ao limpar o campo usuário', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '1234567' } });
            });
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '' } });
            });
            expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();
        });
    });

    describe('botão Voltar', () => {
        it('navega para /login ao clicar em Voltar', () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
            expect(window.location.assign).toHaveBeenCalledWith('/login');
        });
    });

    describe('botão Cancelar', () => {
        it('limpa o campo usuário ao clicar em Cancelar', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '9876543' } });
            });
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
            });
            await waitFor(() => {
                expect(screen.getByLabelText('Usuário')).toHaveValue('');
            });
        });
    });

    describe('validação', () => {
        it('exibe erro de validação ao submeter com campo vazio', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.blur(screen.getByLabelText('Usuário'));
            });
            await waitFor(() => {
                expect(screen.getByText('Usuário obrigatório')).toBeInTheDocument();
            });
        });

        it('não exibe erro quando o campo está preenchido', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '1234567' } });
                fireEvent.blur(screen.getByLabelText('Usuário'));
            });
            await waitFor(() => {
                expect(screen.queryByText('Usuário obrigatório')).not.toBeInTheDocument();
            });
        });
    });

    describe('submissão', () => {
        it('chama onSubmitReuperarSenha com os valores corretos', async () => {
            mockOnSubmit.mockImplementation(async () => {});
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: '1234567' } });
            });
            await act(async () => {
                fireEvent.submit(screen.getByLabelText('Usuário').closest('form'));
            });
            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    { usuario: '1234567' },
                    expect.any(Object)
                );
            });
        });

        it('não chama onSubmitReuperarSenha com campo vazio', async () => {
            render(<RecuperarMinhaSenha {...defaultProps} />);
            await act(async () => {
                fireEvent.submit(screen.getByLabelText('Usuário').closest('form'));
            });
            await waitFor(() => {
                expect(mockOnSubmit).not.toHaveBeenCalled();
            });
        });
    });

    describe('initialValues externo', () => {
        it('pré-preenche o campo quando initialValues contém usuário', async () => {
            render(
                <RecuperarMinhaSenha
                    {...defaultProps}
                    initialValuesRecuperarSenha={{ usuario: '9999999' }}
                />
            );
            await waitFor(() => {
                expect(screen.getByLabelText('Usuário')).toHaveValue('9999999');
            });
        });

        it('botão Continuar fica habilitado quando initialValues já tem usuário', async () => {
            render(
                <RecuperarMinhaSenha
                    {...defaultProps}
                    initialValuesRecuperarSenha={{ usuario: '9999999' }}
                />
            );
            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Continuar' })).not.toBeDisabled();
            });
        });
    });
});
