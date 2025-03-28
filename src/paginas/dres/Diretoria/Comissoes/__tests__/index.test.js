import React  from "react";
import { render, screen } from "@testing-library/react";
import { ComissoesDrePage } from "../index";
import { visoesService } from "../../../../../services/visoes.service";


jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  },
}));

describe('<ComissoesDrePage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
        <ComissoesDrePage/>
    )
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled()
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled()
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled()
  });

});
