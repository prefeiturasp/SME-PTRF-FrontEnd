import { render, screen } from "@testing-library/react";
import React  from "react";
import { useParams, useLocation } from "react-router-dom";
import { AcompanhamentoPcsPorDre } from "../index";
import { MemoryRouter } from "react-router-dom";

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
        <MemoryRouter>
          <AcompanhamentoPcsPorDre/>
        </MemoryRouter>
    )
    expect(screen.getByText("Acompanhamento das Prestações de Contas")).toBeInTheDocument();
    expect(useParams).toHaveBeenCalled();
    expect(useLocation).toHaveBeenCalled();
  });

});
