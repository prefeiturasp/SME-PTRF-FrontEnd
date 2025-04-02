import React  from "react";
import { render, screen } from "@testing-library/react";
import { ValoresReprogramadosDrePage } from "../index";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  },
}));

describe('<ValoresReprogramadosDrePage>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <ValoresReprogramadosDrePage/>
    )
    expect(screen.getByText('Valores reprogramados')).toBeInTheDocument()
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled()
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled()
    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled()
  });

});
