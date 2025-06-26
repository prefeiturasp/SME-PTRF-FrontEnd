import { render } from "@testing-library/react";
import { useParams, useLocation } from "react-router-dom";
import React  from "react";
import { CadastroDeReceita } from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import { SidebarContext } from "../../../../../context/Sidebar";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CadastroReceitaPage } from "../index";

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

describe('<CadastroDeReceita>', () => {
  it('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ origem: "teste-origem" });
    visoesService.getItemUsuarioLogado.mockReturnValue('visao_selecionada.nome');
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({unidades: []});
    visoesService.getPermissoes.mockReturnValue([]);
    render(
      <SidebarContext.Provider value={ { sideBarStatus: true, setSideBarStatus: jest.fn(), irParaUrl:'', setIrParaUrl: jest.fn() } }>
        <CadastroDeReceita/>
      </SidebarContext.Provider>
    )

    expect(visoesService.getItemUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.featureFlagAtiva).toHaveBeenCalled();
    expect(visoesService.getDadosDoUsuarioLogado).toHaveBeenCalled();
    expect(visoesService.getPermissoes).toHaveBeenCalled();
  });
});

describe('<CadastroReceitaPage>', () => {
  it('Deve renderizar o componente', async () => {
    render(
      <MemoryRouter initialEntries={["/cadastro-receita/teste-origem"]}>
        <Routes>
          <Route path="/cadastro-receita/:origem" element={<CadastroReceitaPage />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
