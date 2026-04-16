import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BotaoRetificarPaa } from '../components/BotaoRetificarPaa/BotaoRetificarPaa';
import { usePostIniciarRetificacaoPaa } from '../../componentes/hooks/usePostIniciarRetificacaoPaa';
import { toastCustom } from '../../../../Globais/ToastCustom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

jest.mock('../../componentes/hooks/usePostIniciarRetificacaoPaa');

let capturedModalProps = null;
jest.mock('../components/ModalRetificarPaa/ModalRetificarPaa', () => ({
    ModalRetificarPAA: (props) => {
        capturedModalProps = props;
        if (!props.open) return null;
        return (
            <div data-testid="modal-retificar">
                <button data-testid="modal-confirmar" onClick={() => props.onConfirm('justificativa teste')}>
                    Confirmar
                </button>
                <button data-testid="modal-fechar" onClick={props.onClose}>
                    Fechar
                </button>
            </div>
        );
    },
}));

jest.mock('antd', () => ({
    Spin: ({ children }) => <div>{children}</div>,
}));

const mockMutateAsync = jest.fn();

const defaultPaa = { uuid: 'paa-uuid-123', status: 'PUBLICADO' };
const defaultStatusDocumento = { mensagem: 'Documento válido' };

const renderComponent = (paa = defaultPaa, statusDocumento = defaultStatusDocumento) => {
    return render(<BotaoRetificarPaa paa={paa} statusDocumento={statusDocumento} />);
};

describe('BotaoRetificarPaa', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedModalProps = null;
        usePostIniciarRetificacaoPaa.mockReturnValue({
            mutationPost: { mutateAsync: mockMutateAsync },
        });
    });

    it('deve renderizar o botão "Retificar o PAA"', () => {
        renderComponent();
        expect(screen.getByRole('button', { name: /retificar o paa/i })).toBeInTheDocument();
    });

    it('não deve exibir o modal inicialmente', () => {
        renderComponent();
        expect(screen.queryByTestId('modal-retificar')).not.toBeInTheDocument();
    });

    it('deve abrir o modal ao clicar no botão quando status não é EM_RETIFICACAO', () => {
        renderComponent();
        fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
        expect(screen.getByTestId('modal-retificar')).toBeInTheDocument();
    });

    it('deve navegar diretamente quando status é EM_RETIFICACAO, sem abrir modal', () => {
        const paaEmRetificacao = { uuid: 'paa-uuid-123', status: 'EM_RETIFICACAO' };
        renderComponent(paaEmRetificacao);

        fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/retificacao-paa/paa-uuid-123', {
            state: { origem: 'paa-vigente-e-anteriores' },
        });
        expect(screen.queryByTestId('modal-retificar')).not.toBeInTheDocument();
    });

    it('deve fechar o modal ao chamar onClose', () => {
        renderComponent();
        fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
        expect(screen.getByTestId('modal-retificar')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('modal-fechar'));
        expect(screen.queryByTestId('modal-retificar')).not.toBeInTheDocument();
    });

    it('deve passar as props corretas para o ModalRetificarPAA', () => {
        renderComponent();
        fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));

        expect(capturedModalProps.open).toBe(true);
        expect(capturedModalProps.paaData).toBe(defaultPaa);
        expect(capturedModalProps.statusDocumento).toBe(defaultStatusDocumento);
        expect(typeof capturedModalProps.onClose).toBe('function');
        expect(typeof capturedModalProps.onConfirm).toBe('function');
    });

    describe('handleRetificarPaa — sucesso', () => {
        it('deve chamar mutateAsync com uuid e payload corretos', async () => {
            mockMutateAsync.mockResolvedValueOnce({ data: { mensagem: 'Retificação iniciada!' } });
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(mockMutateAsync).toHaveBeenCalledWith({
                paaUuid: 'paa-uuid-123',
                payload: { justificativa: 'justificativa teste' },
            });
        });

        it('deve exibir toast de sucesso com mensagem da resposta', async () => {
            mockMutateAsync.mockResolvedValueOnce({ data: { mensagem: 'Retificação iniciada!' } });
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Retificação',
                'Retificação iniciada!'
            );
        });

        it('deve exibir toast de sucesso com mensagem padrão quando response não traz mensagem', async () => {
            mockMutateAsync.mockResolvedValueOnce({});
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Retificação',
                'Retificação iniciada com sucesso!'
            );
        });

        it('deve fechar o modal após sucesso', async () => {
            mockMutateAsync.mockResolvedValueOnce({ data: { mensagem: 'Ok' } });
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(screen.queryByTestId('modal-retificar')).not.toBeInTheDocument();
        });

        it('deve navegar para a tela de retificação após sucesso', async () => {
            mockMutateAsync.mockResolvedValueOnce({ data: {} });
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(mockNavigate).toHaveBeenCalledWith('/retificacao-paa/paa-uuid-123', {
                state: { origem: 'paa-vigente-e-anteriores' },
            });
        });
    });

    describe('handleRetificarPaa — erro', () => {
        it('deve exibir toast de erro com mensagem da resposta', async () => {
            const error = { response: { data: { mensagem: 'PAA não encontrado' } } };
            mockMutateAsync.mockRejectedValueOnce(error);
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Retificação',
                'PAA não encontrado'
            );
        });

        it('deve exibir toast de erro com mensagem padrão quando error não traz mensagem', async () => {
            mockMutateAsync.mockRejectedValueOnce(new Error('Network error'));
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Retificação',
                'Falha ao iniciar retificação do PAA!'
            );
        });

        it('não deve navegar em caso de erro', async () => {
            mockMutateAsync.mockRejectedValueOnce(new Error('fail'));
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('não deve fechar o modal em caso de erro', async () => {
            mockMutateAsync.mockRejectedValueOnce(new Error('fail'));
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(screen.getByTestId('modal-retificar')).toBeInTheDocument();
        });
    });

    describe('isLoading', () => {
        it('deve passar isLoading=false ao modal antes de confirmar', () => {
            renderComponent();
            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            expect(capturedModalProps.isLoading).toBe(false);
        });

        it('deve resetar isLoading para false após sucesso', async () => {
            mockMutateAsync.mockResolvedValueOnce({ data: {} });
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(capturedModalProps.isLoading).toBe(false);
        });

        it('deve resetar isLoading para false após erro', async () => {
            mockMutateAsync.mockRejectedValueOnce(new Error('fail'));
            renderComponent();

            fireEvent.click(screen.getByRole('button', { name: /retificar o paa/i }));
            await act(async () => {
                fireEvent.click(screen.getByTestId('modal-confirmar'));
            });

            expect(capturedModalProps.isLoading).toBe(false);
        });
    });
});
