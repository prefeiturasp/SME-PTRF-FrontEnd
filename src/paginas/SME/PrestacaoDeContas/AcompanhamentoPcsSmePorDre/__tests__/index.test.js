import { render, screen } from "@testing-library/react";
import React  from "react";
import { useParams, useLocation } from "react-router-dom";
import { AcompanhamentoPcsPorDre } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

describe('<AcompanhamentoPcsPorDre>', () => {
  
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({
        periodo_uuid: 'uuid-teste',
        dre_uuid: 'uuid-teste'
    });
    useLocation.mockReturnValue({ state: {} });
    render(
        <AcompanhamentoPcsPorDre/>
    )
    expect(screen.getByText("Acompanhamento das Prestações de Contas")).toBeInTheDocument();
    expect(useParams).toHaveBeenCalled();
    expect(useLocation).toHaveBeenCalled();
  });

});
