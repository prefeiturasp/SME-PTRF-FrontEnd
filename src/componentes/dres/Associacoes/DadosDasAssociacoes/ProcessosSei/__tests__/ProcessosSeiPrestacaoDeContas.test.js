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

/* eslint-disable-next-line import/first */
import { ProcessosSeiPrestacaoDeContas } from '../ProcessosSeiPrestacaoDeContas';

const mockStore = {
  getState: () => ({}),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
};

const globalProps = {
  dadosDaAssociacao: { 
    dados_da_associacao: { 
      uuid: 'a1',
      recursos_da_associacao: [{ uuid: 'r1', nome: 'Recurso 1' }]
    } 
  },
  recurso_uuid: 'r1',
  recurso_nome: 'Recurso 1',
};

const setupMocks = () => {
  const { getProcessosAssociacao } = require('../../../../../../services/dres/Associacoes.service');
  const { visoesService } = require('../../../../../../services/visoes.service');

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
};

describe('ProcessosSeiPrestacaoDeContas Testes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  test('1. Renderiza sem erros', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...globalProps} />
      </Provider>
    );

    expect(container).toBeDefined();
  });

  test('2. Exibe o título', async () => {
    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...globalProps} />
      </Provider>
    );

    const titulo = await screen.findByText('Processos SEI de prestação de contas');
    expect(titulo).toBeInTheDocument();
  });

  test('3. Renderiza a tabela', async () => {
    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...globalProps} />
      </Provider>
    );

    const table = await screen.findByTestId('table');
    expect(table).toBeInTheDocument();
  });

  test('4. Renderiza o formulário', () => {
    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...globalProps} />
      </Provider>
    );

    const form = screen.getByTestId('form');
    expect(form).toBeInTheDocument();
  });

  test('5. Chama serviço ao montar', async () => {
    const { getProcessosAssociacao } = require('../../../../../../services/dres/Associacoes.service');

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...globalProps} />
      </Provider>
    );

    await waitFor(() => {
      expect(getProcessosAssociacao).toHaveBeenCalled();
    });
  });

  test('6. Não renderiza sem UUID', () => {
    const customProps = {
      ...globalProps,
      dadosDaAssociacao: { dados_da_associacao: { uuid: undefined } },
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...customProps} />
      </Provider>
    );

    const titulo = screen.queryByText('Processos SEI de prestação de contas');
    expect(titulo).not.toBeInTheDocument();
  });

  test('7. Funciona com props válidas', () => {
    const customProps = {
      ...globalProps,
      dadosDaAssociacao: {
        dados_da_associacao: {
          uuid: 'associacao-123',
          recursos_da_associacao: [{ uuid: 'recurso-1', nome: 'Recurso Teste' }],
        },
      },
      recurso_uuid: 'recurso-1',
      recurso_nome: 'Recurso Teste',
    };

    const { container } = render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...customProps} />
      </Provider>
    );

    expect(container.children.length).toBeGreaterThan(0);
  });

  test('8. Exibe sub-aba de recurso quando usuário tem múltiplos recursos', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');

    visoesService.featureFlagAtiva = jest.fn((flag) => {
      if (flag === 'premio-excelencia-processo-sei') {
        return true;
      }
      return false;
    });

    const customProps = {
      ...globalProps,
      dadosDaAssociacao: {
        dados_da_associacao: {
          uuid: 'a1',
          recursos_da_associacao: [
            { uuid: 'r1', nome: 'Recurso 1' },
            { uuid: 'r2', nome: 'Recurso 2' },
            { uuid: 'r3', nome: 'Recurso 3' },
          ],
        },
      },
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...customProps} />
      </Provider>
    );

    const recursoLabel = await screen.findByText('Prêmio Excelência');
    expect(recursoLabel).toBeInTheDocument();

    expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith('premio-excelencia-processo-sei');
  });

  test('9. Não exibe sub-aba de recurso quando feature flag está inativa', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');

    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(false);

    const customProps = {
      ...globalProps,
      dadosDaAssociacao: {
        dados_da_associacao: {
          uuid: 'a1',
          recursos_da_associacao: [
            { uuid: 'r1', nome: 'Recurso 1' },
            { uuid: 'r2', nome: 'Recurso 2' },
          ],
        },
      },
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...customProps} />
      </Provider>
    );

    const recursoLabel = screen.queryByText('Prêmio Excelência');
    expect(recursoLabel).not.toBeInTheDocument();
  });

  test('10. Não exibe sub-aba quando usuário tem apenas um recurso', async () => {
    const { visoesService } = require('../../../../../../services/visoes.service');

    visoesService.featureFlagAtiva = jest.fn().mockReturnValue(true);

    const customProps = {
      ...globalProps,
      recurso_nome: 'Prêmio Excelência',
    };

    render(
      <Provider store={mockStore}>
        <ProcessosSeiPrestacaoDeContas {...customProps} />
      </Provider>
    );

    const recursoLabel = screen.queryByText('Prêmio Excelência');
    expect(recursoLabel).not.toBeInTheDocument();
  });
});
