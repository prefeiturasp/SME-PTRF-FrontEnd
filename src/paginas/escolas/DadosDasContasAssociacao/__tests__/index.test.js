import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import { DadosDasContasPage } from "../index";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('<DadosDasContasPage>', () => {
  test('Deve renderizar o componente', async () => {
    useSelector.mockReturnValue(true);
    render(
      <DadosDasContasPage/>
    )
    expect(screen.getByText("Dados das contas")).toBeInTheDocument();
  });
});
