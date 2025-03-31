import React  from "react";
import { render, screen } from "@testing-library/react";
import { DadosDaDiretoriaDrePage } from "../index";
import { visoesService } from "../../../../../services/visoes.service";


jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  },
}));

describe('<DadosDaDiretoriaDrePage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
        <DadosDaDiretoriaDrePage/>
    )
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled()
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled()
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled()
  });

});
