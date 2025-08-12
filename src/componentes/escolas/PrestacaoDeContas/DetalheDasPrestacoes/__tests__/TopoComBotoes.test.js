import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../TopoComBotoes/index";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service");

describe("TopoComBotoes", () => {
  const mockAssign = jest.fn();

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        assign: mockAssign,
      },
      writable: true,
    });

    mockAssign.mockClear();

    visoesService.getPermissoes.mockResolvedValueOnce(["add_despesa"]);
    visoesService.getPermissoes.mockResolvedValueOnce(["add_receita"]);
  });

  it("deve redirecionar para página cadastro-de-despesas quando clicar em Cadastrar despesa", () => {
    render(<TopoComBotoes />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar despesa/i }));

    expect(mockAssign).toHaveBeenCalledWith("/cadastro-de-despesa/tabela-de-lancamentos-despesas");
  });
  it("deve redirecionar para página cadastro-de-credito quando clicar em Cadastrar receita", () => {
    render(<TopoComBotoes />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar receita/i }));

    expect(mockAssign).toHaveBeenCalledWith("/cadastro-de-credito/tabela-de-lancamentos-receitas");
  });
});
