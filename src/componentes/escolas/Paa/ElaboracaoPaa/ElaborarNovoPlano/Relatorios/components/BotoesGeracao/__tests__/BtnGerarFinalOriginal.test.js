import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnGerarFinalOriginal } from '../BtnGerarFinalOriginal';
import { visoesService } from '../../../../../../../../../services/visoes.service';

// variáveis de controle dos mocks
const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();
const mockIniciarPolling = jest.fn();
const mockToastError = jest.fn();

let mockStatusDocumento = undefined;
let mockIsLoading = false;
let mockIsPending = false;
let capturedOnError;
let capturedOnSuccess;
let capturedOnConcluidoFinal;

// mocks de módulos
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../../../../../services/visoes.service', () => ({
    visoesService: {
        getPermissoes: jest.fn(() => true),
    },
}));

jest.mock('../../../../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomError: (...args) => mockToastError(...args),
    },
}));

jest.mock('../../../hooks/usePollingStatusDocumento', () => ({
    usePollingStatusDocumento: ({ paaUuid, onConcluidoFinal }) => {
        capturedOnConcluidoFinal = onConcluidoFinal;
        return {
            statusDocumento: mockStatusDocumento,
            isLoadingStatusDocumento: mockIsLoading,
            iniciarPolling: mockIniciarPolling,
        };
    },
}));

jest.mock('../../../hooks/usePostPaaGeracaoDocumento', () => ({
    usePostPaaGeracaoDocumentoFinal: ({ onSuccessGerarDocumento, onErrorGerarDocumento }) => {
        capturedOnError = onErrorGerarDocumento;
        capturedOnSuccess = onSuccessGerarDocumento;
        return { mutateAsync: mockMutateAsync, isPending: mockIsPending };
    },
}));

jest.mock('../../../ModalInfoGeracaoDocumento', () => ({
    ModalConfirmaGeracaoFinal: ({ open, onClose, onConfirm }) =>
        open ? (
            <div data-testid="modal-confirmar-final">
                <button onClick={onClose} data-testid="btn-cancelar-confirmar">
                    Cancelar
                </button>
                <button onClick={onConfirm} data-testid="btn-confirmar-geracao">
                    Continuar
                </button>
            </div>
        ) : null,
    ModalInfoPendenciasGeracaoFinal: ({ open, onClose, pendencias }) =>
        open ? (
            <div data-testid="modal-pendencias-final">
                <span data-testid="texto-pendencias">{pendencias}</span>
                <button onClick={onClose} data-testid="btn-fechar-pendencias">
                    Ok
                </button>
            </div>
        ) : null,
}));

// dados padrão
const DEFAULT_PAA = { uuid: 'uuid-final-orig-789', status: 'EM_ELABORACAO' };

describe('BtnGerarFinalOriginal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getPermissoes.mockReturnValue(true);
        mockStatusDocumento = undefined;
        mockIsLoading = false;
        mockIsPending = false;
        capturedOnError = undefined;
        capturedOnSuccess = undefined;
        capturedOnConcluidoFinal = undefined;
        mockMutateAsync.mockResolvedValue({});
    });

    // renderização
    it('renderiza o botão com texto "Gerar"', () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeInTheDocument();
    });

    it('botão tem o título correto', () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toHaveAttribute(
            'title',
            'Gerar documento PAA final'
        );
    });

    it('botão está habilitado no estado padrão', () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).not.toBeDisabled();
    });

    // estados desabilitados
    it('botão fica desabilitado quando sem permissão (podeEditar=false)', () => {
        visoesService.getPermissoes.mockReturnValue(false);
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status é EM_PROCESSAMENTO', () => {
        mockStatusDocumento = { status: 'EM_PROCESSAMENTO' };
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status=CONCLUIDO e versao=FINAL', () => {
        mockStatusDocumento = { status: 'CONCLUIDO', versao: 'FINAL' };
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando isLoadingStatusDocumento=true', () => {
        mockIsLoading = true;
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando mutação está pendente', () => {
        mockIsPending = true;
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    // interações de clique
    it('clicar no botão chama mutateAsync com confirmar=0', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Gerar' }));
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            uuid: 'uuid-final-orig-789',
            payload: { confirmar: 0 },
        });
    });

    it('clicar no botão com uuid vazio exibe toast de erro', async () => {
        render(<BtnGerarFinalOriginal paa={{ uuid: '', status: 'EM_ELABORACAO' }} />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Gerar' }));
        });

        expect(mockToastError).toHaveBeenCalledWith(
            'Erro!',
            'PAA não identificado para geração final.'
        );
        expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    // callback de erro – branch confirmar
    it('onError com confirmar=true abre o modal de confirmação', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        expect(screen.queryByTestId('modal-confirmar-final')).not.toBeInTheDocument();

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: 'Confirme para continuar', error: '' });
        });

        expect(screen.getByTestId('modal-confirmar-final')).toBeInTheDocument();
    });

    // callback de erro – branch valida_gerar_documento_final
    it('onError com error=valida_gerar_documento_final exibe toast de validação', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({
                confirmar: false,
                mensagem: 'Há pendências obrigatórias.',
                error: 'valida_gerar_documento_final',
            });
        });

        expect(mockToastError).toHaveBeenCalledWith(
            'Validação!',
            'Há pendências obrigatórias.'
        );
        expect(screen.queryByTestId('modal-confirmar-final')).not.toBeInTheDocument();
        expect(screen.queryByTestId('modal-pendencias-final')).not.toBeInTheDocument();
    });

    // callback de erro – branch else (pendências)
    it('onError sem confirmar e sem error específico abre modal de pendências', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        expect(screen.queryByTestId('modal-pendencias-final')).not.toBeInTheDocument();

        await act(async () => {
            capturedOnError?.({ confirmar: false, mensagem: 'introdução\nobjetivo', error: '' });
        });

        expect(screen.getByTestId('modal-pendencias-final')).toBeInTheDocument();
        expect(screen.getByTestId('texto-pendencias').textContent).toContain('introdução');
        expect(screen.getByTestId('texto-pendencias').textContent).toContain('objetivo');
    });

    // modal de confirmação
    it('cancelar no modal de confirmação fecha o modal', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: '', error: '' });
        });

        expect(screen.getByTestId('modal-confirmar-final')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('btn-cancelar-confirmar'));

        expect(screen.queryByTestId('modal-confirmar-final')).not.toBeInTheDocument();
    });

    it('confirmar no modal chama mutateAsync com confirmar=1', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: '', error: '' });
        });

        expect(screen.getByTestId('modal-confirmar-final')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('btn-confirmar-geracao'));
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            uuid: 'uuid-final-orig-789',
            payload: { confirmar: 1 },
        });
    });

    // modal de pendências
    it('fechar o modal de pendências fecha o modal', async () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: false, mensagem: 'conclusão', error: '' });
        });

        expect(screen.getByTestId('modal-pendencias-final')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('btn-fechar-pendencias'));

        expect(screen.queryByTestId('modal-pendencias-final')).not.toBeInTheDocument();
    });

    // callback de sucesso
    it('onSuccessGerarDocumento chama iniciarPolling', () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        act(() => {
            capturedOnSuccess?.();
        });

        expect(mockIniciarPolling).toHaveBeenCalledTimes(1);
    });

    // navegação pós-conclusão
    it('navega para /paa-vigente-e-anteriores quando onConcluidoFinal é chamado', () => {
        render(<BtnGerarFinalOriginal paa={DEFAULT_PAA} />);

        act(() => {
            capturedOnConcluidoFinal?.();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/paa-vigente-e-anteriores');
    });
});
