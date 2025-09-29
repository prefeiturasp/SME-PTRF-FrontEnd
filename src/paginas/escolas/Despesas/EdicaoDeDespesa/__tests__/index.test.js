import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React  from "react";
import { useParams, useLocation, MemoryRouter, useNavigate } from "react-router-dom"
import { EdicaoDeDespesa, tituloPagina } from "../index";
import { visoesService } from "../../../../../services/visoes.service";
import {DespesaContext} from "../../../../../context/Despesa";
import { metodosAuxiliares } from "../../../../../componentes/escolas/Despesas/metodosAuxiliares";
import { getDespesa, getDespesasTabelas, getEspecificacoesCapital, getEspecificacoesCusteio } from "../../../../../services/escolas/Despesas.service";

jest.mock("../../../../../services/escolas/Despesas.service", () => ({
  getDespesa: jest.fn(),
  getDespesasTabelas: jest.fn(),
  getEspecificacoesCapital: jest.fn(),
  getEspecificacoesCusteio: jest.fn(),
}));

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

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: () => mockNavigate
}));

const mockDespesaData = {
  rateios: [{
    associacao: 'test',
    conta_associacao: 'test',
    acao_associacao: 'test',
    aplicacao_recurso: 'CUSTEIO',
    tipo_custeio: 'test',
    especificacao_material_servico: 'test',
    valor_rateio: '100',
    quantidade_itens_capital: '1',
    valor_item_capital: '50',
    numero_processo_incorporacao_capital: 'test',
    valor_original: '100'
  }],
  despesas_impostos: [],
  data_documento: '2023-01-01',
  data_transacao: '2023-01-01',
  motivos_pagamento_antecipado: [],
  outros_motivos_pagamento_antecipado: '',
  valor_total: '100',
  valor_recursos_proprios: '0',
  valor_original: '100',
  valor_total_dos_rateios: '100'
};

const contexto = {
  initialValues: { outros_motivos_pagamento_antecipado: ''},
  setVerboHttp: jest.fn(),
  setIdDespesa: jest.fn(),
  setInitialValues: jest.fn(),
}
describe('<EdicaoDeDespesa>', () => {
beforeEach(() => {
  mockNavigate.mockClear();

  getDespesa.mockResolvedValue(mockDespesaData);

  getDespesasTabelas.mockResolvedValue({
    tipos_custeio: [],
    especificacoes_custeio: [],
    aplicacoes_recurso: [],
    naturezas: [],
    categorias: [],
    especificacoes: [],
    formas_pagamento: [],
    documentos: [],
    impostos: [],
    motivos_pagamento_antecipado: [],
  });

  const mockData = { results: [] };
  getEspecificacoesCapital.mockResolvedValue(mockData);
  getEspecificacoesCusteio.mockResolvedValue(mockData);

  visoesService.getItemUsuarioLogado.mockReturnValue('UE');
  contexto.setVerboHttp.mockClear();
  contexto.setIdDespesa.mockClear();
  contexto.setInitialValues.mockClear();
});

  test('Deve renderizar o componente', async () => {
    useParams.mockReturnValue({ associacao: '' });
    useLocation.mockReturnValue({ state: null });
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
    useLocation.mockReturnValue({ state: null });
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

  test('Deve renderizar botão "Voltar para Situação Patrimonial" quando veioDeSituacaoPatrimonial é true', () => {
    const parametroLocation = {
      state: {
        origem: 'situacao_patrimonial'
      }
    };
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    const botoes = screen.getAllByText("Voltar para Situação Patrimonial");
    expect(botoes).toHaveLength(2); // Há dois botões sendo renderizados
    expect(botoes[0]).toBeInTheDocument();
  });

  test('Deve navegar para "/lista-situacao-patrimonial" quando visão é UE e clica no botão', () => {
    const parametroLocation = {
      state: {
        origem: 'situacao_patrimonial'
      }
    };
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    const botoes = screen.getAllByText("Voltar para Situação Patrimonial");
    fireEvent.click(botoes[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/lista-situacao-patrimonial');
  });

  test('Deve navegar para "/dre-detalhes-associacao" quando visão é DRE e clica no botão', () => {
    const parametroLocation = {
      state: {
        origem: 'situacao_patrimonial'
      }
    };
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('DRE');

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    const botoes = screen.getAllByText("Voltar para Situação Patrimonial");
    fireEvent.click(botoes[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhes-associacao/situacao-patrimonial');
  });

  test('Não deve renderizar botão quando veioDeSituacaoPatrimonial é false', () => {
    const parametroLocation = {
      state: {
        origem: 'outra_origem'
      }
    };
    useParams.mockReturnValue({ associacao: '1234' });
    useLocation.mockReturnValue(parametroLocation);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');

    render(
      <MemoryRouter>
        <DespesaContext.Provider value={contexto}>
          <EdicaoDeDespesa/>
        </DespesaContext.Provider>
      </MemoryRouter>
    );

    const botao = screen.queryByText("Voltar para Situação Patrimonial");
    expect(botao).not.toBeInTheDocument();
  });

});