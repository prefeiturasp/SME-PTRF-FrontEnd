import { render } from "@testing-library/react";
import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import { MembrosDaAssociacaoPage } from "../index";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('<MembrosDaAssociacaoPage>', () => {
  it('Deve renderizar o componente', async () => {
    useSelector.mockReturnValue(true);
    // teste de, apenas, renderização
    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    )
    expect(useSelector).toHaveBeenCalled();
  });
});
