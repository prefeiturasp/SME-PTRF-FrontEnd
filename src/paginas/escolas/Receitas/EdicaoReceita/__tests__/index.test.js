import { render } from "@testing-library/react";
import { useParams, useLocation } from "react-router-dom";
import React  from "react";
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
    useParams.mockReturnValue({ origem: "teste-origem" });
    visoesService.getItemUsuarioLogado.mockReturnValue('visao_selecionada.nome');
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({unidades: []});
    visoesService.getPermissoes.mockReturnValue([]);
    render(<EdicaoDeReceita/>)
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled();
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.getPermissoes).toHaveBeenCalled();
  });
});
