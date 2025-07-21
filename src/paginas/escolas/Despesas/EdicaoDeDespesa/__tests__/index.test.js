import { render, screen } from "@testing-library/react";
import React  from "react";
import { useParams, useLocation, MemoryRouter } from "react-router-dom"
import { EdicaoDeDespesa, tituloPagina } from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import {DespesaContext} from "../../../../../context/Despesa";
import { metodosAuxiliares } from "../../../../../componentes/escolas/Despesas/metodosAuxiliares";

jest.mock("../../../../../componentes/escolas/Despesas/metodosAuxiliares", () => ({
  metodosAuxiliares: {
    origemAnaliseLancamento: jest.fn(),
  }
}));

jest.mock("../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    featureFlagAtiva: jest.fn(),
  }
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn()
}));

const contexto = {
  initialValues: { outros_motivos_pagamento_antecipado: ''},
  setVerboHttp: jest.fn(),
  setIdDespesa: jest.fn(),
  getDespesa: jest.fn(),
}
describe('<EdicaoDeDespesa>', () => {
  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ associacao: '' });
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados do documento")).toBeInTheDocument();
  });

  test('Deve renderizar o componente na visao DRE', async () => {
    useParams.mockReturnValue({ associacao: '' });
    visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados do documento")).toBeInTheDocument();
  });

  test('Deve renderizar o componente na visao UE com origemAnaliseLancamento = true', async () => {
    const parametroLocation = {
      state: {
        operacao: 'requer_exclusao_lancamento_gasto',
        origem_visao: 'UE',
        origem: '/consulta-detalhamento-analise-da-dre'
      }
    }
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados do documento")).toBeInTheDocument();
  });

  test('Deve renderizar o componente na visao UE com origemAnaliseLancamento = true com a state.operacao diferente de "requer_exclusao_lancamento_gasto"', async () => {
    const parametroLocation = {
      state: {
        operacao: 'teste',
        origem_visao: 'UE',
        origem: '/consulta-detalhamento-analise-da-dre'
      }
    }
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados do documento")).toBeInTheDocument();
  });

  test('Deve renderizar o componente na visao UE com origemAnaliseLancamento = false', async () => {
    const parametroLocation = {
      state: {
        operacao: 'requer_exclusao_lancamento_gasto',
        origem_visao: 'UE',
        origem: '/consulta-detalhamento-analise-da-dre'
      }
    }
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
    
    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    )
    expect(screen.getByText("Dados do documento")).toBeInTheDocument();
  });

});
