import { render } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EdicaoDeReceita } from "../index";
import { visoesService } from "../../../../../services/visoes.service";

// Mockando useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

describe('<EdicaoDeReceita>', () => {
  it('Deve renderizar o componente', async () => {
    visoesService.getItemUsuarioLogado.mockReturnValue('visao_selecionada.nome');
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({unidades: []});
    visoesService.getPermissoes.mockReturnValue([]);
    render(
      <MemoryRouter initialEntries={["/edicao-receita/teste-origem"]}>
        <Routes>
          <Route path="/edicao-receita/:origem" element={<EdicaoDeReceita />} />
        </Routes>
      </MemoryRouter>
    );
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled();
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.getPermissoes).toHaveBeenCalled();
  });
});
