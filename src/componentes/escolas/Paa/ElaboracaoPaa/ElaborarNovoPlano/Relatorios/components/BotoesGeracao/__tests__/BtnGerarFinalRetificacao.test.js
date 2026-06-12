import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnGerarFinalRetificacao } from '../BtnGerarFinalRetificacao';
import { visoesService } from '../../../../../../../../../services/visoes.service';

// ─── variáveis de controle dos mocks ─────────────────────────────────────────
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

// ─── mocks de módulos ─────────────────────────────────────────────────────────
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
    usePostPaaGeracaoDocumentoFinalRetificacao: ({
        onSuccessGerarDocumentoRetificacao,
        onErrorGerarDocumentoRetificacao,
    }) => {
        capturedOnError = onErrorGerarDocumentoRetificacao;
        capturedOnSuccess = onSuccessGerarDocumentoRetificacao;
        return { mutateAsync: mockMutateAsync, isPending: mockIsPending };
    },
}));

jest.mock('../../../ModalInfoGeracaoDocumento', () => ({
    ModalConfirmaGeracaoFinalRetificacao: ({ open, onClose, onConfirm }) =>
        open ? (
            <div data-testid="modal-confirmar-retif">
                <button onClick={onClose} data-testid="btn-cancelar-confirmar-retif">
                    Cancelar
                </button>
                <button onClick={onConfirm} data-testid="btn-confirmar-geracao-retif">
                    Continuar
                </button>
            </div>
        ) : null,
    ModalInfoPendenciasGeracaoFinalRetificacao: ({ open, onClose, pendencias }) =>
        open ? (
            <div data-testid="modal-pendencias-retif">
                <span data-testid="texto-pendencias-retif">{pendencias}</span>
                <button onClick={onClose} data-testid="btn-fechar-pendencias-retif">
                    Ok
                </button>
            </div>
        ) : null,
}));

// ─── dados padrão ────────────────────────────────────────────────────────────
const DEFAULT_PAA = { uuid: 'uuid-final-retif-321', status: 'RETIFICACAO' };

describe('BtnGerarFinalRetificacao', () => {
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

    // ── renderização ──────────────────────────────────────────────────────────
    it('renderiza o botão com texto "Gerar"', () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeInTheDocument();
    });

    it('botão tem o título correto', () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toHaveAttribute(
            'title',
            'Gerar documento PAA final retificado'
        );
    });

    it('botão está habilitado no estado padrão', () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).not.toBeDisabled();
    });

    // ── estados desabilitados ─────────────────────────────────────────────────
    it('botão fica desabilitado quando sem permissão (podeEditar=false)', () => {
        visoesService.getPermissoes.mockReturnValue(false);
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status é EM_PROCESSAMENTO', () => {
        mockStatusDocumento = { status: 'EM_PROCESSAMENTO' };
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status=CONCLUIDO e versao=FINAL', () => {
        mockStatusDocumento = { status: 'CONCLUIDO', versao: 'FINAL' };
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando isLoadingStatusDocumento=true', () => {
        mockIsLoading = true;
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    it('botão fica desabilitado quando mutação está pendente', () => {
        mockIsPending = true;
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Gerar' })).toBeDisabled();
    });

    // ── interações de clique ──────────────────────────────────────────────────
    it('clicar no botão chama mutateAsync com confirmar=0', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Gerar' }));
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            uuid: 'uuid-final-retif-321',
            payload: { confirmar: 0 },
        });
    });

    it('clicar no botão com uuid vazio exibe toast de erro', async () => {
        render(<BtnGerarFinalRetificacao paa={{ uuid: '', status: 'RETIFICACAO' }} />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Gerar' }));
        });

        expect(mockToastError).toHaveBeenCalledWith(
            'Erro!',
            'PAA não identificado para geração final de retificação.'
        );
        expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    // ── callback de erro – branch confirmar ──────────────────────────────────
    it('onError com confirmar=true abre o modal de confirmação de retificação', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        expect(screen.queryByTestId('modal-confirmar-retif')).not.toBeInTheDocument();

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: 'Confirme para continuar' });
        });

        expect(screen.getByTestId('modal-confirmar-retif')).toBeInTheDocument();
    });

    // ── callback de erro – branch else (pendências) ──────────────────────────
    it('onError com confirmar=false abre modal de pendências com a mensagem', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        expect(screen.queryByTestId('modal-pendencias-retif')).not.toBeInTheDocument();

        await act(async () => {
            capturedOnError?.({ confirmar: false, mensagem: 'Nenhuma alteração encontrada' });
        });

        expect(screen.getByTestId('modal-pendencias-retif')).toBeInTheDocument();
        expect(screen.getByTestId('texto-pendencias-retif')).toHaveTextContent(
            'Nenhuma alteração encontrada'
        );
    });

    // ── modal de confirmação ──────────────────────────────────────────────────
    it('cancelar no modal de confirmação fecha o modal', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: '' });
        });

        expect(screen.getByTestId('modal-confirmar-retif')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('btn-cancelar-confirmar-retif'));

        expect(screen.queryByTestId('modal-confirmar-retif')).not.toBeInTheDocument();
    });

    it('confirmar no modal de retificação chama mutateAsync com confirmar=1', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: true, mensagem: '' });
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('btn-confirmar-geracao-retif'));
        });

        expect(mockMutateAsync).toHaveBeenCalledWith({
            uuid: 'uuid-final-retif-321',
            payload: { confirmar: 1 },
        });
    });

    // ── modal de pendências ───────────────────────────────────────────────────
    it('fechar o modal de pendências fecha o modal', async () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnError?.({ confirmar: false, mensagem: 'introdução' });
        });

        expect(screen.getByTestId('modal-pendencias-retif')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('btn-fechar-pendencias-retif'));

        expect(screen.queryByTestId('modal-pendencias-retif')).not.toBeInTheDocument();
    });

    // ── callback de sucesso ───────────────────────────────────────────────────
    it('onSuccessGerarDocumentoRetificacao chama iniciarPolling', () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        act(() => {
            capturedOnSuccess?.();
        });

        expect(mockIniciarPolling).toHaveBeenCalledTimes(1);
    });

    // ── navegação pós-conclusão ───────────────────────────────────────────────
    it('navega para /paa-vigente-e-anteriores quando onConcluidoFinal é chamado', () => {
        render(<BtnGerarFinalRetificacao paa={DEFAULT_PAA} />);

        act(() => {
            capturedOnConcluidoFinal?.();
        });

        expect(mockNavigate).toHaveBeenCalledWith('/paa-vigente-e-anteriores');
    });
});
