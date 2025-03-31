import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom"
import { CadastroDeDespesa } from "../index";
import {DespesaContext} from "../../../../../context/Despesa";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('<CadastroDeDespesa>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ origem: 'teste-origem' });
    render(
      <DespesaContext.Provider value={{
        initialValues: { outros_motivos_pagamento_antecipado: ''},
        setVerboHttp: jest.fn(),
        setIdDespesa: jest.fn(),
        setInitialValues: jest.fn(),
      }}>
        <CadastroDeDespesa/>
      </DespesaContext.Provider>
    )
    expect(screen.getByText("Cadastro de Despesa")).toBeInTheDocument();
  });
});
