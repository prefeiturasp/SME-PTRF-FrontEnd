import React  from "react";
import { render, screen } from "@testing-library/react";
import { useParams, MemoryRouter } from "react-router-dom";
import { AtribuicoesPage } from "../index";
import { visoesService } from "../../../../../services/visoes.service";


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(v=>v),
    featureFlagAtiva: jest.fn(),
  },
}));

describe('<AtribuicoesPage>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ tecnico_uuid: '1234' });
    render(
      <MemoryRouter>
        <AtribuicoesPage/>
      </MemoryRouter>
    )
    expect(useParams).toHaveBeenCalled()
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled()
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled()
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled()
  });

});
