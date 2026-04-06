import React from "react";
import { render, screen, renderHook, fireEvent } from "@testing-library/react";
import { useGetAcoesAssociacao } from "../hooks/useGetAcoesAssociacao";
import TabelaReceitasPrevistas from "../TabelaReceitasPrevistas";
import { useGetProgramasPddeTotais } from "../hooks/useGetProgramasPddeTotais";

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

    render(
      <TabelaReceitasPrevistas
        data={result.current.data}
        handleOpenEditar={mockHandleOpenEditar}
      />
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

    render(
      <TabelaReceitasPrevistas
        data={result.current.data}
        handleOpenEditar={mockHandleOpenEditar}
      />
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

    render(
      <TabelaReceitasPrevistas
        data={result.current.data}
        handleOpenEditar={mockHandleOpenEditar}
      />
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

    render(
      <TabelaReceitasPrevistas
        data={result.current.data}
        handleOpenEditar={mockHandleOpenEditar}
      />
    );

    const editarButton = await screen.findByRole("button", { name: /editar/i });
    fireEvent.click(editarButton);

    expect(mockHandleOpenEditar).toHaveBeenCalled();
  });
});
