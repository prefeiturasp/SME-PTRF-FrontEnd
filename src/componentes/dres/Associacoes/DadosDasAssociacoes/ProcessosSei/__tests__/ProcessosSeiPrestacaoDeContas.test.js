import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

jest.mock('../ProcessoSeiPrestacaoDeContaForm', () => ({
  ProcessoSeiPrestacaoDeContaForm: () => <div data-testid="form">Formulário</div>,
}));

jest.mock('primereact/datatable', () => ({
  DataTable: ({ value }) => (
    <div data-testid="table">
      {value && value.map(item => <span key={item.uuid}>{item.numero_processo}</span>)}
    </div>
  ),
}));

jest.mock('../../../../../../services/dres/Associacoes.service');
jest.mock('../../../../../../services/dres/ProcessosAssociacao.service');
jest.mock('../../../../../../services/visoes.service');
jest.mock('../../../../../../hooks/Globais/useRecursoSelecionado');

/* eslint-disable-next-line import/first */
import { ProcessosSeiPrestacaoDeContas } from '../ProcessosSeiPrestacaoDeContas';

const mockStore = {
  getState: () => ({}),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
};

const setupMocks = () => {
  const { getProcessosAssociacao } = require('../../../../../../services/dres/Associacoes.service');
  const { visoesService } = require('../../../../../../services/visoes.service');
  const useRecursoSelecionado = require('../../../../../../hooks/Globais/useRecursoSelecionado').default;

  getProcessosAssociacao.mockResolvedValue([
    {
      uuid: 'p1',
      numero_processo: '12345',
      ano: '2024',
      periodos: [],
      permite_exclusao: true,
      tooltip_exclusao: '',
    },
  ]);

  if (visoesService) {
    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);
    visoesService.getPermissoes = jest.fn().mockReturnValue(true);
  }

  useRecursoSelecionado.mockReturnValue({
    recursos: [{ uuid: 'r1', nome: 'Recurso 1' }],
  });
};

describe('ProcessosSeiPrestacaoDeContas Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  test('1. Renderiza sem erros', () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    const { container } = render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    expect(container).toBeDefined();
  });

  test('2. Exibe o título', async () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    const titulo = await screen.findByText('Processos SEI de prestação de contas');
    expect(titulo).toBeInTheDocument();
  });

  test('3. Renderiza a tabela', async () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    const table = await screen.findByTestId('table');
    expect(table).toBeInTheDocument();
  });

  test('4. Renderiza o formulário', () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    const form = screen.getByTestId('form');
    expect(form).toBeInTheDocument();
  });

  test('5. Chama serviço ao montar', async () => {
    const { getProcessosAssociacao } = require('../../../../../../services/dres/Associacoes.service');
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(getProcessosAssociacao).toHaveBeenCalled();
    });
  });

  test('6. Não renderiza sem UUID', () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: undefined } },
      recurso_uuid: 'r1',
      recurso_nome: 'Recurso 1',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    const titulo = screen.queryByText('Processos SEI de prestação de contas');
    expect(titulo).not.toBeInTheDocument();
  });

  test('7. Funciona com props válidas', () => {
    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'associacao-123' } },
      recurso_uuid: 'recurso-1',
      recurso_nome: 'Recurso Teste',
    };

    const { container } = render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    expect(container.children.length).toBeGreaterThan(0);
  });

  test('8. Exibe sub-aba de recurso quando usuário tem múltiplos recursos', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');
    const useRecursoSelecionado = require('../../../../../../hooks/Globais/useRecursoSelecionado').default;

    // Mock com múltiplos recursos e feature flag ativa
    useRecursoSelecionado.mockReturnValue({
      recursos: [
        { uuid: 'r1', nome: 'Recurso 1' },
        { uuid: 'r2', nome: 'Recurso 2' },
        { uuid: 'r3', nome: 'Recurso 3' },
      ],
    });

    visoesService.featureFlagAtiva = jest.fn((flag) => {
      if (flag === 'premio-excelencia-processo-sei') {
        return true;
      }
      return false;
    });

    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    // Valida que o nome do recurso é exibido
    const recursoLabel = await screen.findByText('Prêmio Excelência');
    expect(recursoLabel).toBeInTheDocument();

    // Valida que a feature flag foi verificada
    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('premio-excelencia-processo-sei');
  });

  test('9. Não exibe sub-aba de recurso quando feature flag está inativa', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');
    const useRecursoSelecionado = require('../../../../../../hooks/Globais/useRecursoSelecionado').default;

    // Mock com múltiplos recursos mas feature flag inativa
    useRecursoSelecionado.mockReturnValue({
      recursos: [
        { uuid: 'r1', nome: 'Recurso 1' },
        { uuid: 'r2', nome: 'Recurso 2' },
      ],
    });

    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);

    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    // Com feature flag inativa, o label do recurso não deve ser exibido
    const recursoLabel = screen.queryByText('Prêmio Excelência');
    expect(recursoLabel).not.toBeInTheDocument();
  });

  test('10. Não exibe sub-aba quando usuário tem apenas um recurso', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');
    const useRecursoSelecionado = require('../../../../../../hooks/Globais/useRecursoSelecionado').default;

    // Mock com um único recurso
    useRecursoSelecionado.mockReturnValue({
      recursos: [{ uuid: 'r1', nome: 'Recurso 1' }],
    });

    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);

    const props = {
      dadosDaAssociacao: { dados_da_associacao: { uuid: 'a1' } },
      recurso_uuid: 'r1',
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...props} />
      </Provider>
    );

    // Com um único recurso, o label não deve ser exibido mesmo com feature flag ativa
    const recursoLabel = screen.queryByText('Prêmio Excelência');
    expect(recursoLabel).not.toBeInTheDocument();
  });
});
