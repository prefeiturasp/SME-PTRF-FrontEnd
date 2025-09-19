import { render } from "@testing-library/react";
import React from "react";
import { useParams } from "react-router-dom";
import { CadastroDeDespesa } from "../index";
import { DespesaContext } from "../../../../../context/Despesa";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../PaginasContainer", () => ({
  PaginasContainer: ({ children }) => (
    <div data-testid="mock-paginas-container">{children}</div>
  ),
}));

jest.mock("../../../../../componentes/escolas/Despesas/CadastroDeDespesas", () => ({
  CadastroDeDespesas: () => <div data-testid="mock-cadastro-despesas" />,
}));

describe("<CadastroDeDespesa>", () => {
  it("Deve renderizar o componente sem quebrar", () => {
    useParams.mockReturnValue({ origem: "teste-origem" });

    const mockDespesaContext = {
      initialValues: { outros_motivos_pagamento_antecipado: "" },
      setVerboHttp: jest.fn(),
      setIdDespesa: jest.fn(),
      setInitialValues: jest.fn(),
      valores_iniciais: { outros_motivos_pagamento_antecipado: "" },
    };

    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={["/cadastro-despesas/teste-origem"]}>
        <DespesaContext.Provider value={mockDespesaContext}>
          <Routes>
            <Route
              path="/cadastro-despesas/:origem"
              element={<CadastroDeDespesa />}
            />
          </Routes>
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    expect(getByTestId("mock-paginas-container")).toBeInTheDocument();
    expect(getByText("Cadastro de Despesa")).toBeInTheDocument();
    expect(getByText("Dados do documento")).toBeInTheDocument();
  });
});