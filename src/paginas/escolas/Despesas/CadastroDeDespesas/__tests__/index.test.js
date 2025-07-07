import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom"
import { CadastroDeDespesa } from "../index";
import {DespesaContext} from "../../../../../context/Despesa";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('<CadastroDeDespesa>', () => {
  it('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ origem: "teste-origem" });

    // Provide a minimal mock context value
    const mockDespesaContext = {
      initialValues: {
        outros_motivos_pagamento_antecipado: ""
      },
      setVerboHttp: jest.fn(),
      setIdDespesa: jest.fn(),
      setInitialValues: jest.fn(),
      valores_iniciais: { outros_motivos_pagamento_antecipado: "" }
    };

    render(
      <MemoryRouter initialEntries={["/cadastro-despesas/teste-origem"]}>
        <DespesaContext.Provider value={mockDespesaContext}>
          <Routes>
            <Route path="/cadastro-despesas/:origem" element={<CadastroDeDespesa />} />
          </Routes>
        </DespesaContext.Provider>
      </MemoryRouter>
    );
  });
});
