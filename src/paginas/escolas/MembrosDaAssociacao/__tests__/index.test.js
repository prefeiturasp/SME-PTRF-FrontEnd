import { render, screen } from "@testing-library/react";
import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import { MembrosDaAssociacaoPage } from "../index";
import { MemoryRouter } from "react-router-dom";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock("../../../../componentes/escolas/MembrosDaAssociacaoVacancia", () => ({
  MembrosDaAssociacaoVacancia: () => <div data-testid="membros-v2" />,
}));

jest.mock("../../../../componentes/escolas/MembrosDaAssociacao", () => ({
  MembrosDaAssociacao: () => <div data-testid="membros-v1" />,
}));

jest.mock("../../../../componentes/escolas/Associacao/Membros", () => ({
  MembrosDaAssociacao: () => <div data-testid="membros-legada" />,
}));

describe('<MembrosDaAssociacaoPage>', () => {
  let featureFlagAtivaSpy;
  let getItemUsuarioLogadoSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // spyOn preserva o resto do módulo real (getDadosDoUsuarioLogado etc., usados por
    // outros componentes renderizados dentro de PaginasContainer) - substituir o módulo
    // inteiro via jest.mock quebra esses outros métodos.
    featureFlagAtivaSpy = jest.spyOn(visoesService, 'featureFlagAtiva');
    // PaginasContainer também chama getItemUsuarioLogado('visao_selecionada.nome')
    // diretamente (fora de featureFlagAtiva) pra decidir exibir BarraMensagemFixa - sem
    // usuário logado configurado no teste, a implementação real quebra ao tentar ler do
    // localStorage vazio.
    getItemUsuarioLogadoSpy = jest.spyOn(visoesService, 'getItemUsuarioLogado').mockReturnValue(null);
    useSelector.mockReturnValue(true);
  });

  afterEach(() => {
    featureFlagAtivaSpy.mockRestore();
    getItemUsuarioLogadoSpy.mockRestore();
  });

  it('Deve renderizar o componente', async () => {
    featureFlagAtivaSpy.mockReturnValue(false);
    // teste de, apenas, renderização
    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    )
    expect(useSelector).toHaveBeenCalled();
  });

  it('deve renderizar a v2 quando a flag historico-de-membros-v2 está ativa', () => {
    featureFlagAtivaSpy.mockImplementation(
      (flag) => flag === 'historico-de-membros-v2'
    );

    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    );

    expect(screen.getByTestId('membros-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('membros-v1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('membros-legada')).not.toBeInTheDocument();
  });

  it('deve renderizar a v2 com prioridade quando as duas flags (v1 e v2) estão ativas', () => {
    featureFlagAtivaSpy.mockReturnValue(true);

    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    );

    expect(screen.getByTestId('membros-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('membros-v1')).not.toBeInTheDocument();
  });

  it('deve renderizar a v1 quando só a flag historico-de-membros está ativa', () => {
    featureFlagAtivaSpy.mockImplementation(
      (flag) => flag === 'historico-de-membros'
    );

    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    );

    expect(screen.getByTestId('membros-v1')).toBeInTheDocument();
    expect(screen.queryByTestId('membros-v2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('membros-legada')).not.toBeInTheDocument();
  });

  it('deve renderizar a versão legada quando nenhuma flag está ativa', () => {
    featureFlagAtivaSpy.mockReturnValue(false);

    render(
      <MemoryRouter>
        <MembrosDaAssociacaoPage/>
      </MemoryRouter>
    );

    expect(screen.getByTestId('membros-legada')).toBeInTheDocument();
    expect(screen.queryByTestId('membros-v1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('membros-v2')).not.toBeInTheDocument();
  });
});
