import React from 'react';
import { useDispatch } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalImportarPrioridades from '../ModalImportarPrioridades';
import { usePostImportarPrioridades } from '../hooks/usePostImportarPrioridades';
import { toastCustom } from '../../../../../../Globais/ToastCustom';
import { CustomModalConfirm } from "../../../../../../Globais/Modal/CustomModalConfirm";

jest.mock("../../../../../../Globais/ToastCustom", () => ({
  toastCustom: { ToastCustomError: jest.fn() },
}));

jest.mock('../hooks/usePostImportarPrioridades', () => ({
  usePostImportarPrioridades: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useDispatch: jest.fn()
}));

jest.mock("../../../../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));

describe('ModalImportarPrioridades', () => {
  let queryClient;
  let mockData;
  const mockOnClose = jest.fn();
  const mockMutate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    localStorage.setItem("PAA", "uuid-atual-123");
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    mockData = [
      {
        uuid: "662f5757-3dc0-4a7b-8517-37e2f63df632",
        periodo_paa_objeto: {
          uuid: "55d1c9d3-a362-436c-b28a-b8c58033b42a",
          referencia: "2024 Teste Anterior",
        },
      },
    ];

    usePostImportarPrioridades.mockReturnValue({
      mutationImportarPrioridades: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    jest.clearAllMocks();

  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      paas: mockData,
      onClose: jest.fn(),
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <ModalImportarPrioridades {...defaultProps} />
      </QueryClientProvider>
    );
  };

  it('deve renderizar o modal quando open=true', () => {
    renderComponent();
    expect(screen.getByText('Importação de PAA anterior')).toBeInTheDocument();
  });

  it('deve renderizar todos os campos obrigatórios', () => {
    renderComponent();
    
    expect(screen.getByLabelText('Ano')).toBeInTheDocument();
  });


  it("renderiza o título e o texto de instrução", () => {
    render(<ModalImportarPrioridades open={true} onClose={mockOnClose} paas={[]} />);

    expect(screen.getByText("Importação de PAA anterior")).toBeInTheDocument();
    expect(
      screen.getByText("Selecione o ano em que deseja importar os dados para o PAA atual.")
    ).toBeInTheDocument();
  });

  it("renderiza opções no Select com base nos paas", () => {
    const paas = mockData;

    render(<ModalImportarPrioridades open={true} onClose={mockOnClose} paas={paas} />);

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(screen.getByText("2024 Teste Anterior")).toBeInTheDocument();
  });

  it("chama onClose ao clicar em Cancelar", () => {
    render(<ModalImportarPrioridades open={true} onClose={mockOnClose} paas={[]} />);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("exibe erros de validação quando o form é enviado vazio", async () => {
    render(<ModalImportarPrioridades open={true} onClose={mockOnClose} paas={[]} />);

    fireEvent.click(screen.getByRole("button", { name: /Importar/i }));

    await waitFor(() => {
      expect(screen.getByText(/PAA anterior é obrigatório/i)).toBeInTheDocument();
    });
  });

  it("clica em Cancelar → chama onClose", () => {
    const onClose = jest.fn();
    render(<ModalImportarPrioridades open onClose={onClose} paas={[]} />);

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(onClose).toHaveBeenCalled();
  });

  it("trata erro sem confirmar → chama toastCustom", async () => {
    mockMutate.mockImplementation((_, { onError }) => {
      onError({ response: { data: { mensagem: "Erro ao importar" } } });
    });

    render(<ModalImportarPrioridades open onClose={jest.fn()} paas={mockData} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("2024 Teste Anterior"));


    fireEvent.click(screen.getByText("Importar"));

    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
        "Erro ao importar"
      );
    });
  });

  it("trata erro com confirmar → abre CustomModalConfirm exigindo a confirmação", async () => {
    mockMutate.mockImplementation((_, { onError }) => {
      onError({ response: { data: { confirmar: "Confirmação necessária" } } });
    });

    render(<ModalImportarPrioridades open onClose={jest.fn()} paas={mockData} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("2024 Teste Anterior"));

    fireEvent.click(screen.getByText("Importar"));

    await waitFor(() => {
      expect(CustomModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Confirma importação?",
          message: "Confirmação necessária",
        })
      );
    });
  });

  it("submete form com sucesso", async () => {
    render(<ModalImportarPrioridades open onClose={jest.fn()} paas={mockData} />);
    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("2024 Teste Anterior"));

    fireEvent.click(screen.getByText("Importar"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          uuid_paa_atual: "uuid-atual-123",
          uuid_paa_anterior: mockData[0].uuid,
          confirmar: 0,
        },
        expect.any(Object)
      );
    });
  });
});