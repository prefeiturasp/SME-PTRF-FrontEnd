import { render, screen } from "@testing-library/react";
import { CadastroTipoReceitaPage } from "../CadastroTipoReceita";
import { PaginasContainer } from "../../../../PaginasContainer";
import { MemoryRouter } from "react-router-dom";


jest.mock("../../../../PaginasContainer", () => ({
    PaginasContainer: (({ children }) => <div data-testid="paginas-container">{children}</div>)
}));

jest.mock("../../../../../componentes/sme/Parametrizacoes/Receitas/TiposReceita/TipoReceitaForm", () => ({
    TipoReceitaForm: (() => <div data-testid="tipo-receita-form"/>),
}));

describe("CadastroTipoReceitaPage", () => {
  it("deve renderizar corretamente a página de cadastro tipo de crédito", () => {
    render(
      <MemoryRouter>
        <CadastroTipoReceitaPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Adicionar tipo de crédito")).toBeInTheDocument();
    expect(screen.getByTestId("paginas-container")).toBeInTheDocument();
    expect(screen.getByTestId("tipo-receita-form")).toBeInTheDocument();
  });
});
