import React from "react";
import { render, screen, renderHook, fireEvent } from "@testing-library/react";
import { useGetAcoesAssociacao } from "../hooks/useGetAcoesAssociacao";
import TabelaReceitasPrevistas from "../TabelaReceitasPrevistas";
import { useGetProgramasPddeTotais } from "../hooks/useGetProgramasPddeTotais";
import { PaaContext } from "../../PaaContext";

jest.mock("../hooks/useGetAcoesAssociacao", () => ({
  useGetAcoesAssociacao: jest.fn(),
}));

jest.mock("../hooks/useGetProgramasPddeTotais", () => ({
  useGetProgramasPddeTotais: jest.fn(),
}));

jest.mock("../ReceitasPrevistasModalForm", () => () => (
  <div data-testid="mock-receitas-previstas-modal-form" />
));

const mockHandleOpenEditar = jest.fn();

const renderTabelaReceitasPrevistas = (paaOverride = null, extraProps = {}) => {
  const paa = paaOverride;

  return render(
    <PaaContext.Provider value={{ paa, refetch: jest.fn() }}>
      <TabelaReceitasPrevistas {...extraProps} />
    </PaaContext.Provider>,
  );
};

describe("TabelaReceitasPrevistas Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useGetProgramasPddeTotais.mockReturnValue({
      data: { programas: [], total: {} },
    });
  });

  it("deve exibir os dados da tabela corretamente", async () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          acao: { nome: "Recurso 1" },
          fixed: false,
        },
      ],

      isLoading: false,
    });

    const { result } = renderHook(() => useGetAcoesAssociacao());

    renderTabelaReceitasPrevistas(
      { saldo_congelado_em: null },
      { data: result.current.data, handleOpenEditar: mockHandleOpenEditar },
    );

    expect(screen.getAllByText("Recurso 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Custeio (R$)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Capital (R$)").length).toBeGreaterThan(0);
  });

  it("não deve renderizar o botão de edição quando `fixed` for `true`", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          uuid: "acao-associacao-uuid-1234",
          acao: { nome: "Total do PTRF" },
          fixed: true,
        },
      ],
      isLoading: false,
    });

    const { result } = renderHook(() => useGetAcoesAssociacao());
    renderTabelaReceitasPrevistas(
      { saldo_congelado_em: null },
      { data: result.current.data, handleOpenEditar: mockHandleOpenEditar },
    );

    expect(screen.queryByLabelText("Editar")).not.toBeInTheDocument();
  });

  it("deve renderizar o botão de edição quando `fixed` for `false`", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          uuid: "acao-associacao-uuid-1234",
          acao: { nome: "Recurso Editável" },
          fixed: false,
        },
      ],
      isLoading: false,
    });

    const { result } = renderHook(() => useGetAcoesAssociacao());

    renderTabelaReceitasPrevistas(
      { saldo_congelado_em: null },
      { data: result.current.data, handleOpenEditar: mockHandleOpenEditar },
    );

    expect(screen.getByLabelText("Editar")).toBeInTheDocument();
  });

  it("deve renderizar o componente de formulário ao clicar no botão de editar", async () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [
        {
          uuid: "acao-associacao-uuid-1234",
          acao: { nome: "Editável" },
          fixed: false,
        },
      ],
      isLoading: false,
    });

    const { result } = renderHook(() => useGetAcoesAssociacao());

    renderTabelaReceitasPrevistas(
      { saldo_congelado_em: null },
      { data: result.current.data, handleOpenEditar: mockHandleOpenEditar },
    );

    const editarButton = await screen.findByRole("button", { name: /editar/i });
    fireEvent.click(editarButton);

    expect(mockHandleOpenEditar).toHaveBeenCalled();
  });

  it("deve utilizar o saldo congelado quando o PAA estiver congelado", () => {
    renderTabelaReceitasPrevistas(
      {
        saldo_congelado_em: "2026-07-15T10:00:00",
      },
      {
        data: [
          {
            uuid: "acao-1",
            fixed: false,
            acao: {
              nome: "Minha ação",
              aceita_capital: true,
              aceita_custeio: true,
              aceita_livre: true,
            },
            saldos: {
              saldo_atual_capital: 100,
              saldo_atual_custeio: 100,
              saldo_atual_livre: 100,
            },
            receitas_previstas_paa: [
              {
                previsao_valor_capital: "0",
                previsao_valor_custeio: "0",
                previsao_valor_livre: "0",
                saldo_congelado_capital: "200",
                saldo_congelado_custeio: "300",
                saldo_congelado_livre: "400",
              },
            ],
          },
        ],
      },
    );

    expect(screen.getAllByText(/200,00/)).toHaveLength(2);
    expect(screen.getAllByText(/300,00/)).toHaveLength(2);
    expect(screen.getAllByText(/400,00/)).toHaveLength(2);
  });
});

it("deve utilizar o saldo atual quando o PAA não estiver congelado", () => {
  renderTabelaReceitasPrevistas(
    {
      saldo_congelado_em: null,
    },
    {
      data: [
        {
          uuid: "acao-1",
          fixed: false,
          acao: {
            nome: "Minha ação",
            aceita_capital: true,
            aceita_custeio: true,
            aceita_livre: true,
          },
          saldos: {
            saldo_atual_capital: 100,
            saldo_atual_custeio: 110,
            saldo_atual_livre: 120,
          },
          receitas_previstas_paa: [
            {
              previsao_valor_capital: "0",
              previsao_valor_custeio: "0",
              previsao_valor_livre: "0",
              saldo_congelado_capital: "200",
              saldo_congelado_custeio: "300",
              saldo_congelado_livre: "400",
            },
          ],
        },
      ],
    },
  );

  expect(screen.getAllByText(/100,00/)).toHaveLength(2);
  expect(screen.getAllByText(/110,00/)).toHaveLength(2);
  expect(screen.getAllByText(/120,00/)).toHaveLength(2);
});
