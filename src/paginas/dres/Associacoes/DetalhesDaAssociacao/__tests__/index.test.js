import { render, screen } from "@testing-library/react";
import React  from "react";
import { MemoryRouter, useLocation, useParams } from "react-router-dom";
import { DetalhesDaAssociacaoDrePage } from "../index";
import { DADOS_DA_ASSOCIACAO } from "../../../../../services/auth.service";

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

jest.mock("../../../../PaginasContainer", () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../../../../../componentes/dres/Associacoes/DadosDasAssociacoes", () => ({
  DetalhesDaAssociacao: () => <div data-testid="detalhes-da-associacao">DetalhesDaAssociacao</div>,
}));

describe('<DetalhesDaAssociacaoDrePage>', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockDadosDaAssociacao = {
      dados_da_associacao: {
        uuid: "test-uuid",
        nome: "Associação Teste",
        recursos_da_associacao: [
          { uuid: "uuid-1", nome: "Recurso 1", nome_exibicao: "Recurso 1", legado: false },
        ],
      },
    };
    localStorage.setItem(DADOS_DA_ASSOCIACAO, JSON.stringify(mockDadosDaAssociacao));
  });

  test('Deve renderizar o componente', async () => {
    useLocation.mockReturnValue({ state: null, pathname: '/' });
    useParams.mockReturnValue({ origem: undefined });
    render(
      <MemoryRouter>
        <DetalhesDaAssociacaoDrePage/>
      </MemoryRouter>
    );
    expect(screen.getByTestId('detalhes-da-associacao')).toBeInTheDocument();
  });

});
