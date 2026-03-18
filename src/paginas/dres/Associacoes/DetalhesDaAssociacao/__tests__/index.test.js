import { render, screen } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, useLocation, useParams } from "react-router-dom";
import { DetalhesDaAssociacaoDrePage } from "../index";
import { DADOS_DA_ASSOCIACAO } from "../../../../../services/auth.service";

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn().mockReturnValue([]),
    getItemUsuarioLogado: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

jest.mock("../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: () => ({ recursoSelecionado: null, recursos: [] }),
}));

describe('<DetalhesDaAssociacaoDrePage>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockData = {
      dados_da_associacao: {
        uuid: "test-uuid",
        nome: "Associação Teste",
        recursos_da_associacao: [],
      }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
  });

  test('Deve renderizar o componente', async () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });
    useParams.mockReturnValue({ origem: undefined });
    render(
      <MemoryRouter>
        <DetalhesDaAssociacaoDrePage/>
      </MemoryRouter>
    )
  });

});
