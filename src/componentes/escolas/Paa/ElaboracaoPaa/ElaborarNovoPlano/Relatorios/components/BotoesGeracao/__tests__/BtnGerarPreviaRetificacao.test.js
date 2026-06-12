import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BtnGerarPreviaRetificacao } from '../BtnGerarPreviaRetificacao';
import { visoesService } from '../../../../../../../../../services/visoes.service';

// ─── variáveis de controle dos mocks ─────────────────────────────────────────
const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockIniciarPolling = jest.fn();
const mockToastError = jest.fn();

let mockStatusDocumento = undefined;
let mockIsLoading = false;
let mockIsPending = false;
let capturedOnSuccess;

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
    usePollingStatusDocumento: () => ({
        statusDocumento: mockStatusDocumento,
        isLoadingStatusDocumento: mockIsLoading,
        iniciarPolling: mockIniciarPolling,
    }),
}));

jest.mock('../../../hooks/usePostPaaGeracaoDocumento', () => ({
    usePostPaaGeracaoDocumentoPreviaRetificacao: ({ onSuccessGerarDocumentoRetificacao }) => {
        capturedOnSuccess = onSuccessGerarDocumentoRetificacao;
        return { mutate: mockMutate, isPending: mockIsPending };
    },
}));

jest.mock('../../../ModalInfoGeracaoDocumento', () => ({
    ModalInfoGeracaoDocumentoPrevia: ({ open, onClose }) =>
        open ? (
            <div data-testid="modal-info-previa-retif">
                <button onClick={onClose} data-testid="btn-fechar-modal">
                    Fechar
                </button>
            </div>
        ) : null,
}));

// ─── dados padrão ────────────────────────────────────────────────────────────
const DEFAULT_PAA = { uuid: 'uuid-previa-retif-456', status: 'RETIFICACAO' };

describe('BtnGerarPreviaRetificacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getPermissoes.mockReturnValue(true);
        mockStatusDocumento = undefined;
        mockIsLoading = false;
        mockIsPending = false;
        capturedOnSuccess = undefined;
    });

    // ── renderização ──────────────────────────────────────────────────────────
    it('renderiza o botão com texto "Prévia"', () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeInTheDocument();
    });

    it('botão tem o título correto', () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toHaveAttribute(
            'title',
            'Gerar Prévia de Retificação'
        );
    });

    it('botão está habilitado no estado padrão', () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).not.toBeDisabled();
    });

    // ── estados desabilitados ─────────────────────────────────────────────────
    it('botão fica desabilitado quando sem permissão (podeEditar=false)', () => {
        visoesService.getPermissoes.mockReturnValue(false);
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status é EM_PROCESSAMENTO', () => {
        mockStatusDocumento = { status: 'EM_PROCESSAMENTO' };
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeDisabled();
    });

    it('botão fica desabilitado quando status=CONCLUIDO e versao=FINAL', () => {
        mockStatusDocumento = { status: 'CONCLUIDO', versao: 'FINAL' };
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeDisabled();
    });

    it('botão fica desabilitado quando isLoadingStatusDocumento=true', () => {
        mockIsLoading = true;
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeDisabled();
    });

    it('botão fica desabilitado quando mutação está pendente', () => {
        mockIsPending = true;
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).toBeDisabled();
    });

    it('botão fica habilitado quando status=CONCLUIDO e versao=PREVIA', () => {
        mockStatusDocumento = { status: 'CONCLUIDO', versao: 'PREVIA' };
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.getByRole('button', { name: 'Prévia' })).not.toBeDisabled();
    });

    // ── interações de clique ──────────────────────────────────────────────────
    it('clicar no botão chama mutate com o uuid do paa', () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        fireEvent.click(screen.getByRole('button', { name: 'Prévia' }));
        expect(mockMutate).toHaveBeenCalledWith('uuid-previa-retif-456');
    });

    it('clicar no botão com uuid vazio exibe toast de erro', () => {
        render(<BtnGerarPreviaRetificacao paa={{ uuid: '', status: 'RETIFICACAO' }} />);
        fireEvent.click(screen.getByRole('button', { name: 'Prévia' }));
        expect(mockToastError).toHaveBeenCalledWith(
            'Erro!',
            'PAA vigente não identificado para geração de prévia de retificação.'
        );
        expect(mockMutate).not.toHaveBeenCalled();
    });

    // ── callback de sucesso ───────────────────────────────────────────────────
    it('onSuccessGerarDocumentoRetificacao abre o modal e chama iniciarPolling', async () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);
        expect(screen.queryByTestId('modal-info-previa-retif')).not.toBeInTheDocument();

        await act(async () => {
            capturedOnSuccess?.();
        });

        expect(screen.getByTestId('modal-info-previa-retif')).toBeInTheDocument();
        expect(mockIniciarPolling).toHaveBeenCalledTimes(1);
    });

    it('fechar o modal atualiza o estado corretamente', async () => {
        render(<BtnGerarPreviaRetificacao paa={DEFAULT_PAA} />);

        await act(async () => {
            capturedOnSuccess?.();
        });

        expect(screen.getByTestId('modal-info-previa-retif')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('btn-fechar-modal'));

        expect(screen.queryByTestId('modal-info-previa-retif')).not.toBeInTheDocument();
    });
});
