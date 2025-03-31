import React  from "react";
import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { DreDashboardPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn()
}));

describe('<DreDashboardPage>', () => {
  test('Deve renderizar o componente', async () => {
    useLocation.mockReturnValue({ state: { acessadoPelaSidebar: true }});
    render(
      <DreDashboardPage/>
    )
    expect(useLocation).toHaveBeenCalled()
    expect(screen.getByText('Acompanhamento das Prestações de Contas')).toBeInTheDocument()
  });

});
