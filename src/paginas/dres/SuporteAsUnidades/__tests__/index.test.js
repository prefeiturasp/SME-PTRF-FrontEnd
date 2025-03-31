import React  from "react";
import { render, screen } from "@testing-library/react";
import { SuporteAsUnidadesDre } from "../index";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
  visoesService: {
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  },
}));

describe('<SuporteAsUnidadesDre>', () => {
  test('Deve renderizar o componente', async () => {
    render(
      <SuporteAsUnidadesDre/>
    )
    expect(screen.getByText('Suporte às unidades da DRE')).toBeInTheDocument()
  });

});
