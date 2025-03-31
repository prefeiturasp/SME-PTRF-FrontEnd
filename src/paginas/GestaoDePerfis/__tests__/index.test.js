import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { MemoryRouter } from "react-router-dom";
import { GestaoDePerfisPage } from "../index";
import { visoesService } from "../../../services/visoes.service";

jest.mock("../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

describe('<GestaoDePerfisPage>', () => {
  
  test('Deve renderizar o componente', async () => {
    visoesService.getItemUsuarioLogado.mockResolvedValue('SME');
    render(
      <MemoryRouter>
        <GestaoDePerfisPage />
      </MemoryRouter>
    )
  });
});
