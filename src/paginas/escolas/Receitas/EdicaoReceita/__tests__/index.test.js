import { render } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EdicaoDeReceita } from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import { useParams, useLocation } from "react-router-dom";

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

jest.mock('../../../../../componentes/Globais/ReactNumberFormatInput', () => ({
  __esModule: true,
  ReactNumberFormatInput: (props) => <input data-testid="react-format-input-mock" {...props} />,
}));

describe('<EdicaoDeReceita>', () => {
  it('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ origem: "teste-origem" });
    useLocation.mockReturnValue({ state: null });
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
