import { render, screen } from "@testing-library/react";
import { EdicaoTipoReceitaPage } from "../EdicaoTipoReceita";
import { PaginasContainer } from "../../../../PaginasContainer";


jest.mock("../../../../PaginasContainer", () => ({
    PaginasContainer: (({ children }) => <div data-testid="paginas-container">{children}</div>)
}));

jest.mock("../../../../../componentes/sme/Parametrizacoes/Receitas/TiposReceita/TipoReceitaForm", () => ({
    TipoReceitaForm: (() => <div data-testid="tipo-receita-form"/>),
}));

describe("EdicaoTipoReceitaPage", () => {
  it("deve renderizar corretamente a página de edição tipo de crédito", () => {
    render(<EdicaoTipoReceitaPage />);

    expect(screen.getByText("Edição tipo de crédito")).toBeInTheDocument();
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-receita-form")).toBeInTheDocument();
  });
});
