import { render, screen } from "@testing-library/react";
import React  from "react";
import { useNavigate, MemoryRouter } from 'react-router-dom';
import { PainelParametrizacoesPage } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe('<PainelParametrizacoesPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    useNavigate.mockReturnValue({
      push: jest.fn(),
    });
    render(
      <MemoryRouter>
        <PainelParametrizacoesPage/>
      </MemoryRouter>
    )
    expect(screen.getByText("Painel de Parametrizações")).toBeInTheDocument();
    expect(useNavigate).toHaveBeenCalled();
  });

});
