import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ListaBemProduzido } from "../index";
import { act } from "react-dom/test-utils";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const RouterWrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;

// Mocks dos hooks de dados
jest.mock("../hooks/useGetBemProduzidosComAdquiridos", () => ({
  useGetBemProduzidosComAdquiridos: jest.fn(),
}));
jest.mock("../../../../../hooks/Globais/useGetPeriodoComPC", () => ({
  useGetPeriodosComPC: jest.fn(),
}));
jest.mock("../../../../../hooks/Globais/useCarregaTabelaDespesa", () => ({
  useCarregaTabelaDespesa: jest.fn(),
}));

// Mock dos componentes filhos
jest.mock("../FormFiltrosBens", () => ({
  FormFiltrosBens: (props) => (
    <div data-testid="form-filtros-bens">
      <button onClick={() => props.onFiltrar && props.onFiltrar()}>Filtrar</button>
      <button onClick={() => props.onLimparFiltros && props.onLimparFiltros()}>Limpar Filtros</button>
      <button onClick={() => props.onCancelarFiltros && props.onCancelarFiltros()}>Cancelar</button>
    </div>
  ),
}));
jest.mock("../../../../Globais/Tag", () => ({
  Tag: ({ label }) => <span data-testid="tag">{label}</span>,
}));
jest.mock("../../../../Globais/Mensagens/MsgImgCentralizada", () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="empty-msg">{texto}</div>,
}));

const { useGetBemProduzidosComAdquiridos } = require("../hooks/useGetBemProduzidosComAdquiridos");
const { useGetPeriodosComPC } = require("../../../../../hooks/Globais/useGetPeriodoComPC");
const { useCarregaTabelaDespesa } = require("../../../../../hooks/Globais/useCarregaTabelaDespesa");

const baseData = {
  count: 2,
  results: [
    {
      uuid: "1",
      numero_documento: "123,456",
      especificacao_do_bem: "Cadeira",
      status: "COMPLETO",
      num_processo_incorporacao: "2023123456789",
      data_aquisicao_producao: "2023-01-01",
      periodo: "2023",
      quantidade: 10,
      valor_total: 1000,
      tipo: "Produzido",
      despesas: [
        {
          uuid: "d1",
          rateios: [
            { num_documento: "A1", data_documento: "2023-01-01", especificacao_do_bem: "Cadeira", acao: "Ação 1", valor: 500, valor_utilizado: 400 },
          ],
        },
      ],
    },
    {
      uuid: "2",
      numero_documento: "789",
      especificacao_do_bem: "Mesa",
      status: "RASCUNHO",
      num_processo_incorporacao: "2023123456780",
      data_aquisicao_producao: "2023-02-01",
      periodo: "2023",
      quantidade: 5,
      valor_total: 500,
      tipo: "Adquirido",
      despesas: [],
    },
  ],
};

describe("ListaBemProduzido", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useGetBemProduzidosComAdquiridos.mockReset();
    useGetPeriodosComPC.mockReset();
    useCarregaTabelaDespesa.mockReset();
    useGetBemProduzidosComAdquiridos.mockReturnValue({
      isLoading: false,
      data: baseData,
      refetch: jest.fn(),
    });
    useGetPeriodosComPC.mockReturnValue({ data: [] });
    useCarregaTabelaDespesa.mockReturnValue({ acoes_associacao: [], contas_associacao: [] });
  });

  it('deve renderizar o botão "Adicionar bem produzido"', () => {
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });

    const button = screen.getByRole("button", {
      name: /adicionar bem produzido/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn", "btn-success");
  });

  it('deve navegar para "/cadastro-bem-produzido" ao clicar no botão', () => {
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    const button = screen.getByRole("button", {
      name: /adicionar bem produzido/i,
    });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith("/cadastro-bem-produzido");
  });

  it("deve exibir spinner durante o loading", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: true, data: null, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(document.querySelector('.ant-spin-spinning')).toBeInTheDocument();
  });

  it("deve exibir mensagem de vazio quando não há dados", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: { count: 0, results: [] }, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(screen.getByTestId("empty-msg")).toBeInTheDocument();
  });

  it("deve renderizar a tabela com dados e tags", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(screen.getAllByTestId("tag").length).toBeGreaterThan(0);
    expect(screen.getByText("Cadeira")).toBeInTheDocument();
    expect(screen.getByText("Mesa")).toBeInTheDocument();
  });

  it("deve renderizar o botão de exportar", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(screen.getByText(/exportar/i)).toBeInTheDocument();
  });

  it("deve renderizar o paginator quando count > 10", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: { ...baseData, count: 11 }, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(document.querySelector('.p-paginator')).toBeInTheDocument();
  });

  it("deve chamar refetch ao filtrar", () => {
    const refetch = jest.fn();
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    fireEvent.click(screen.getByText("Filtrar"));
    expect(refetch).toHaveBeenCalled();
  });

  it("deve limpar filtros ao clicar em Limpar Filtros", async () => {
    const refetch = jest.fn();
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    fireEvent.click(screen.getByText("Limpar Filtros"));
    await waitFor(() => {
      expect(refetch).toHaveBeenCalled();
    });
  });

  it("deve cancelar filtros ao clicar em Cancelar", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.getByTestId("form-filtros-bens")).toBeInTheDocument();
  });

  it("deve expandir e recolher linha do tipo Produzido", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    const expandBtn = screen.getAllByRole("button", { name: /expandir/i })[0];
    fireEvent.click(expandBtn); // expandir
    // O botão deve mudar para "Recolher"
    expect(screen.getAllByRole("button", { name: /recolher/i })[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /recolher/i })[0]); // recolher
    expect(screen.getAllByRole("button", { name: /expandir/i })[0]).toBeInTheDocument();
  });

  it("deve renderizar corretamente valores e datas formatadas", () => {
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 500,00")).toBeInTheDocument();
    expect(screen.getByText("01/01/2023")).toBeInTheDocument();
    expect(screen.getByText("01/02/2023")).toBeInTheDocument();
  });

  it("deve lidar com erro no hook de dados", () => {
    useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, isError: true, error: { message: "Erro" }, data: null, refetch: jest.fn() });
    render(<ListaBemProduzido />, { wrapper: RouterWrapper });
    expect(screen.getByTestId("form-filtros-bens")).toBeInTheDocument();
  });

  describe("quando visao_dre é true", () => {
    it("não deve renderizar o botão 'Adicionar bem produzido'", () => {
      render(<ListaBemProduzido visao_dre={true} />, { wrapper: RouterWrapper });
      
      const button = screen.queryByRole("button", {
        name: /adicionar bem produzido/i,
      });
      expect(button).not.toBeInTheDocument();
    });

    it("não deve renderizar o botão 'Editar bem' nas linhas da tabela", () => {
      useGetBemProduzidosComAdquiridos.mockReturnValue({ isLoading: false, data: baseData, refetch: jest.fn() });
      render(<ListaBemProduzido visao_dre={true} />, { wrapper: RouterWrapper });
      
      const editButtons = screen.queryAllByRole("button", {
        name: /editar bem/i,
      });
      expect(editButtons).toHaveLength(0);
    });
  });
});
