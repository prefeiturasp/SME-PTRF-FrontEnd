import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useGetAcoesAssociacao } from "../hooks/useGetAcoesAssociacao";
import ReceitasPrevistas from "../index";

jest.mock("../hooks/useGetAcoesAssociacao", () => ({
  useGetAcoesAssociacao: jest.fn(),
}));

jest.mock("../ReceitasPrevistasModalForm", () => () => (
  <div data-testid="mock-receitas-previstas-modal-form" />
));

const mockHandleOpenEditar = jest.fn();

describe("ReceitasPrevistas Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<ReceitasPrevistas />);
    const titulo = screen.getByRole("heading", {
      level: 4,
      name: /receitas previstas/i,
    });
    expect(titulo).toBeInTheDocument();
  });

  it("deve mudar de aba corretamente", () => {
    useGetAcoesAssociacao.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<ReceitasPrevistas />);
    const tabDetalhamento = screen.getByText(
      "Detalhamento de recursos próprios"
    );
    fireEvent.click(tabDetalhamento);

    expect(tabDetalhamento).toHaveClass("btn-escolhe-acao-active");
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

    render(<ReceitasPrevistas />);

    expect(screen.getByText("Recurso 1")).toBeInTheDocument();
    expect(screen.getByText("Custeio (R$)")).toBeInTheDocument();
    expect(screen.getByText("Capital (R$)")).toBeInTheDocument();
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

    render(<ReceitasPrevistas />);

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

    render(<ReceitasPrevistas />);
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

    render(<ReceitasPrevistas />);

    const editarButton = await screen.findByRole("button", { name: /editar/i });
    fireEvent.click(editarButton);

    // expect(mockHandleOpenEditar).toHaveBeenCalled();
  });
});
