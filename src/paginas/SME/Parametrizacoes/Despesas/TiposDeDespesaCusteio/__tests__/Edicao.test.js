import { render, screen } from "@testing-library/react";
import { EdicaoTipoDeDespesaCusteioPage } from "../Edicao";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../../../PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../../../../../../componentes/sme/Parametrizacoes/Despesas/TiposDeCusteio/TipoDeDespesaCusteioForm", () => ({
  TipoDeDespesaCusteioForm: () => <div data-testid="tipo-despesa-de-custeio-form" />,
}));

describe("EdicaoTipoDeDespesaCusteioPage", () => {
  it("deve renderizar corretamente a página de edição tipo de despesa de custeio", () => {
    render(
      <MemoryRouter>
        <EdicaoTipoDeDespesaCusteioPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Edição tipo de despesa de custeio")).toBeInTheDocument();
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-despesa-de-custeio-form")).toBeInTheDocument();
  });
});
