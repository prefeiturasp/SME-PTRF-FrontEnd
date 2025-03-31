import { render, screen, fireEvent } from "@testing-library/react";
import React  from "react";
import { DashboardPage } from "../index";
import { visoesService } from "../../../services/visoes.service";


jest.mock("../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

describe('<DashboardPage>', () => {
 
  test('Deve renderizar o componente', async () => {
    render(
        <DashboardPage/>
    )
  });

});
