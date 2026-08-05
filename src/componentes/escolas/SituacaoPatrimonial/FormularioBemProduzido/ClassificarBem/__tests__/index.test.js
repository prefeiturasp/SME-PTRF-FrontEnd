import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClassificarBem } from "../index";

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
  getEspecificacoesCapital: jest.fn().mockResolvedValue([]),
}));

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const defaultProps = {
    items: [],
    salvar: jest.fn(),
    salvarRascunhoClassificarBens: jest.fn(),
    setBemProduzidoItems: jest.fn(),
    setHabilitaCadastrarBem: jest.fn(),
    habilitaCadastrarBem: true,
    total: 0,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ClassificarBem
          {...defaultProps}
          {...props}
        />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ClassificarBem - Transformação de especificação", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  it("deve transformar especificação do bem de objeto para UUID corretamente", async () => {
    const mockSetBemProduzidoItems = jest.fn();
    const mockSetHabilitaCadastrarBem = jest.fn();

    renderComponent({
      items: [
        {
          uuid: "test-uuid-1",
          num_processo_incorporacao: "1234567890123456",
          especificacao_do_bem: {
            id: 6372,
            uuid: "2de99664-4453-4c3b-9847-5bfc0567344b",
            descricao: "Analisador de voltagem",
            aplicacao_recurso: "CAPITAL",
            tipo_custeio: null,
            tipo_custeio_objeto: null,
            ativa: false,
          },
          quantidade: 2,
          valor_individual: 7200,
        },
      ],
      setBemProduzidoItems: mockSetBemProduzidoItems,
      setHabilitaCadastrarBem: mockSetHabilitaCadastrarBem,
      total: 14400,
    });

    // Aguarda o useEffect([items, form]) executar e setar os valores no form (inclui transformação objeto → UUID)
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    // Clicar em "Adicionar item" dispara onValuesChange com todos os valores atuais do form,
    // o que faz handleValuesChange chamar setBemProduzidoItems com especificacao_do_bem já como UUID
    fireEvent.click(screen.getByText("Adicionar item"));

    await waitFor(() => {
      expect(mockSetBemProduzidoItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b",
          }),
        ])
      );
    });
  });

  it("deve manter UUID quando especificação já é string", async () => {
    const mockSetBemProduzidoItems = jest.fn();
    const mockSetHabilitaCadastrarBem = jest.fn();

    renderComponent({
      items: [
        {
          uuid: "test-uuid-1",
          num_processo_incorporacao: "1234567890123456",
          especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b",
          quantidade: 2,
          valor_individual: 7200,
        },
      ],
      setBemProduzidoItems: mockSetBemProduzidoItems,
      setHabilitaCadastrarBem: mockSetHabilitaCadastrarBem,
      total: 14400,
    });

    // Aguarda o useEffect([items, form]) executar
    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    // Clicar em "Adicionar item" dispara onValuesChange → handleValuesChange → setBemProduzidoItems
    fireEvent.click(screen.getByText("Adicionar item"));

    await waitFor(() => {
      expect(mockSetBemProduzidoItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            especificacao_do_bem: "2de99664-4453-4c3b-9847-5bfc0567344b",
          }),
        ])
      );
    });
  });
});
