import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom"
import { CadastroDeDespesasPage } from "../index";
import {DespesaContext} from "../../../../../context/Despesa";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('<CadastroDeDespesasPage>', () => {
  it('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter initialEntries={["/cadastro-despesas/teste-origem"]}>
        <Routes>
          <Route path="/cadastro-despesas/:origem" element={<CadastroDeDespesasPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
