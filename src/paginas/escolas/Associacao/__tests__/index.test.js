import { render, screen } from "@testing-library/react";
import React  from "react";
import { useLocation, MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DadosDaAssociacaoPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('<DadosDaAssociacaoPage>', () => {
  test('Deve renderizar o componente', async () => {
    useSelector.mockReturnValue(true);
    render(
      <MemoryRouter>
        <DadosDaAssociacaoPage/>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados das contas")).toBeInTheDocument();
  });
});
