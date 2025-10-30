import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { RenderSecao } from '../RenderSecao';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { usePatchPaa } from '../hooks/usePatchPaa';

jest.mock("../../../../../../Globais/ToastCustom");

const mockPatchPaa = jest.fn();
jest.mock('../hooks/usePatchPaa', () => ({
    usePatchPaa: () => ({
        patchPaa: mockPatchPaa
    }),
}));

jest.mock('../RelSecaoTextos', () => ({
  RelSecaoTextos: ({ handleSalvarTexto }) => (
    <div>
      <button data-testid="btn-call-save" onClick={() => handleSalvarTexto('texto_introducao', '<p>novo texto</p>')}>
        Salvar mock
      </button>
    </div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('RenderSecao', () => {
    const baseProps = {
        secaoKey: 'introducao',
        config: {
            titulo: 'Introdução',
            chave: 'introducao',
            temEditor: true,
            campoPaa: 'texto_introducao',
            textosPaa: ["introducao_do_paa_ue_1", "introducao_do_paa_ue_2"],
        },
        isExpanded: true,
        toggleSection: jest.fn(),
        textosPaa: {},
        isLoading: false,
        isError: false,
        isLoadingPaa: false,
        paaVigente: { uuid: '123' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        }));
    });

    it('renderiza o título e botão de toggle', () => {
        render(<RenderSecao {...baseProps} />);
        expect(screen.getByText('Introdução')).toBeInTheDocument();
    });

    it('mostra loading quando isLoading = true', () => {
        render(<RenderSecao {...baseProps} isLoading />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it('mostra erro quando isError = true', () => {
        render(<RenderSecao {...baseProps} isError />);
        expect(screen.getByText(/Erro ao carregar textos do PAA/i)).toBeInTheDocument();
    });

    it('chama toggleSection ao clicar no botão', () => {
        const { container } = render(<RenderSecao {...baseProps} />);
        const btn = container.querySelector('.btn-dropdown');
        fireEvent.click(btn);
        expect(baseProps.toggleSection).toHaveBeenCalledWith('introducao');
    });

    it('chama patchPaa e exibe ToastCustomSuccess quando salvar com sucesso', async () => {
        mockPatchPaa.mockResolvedValueOnce({});

        const props = {
        ...baseProps,
        paaVigente: { uuid: 'uuid-123' },
        };

        render(<RenderSecao {...props} />);

        const btn = screen.getByRole('button', { name: 'Salvar mock' });
        expect(btn).toBeInTheDocument();
        expect(btn).toBeEnabled();
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockPatchPaa).toHaveBeenCalled()
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Sucesso!',
                'Item salvo com sucesso!'
            );
        });
    });

    it('chama patchPaa e exibe ToastCustomError quando salvar', async () => {
        mockPatchPaa.mockRejectedValue({});
        

        const props = {
        ...baseProps,
        paaVigente: { uuid: 'uuid-123' },
        };

        render(<RenderSecao {...props} />);

        const btn = screen.getByRole('button', { name: 'Salvar mock' });
        expect(btn).toBeInTheDocument();
        expect(btn).toBeEnabled();
        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockPatchPaa).toHaveBeenCalled()
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro!',
                'Ops! Houve um erro ao tentar salvar.'
            );
        });
    });

    it('Valida PAA vigente não encontrado', async () => {
        mockPatchPaa.mockRejectedValue({});
        

        const props = {
            ...baseProps,
            paaVigente: {},
        };

        render(<RenderSecao {...props} />);

        const btn = screen.getByRole('button', { name: 'Salvar mock' });
        expect(btn).toBeInTheDocument();
        expect(btn).toBeEnabled();
        fireEvent.click(btn);

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro!',
                'PAA vigente não encontrado.'
            );
        });
    });
});
