import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EdicaoBemProduzidoPage } from "../../EdicaoBemProduzido";
import { getModoVisualizacaoBemProduzido } from "../../../../../services/escolas/BensProduzidos.service";
import { visoesService } from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => {
  const actual = jest.requireActual("../../../../../services/visoes.service");
  return {
    ...actual,
    visoesService: {
      ...actual.visoesService,
      featureFlagAtiva: jest.fn(() => false),
    },
  };
});

jest.mock(
  "../../../../../componentes/escolas/SituacaoPatrimonial/FormularioBemProduzido",
  () => ({
    FormularioBemProduzido: () => <div>Formulario Bem Produzido Mock</div>,
  })
);

jest.mock("../../../../../services/escolas/BensProduzidos.service", () => ({
  getModoVisualizacaoBemProduzido: jest.fn(),
}));

const renderPage = (path = "/edicao-bem-produzido") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/edicao-bem-produzido" element={<EdicaoBemProduzidoPage />} />
          <Route path="/edicao-bem-produzido/:uuid" element={<EdicaoBemProduzidoPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("EdicaoBemProduzidoPage", () => {
  beforeEach(() => {
    getModoVisualizacaoBemProduzido.mockReset();
    getModoVisualizacaoBemProduzido.mockResolvedValue({ modo_visualizacao: false });
  });

  it("deve renderizar o título 'Editar bem produzido'", () => {
    renderPage();

    const titulo = screen.getByText("Editar bem produzido");
    expect(titulo).toBeInTheDocument();
  });

  it("deve renderizar o componente FormularioBemProduzido", () => {
    renderPage();

    const formularioBemProduzido = screen.getByText(
      "Formulario Bem Produzido Mock"
    );
    expect(formularioBemProduzido).toBeInTheDocument();
  });

  it("deve alterar o título para 'Visualizar bem produzido' quando o período está fechado", async () => {
    visoesService.featureFlagAtiva.mockImplementation(
      (flag) => flag === "situacao-patrimonial"
    );
    getModoVisualizacaoBemProduzido.mockResolvedValue({ modo_visualizacao: true });

    renderPage("/edicao-bem-produzido/bem-1");

    expect(await screen.findByText("Visualizar bem produzido")).toBeInTheDocument();
    expect(screen.queryByText("Editar bem produzido")).not.toBeInTheDocument();
  });
});
