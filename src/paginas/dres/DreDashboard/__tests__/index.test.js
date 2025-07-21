import React  from "react";
import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { DreDashboardPage } from "../index";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn()
}));

describe('<DreDashboardPage>', () => {
  test('Deve renderizar o componente', async () => {
    useLocation.mockReturnValue({ state: { acessadoPelaSidebar: true }});
    render(
      <MemoryRouter>
        <DreDashboardPage/>
      </MemoryRouter>
    )
    expect(useLocation).toHaveBeenCalled()
    expect(screen.getByText('Acompanhamento das Prestações de Contas')).toBeInTheDocument()
  });

});
