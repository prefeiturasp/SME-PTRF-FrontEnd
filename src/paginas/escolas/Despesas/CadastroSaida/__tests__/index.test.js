import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom"
import { CadastroSaida } from "../index";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe('<CadastroSaida>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ uuid_receita: 'uuid-receitas', uuid_despesa: 'uuid-despesas' });
    render(
        <CadastroSaida/>
    )
    expect(screen.getByText("Cadastro de saída")).toBeInTheDocument();
  });
});
