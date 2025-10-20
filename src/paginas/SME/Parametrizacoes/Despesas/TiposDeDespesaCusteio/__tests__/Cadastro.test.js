import { render, screen } from "@testing-library/react";
import { CadastroTipoDeDespesaCusteioPage } from "../Cadastro";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../../../PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../../../../../../componentes/sme/Parametrizacoes/Despesas/TiposDeCusteio/TipoDeDespesaCusteioForm", () => ({
  TipoDeDespesaCusteioForm: () => <div data-testid="tipo-despesa-de-custeio-form" />,
}));

describe("CadastroTipoDeDespesaCusteioPage", () => {
  it("deve renderizar corretamente a página de cadastro tipo de despesa de custeio", () => {
    render(
      <MemoryRouter>
        <CadastroTipoDeDespesaCusteioPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Adicionar tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-despesa-de-custeio-form")).toBeInTheDocument();
  });
});
