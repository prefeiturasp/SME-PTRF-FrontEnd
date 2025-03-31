import { render } from "@testing-library/react";
import React  from "react";
import { useParams, useLocation } from "react-router-dom";
import { DetalhedasPrestacoesPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn()
}));

describe('<DetalhedasPrestacoesPage>', () => {
  it('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({periodo_uuid: 'uuid-teste', conta_uuid: 'uuid-teste'});
    render(
        <DetalhedasPrestacoesPage/>
    )
    expect(useParams).toHaveBeenCalled();
  });
});
