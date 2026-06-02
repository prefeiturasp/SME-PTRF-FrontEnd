import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useGetPlanoAplicacao } from "../hooks/useGetPlanoAplicacao";
import { useGetPaa } from "../../../../../componentes/hooks/useGetPaa";
import { VisualizarPlanoAplicacao } from "../VisualizarPlanoAplicacao";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../hooks/useGetPlanoAplicacao", () => ({
  useGetPlanoAplicacao: jest.fn(),
}));

jest.mock("../../../../../componentes/hooks/useGetPaa", () => ({
  useGetPaa: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockRefetch = jest.fn();

const defaultPaa = {
  uuid: "paa-uuid-123",
  status: "EM_ELABORACAO",
  associacao: "assoc-uuid-123",
};

describe("VisualizarPlanoAplicacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("PAA", "paa-uuid-123");

    useNavigate.mockReturnValue(mockNavigate);

    useGetPaa.mockReturnValue({
      data: defaultPaa,
      refetch: mockRefetch,
      isFetching: false,
    });

    useGetPlanoAplicacao.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
    });

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <VisualizarPlanoAplicacao />
      </MemoryRouter>,
    );

  it("não renderiza nada quando paa não está disponível", () => {
    useGetPaa.mockReturnValue({ data: null, refetch: mockRefetch, isFetching: false });
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });

  describe("Navegação dos botões", () => {
    it("redireciona para prioridades-list ao clicar em 'Editar informações'", () => {
      renderComponent();

      fireEvent.click(screen.getByRole("button", { name: /editar informações/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa", {
        state: { activeTab: "prioridades-list", fromPlanoAplicacao: true },
      });
    });

    it("redireciona para relatorios ao clicar em 'Voltar'", () => {
      renderComponent();

      fireEvent.click(screen.getByRole("button", { name: /voltar/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa", {
        state: {
          activeTab: "relatorios",
          expandedSections: { planoAnual: true, componentes: true },
        },
      });
    });

    it("redireciona para rota de retificação ao clicar em 'Editar informações' quando status é EM_RETIFICACAO", () => {
      useGetPaa.mockReturnValue({
        data: { ...defaultPaa, status: "EM_RETIFICACAO", uuid: "ret-uuid" },
        refetch: mockRefetch,
        isFetching: false,
      });

      renderComponent();

      fireEvent.click(screen.getByRole("button", { name: /editar informações/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/ret-uuid", {
        state: { activeTab: "prioridades-list", fromPlanoAplicacao: true },
      });
    });

    it("redireciona para rota de retificação ao clicar em 'Voltar' quando status é EM_RETIFICACAO", () => {
      useGetPaa.mockReturnValue({
        data: { ...defaultPaa, status: "EM_RETIFICACAO", uuid: "ret-uuid" },
        refetch: mockRefetch,
        isFetching: false,
      });

      renderComponent();

      fireEvent.click(screen.getByRole("button", { name: /voltar/i }));

      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/ret-uuid", {
        state: {
          activeTab: "relatorios",
          expandedSections: { planoAnual: true, componentes: true },
        },
      });
    });
  });

  describe("Renderização dos grupos", () => {
    it("renderiza os itens na ordem recebida da API", async () => {
      useGetPlanoAplicacao.mockReturnValue({
        isFetching: false,
        isError: false,
        data: [
          {
            key: "prioridades-outros-recursos",
            titulo: "Prioridades Outros Recursos",
            ehOutrosRecursos: true,
            dados: [
              { uuid: "rp", acao: "Recursos Próprios", prioridade: true, recurso: "RECURSO_PROPRIO", valor_total: "50.00" },
              { uuid: "a",  acao: "A Recurso",          prioridade: true, recurso: "OUTRO_RECURSO",  valor_total: "20.00" },
              { uuid: "b",  acao: "B Recurso",          prioridade: true, recurso: "OUTRO_RECURSO",  valor_total: "30.00" },
              { key: "prioridades-outros-recursos-total", isTotal: true, valor_total: 100 },
            ],
          },
        ],
      });

      renderComponent();

      const tabela = await screen.findByRole("table");
      const rows = within(tabela).getAllByRole("row");

      // rows[0] é o header da tabela
      expect(rows[1]).toHaveAttribute("data-row-key", "rp");
      expect(rows[2]).toHaveAttribute("data-row-key", "a");
      expect(rows[3]).toHaveAttribute("data-row-key", "b");
      expect(rows[4]).toHaveTextContent("TOTAL");
    });
  });
});
